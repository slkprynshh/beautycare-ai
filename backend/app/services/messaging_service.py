from datetime import datetime
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.whatsapp import WhatsAppAccount, WhatsAppTemplate, MessageThread, Message, MessageEvent
from app.models.customer import CustomerProfile
from app.adapters import get_whatsapp_adapter
from app.core.constants import MessageDirection, MessageDeliveryStatus, MessageType
from app.core.exceptions import NotFoundException, BadRequestException
from app.core.logging import logger
from app.core.security import normalize_phone_number


class MessagingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_thread(self, salon_id: str, customer_id: str) -> MessageThread:
        stmt = (
            select(MessageThread)
            .where(MessageThread.salon_id == salon_id, MessageThread.customer_id == customer_id)
            .options(
                selectinload(MessageThread.customer),
                selectinload(MessageThread.messages),
            )
        )
        res = await self.db.execute(stmt)
        thread = res.scalars().first()
        if not thread:
            thread = MessageThread(
                tenant_id=salon_id,
                salon_id=salon_id,
                customer_id=customer_id,
                unread_count=0,
                ai_handling_state="AWAITING_OWNER_ACTION",
            )
            self.db.add(thread)
            await self.db.flush()
        return thread

    async def list_threads(self, salon_id: str, is_archived: bool = False) -> List[MessageThread]:
        stmt = (
            select(MessageThread)
            .where(
                MessageThread.salon_id == salon_id,
                MessageThread.is_archived == is_archived,
            )
            .options(
                selectinload(MessageThread.customer),
                selectinload(MessageThread.messages),
            )
            .order_by(MessageThread.last_message_at.desc().nullslast(), MessageThread.created_at.desc())
        )
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def get_thread_by_id(self, salon_id: str, thread_id: str) -> MessageThread:
        stmt = (
            select(MessageThread)
            .where(MessageThread.id == thread_id, MessageThread.salon_id == salon_id)
            .options(
                selectinload(MessageThread.customer),
                selectinload(MessageThread.messages).selectinload(Message.events),
            )
        )
        res = await self.db.execute(stmt)
        thread = res.scalars().first()
        if not thread:
            raise NotFoundException("Thread not found")
        return thread

    async def send_text_message(
        self,
        salon_id: str,
        customer_id: str,
        body: str,
        template_id: Optional[str] = None,
    ) -> Message:
        # Check customer opt out
        stmt_c = select(CustomerProfile).where(CustomerProfile.id == customer_id, CustomerProfile.salon_id == salon_id)
        res_c = await self.db.execute(stmt_c)
        cust = res_c.scalars().first()
        if not cust:
            raise NotFoundException("Customer not found")
        if cust.whatsapp_opt_out:
            raise BadRequestException("Customer has opted out of WhatsApp messages")

        thread = await self.get_or_create_thread(salon_id, customer_id)

        msg = Message(
            tenant_id=salon_id,
            salon_id=salon_id,
            thread_id=thread.id,
            customer_id=customer_id,
            direction=MessageDirection.OUTBOUND,
            message_type=MessageType.TEXT if not template_id else MessageType.TEMPLATE,
            status=MessageDeliveryStatus.QUEUED,
            body=body,
            template_id=template_id,
        )
        self.db.add(msg)
        await self.db.flush()

        # Send via WhatsApp adapter
        adapter = get_whatsapp_adapter()
        res = await adapter.send_text_message(to_phone=cust.phone, text=body)

        now = datetime.utcnow()
        if res.success:
            msg.status = MessageDeliveryStatus.SENT
            msg.sent_at = now
            msg.external_id = res.external_message_id
            evt = MessageEvent(
                message_id=msg.id,
                event_type="SENT",
                status=MessageDeliveryStatus.SENT,
                details=res.raw_response,
            )
            self.db.add(evt)
        else:
            msg.status = MessageDeliveryStatus.FAILED
            msg.failed_at = now
            msg.error_code = res.error_code
            msg.error_message = res.error_message
            evt = MessageEvent(
                message_id=msg.id,
                event_type="FAILED",
                status=MessageDeliveryStatus.FAILED,
                details={"error_code": res.error_code, "error_message": res.error_message},
            )
            self.db.add(evt)

        # Update thread snippet
        thread.last_message_at = now
        thread.last_message_snippet = body[:100]

        await self.db.commit()
        await self.db.refresh(msg)
        return msg

    async def handle_inbound_message(
        self,
        salon_id: str,
        from_phone: str,
        message_body: str,
        external_id: Optional[str] = None,
    ) -> Message:
        clean_phone = normalize_phone_number(from_phone)
        # Find or create customer
        stmt_c = select(CustomerProfile).where(CustomerProfile.salon_id == salon_id, CustomerProfile.phone == clean_phone)
        res_c = await self.db.execute(stmt_c)
        cust = res_c.scalars().first()
        if not cust:
            cust = CustomerProfile(
                tenant_id=salon_id,
                salon_id=salon_id,
                full_name=f"Guest ({clean_phone[-4:]})",
                phone=clean_phone,
            )
            self.db.add(cust)
            await self.db.flush()

        # Check for STOP opt-out keywords
        body_clean = message_body.strip().upper()
        if body_clean in ["STOP", "UNSUBSCRIBE", "OPTOUT", "DO NOT DISTURB"]:
            cust.whatsapp_opt_out = True

        thread = await self.get_or_create_thread(salon_id, cust.id)
        now = datetime.utcnow()

        msg = Message(
            tenant_id=salon_id,
            salon_id=salon_id,
            thread_id=thread.id,
            customer_id=cust.id,
            direction=MessageDirection.INBOUND,
            message_type=MessageType.TEXT,
            status=MessageDeliveryStatus.DELIVERED,
            body=message_body,
            external_id=external_id,
            delivered_at=now,
        )
        self.db.add(msg)
        await self.db.flush()

        evt = MessageEvent(
            message_id=msg.id,
            event_type="INBOUND_RECEIVED",
            status=MessageDeliveryStatus.DELIVERED,
        )
        self.db.add(evt)

        thread.last_message_at = now
        thread.last_message_snippet = message_body[:100]
        thread.unread_count += 1
        thread.ai_handling_state = "AWAITING_OWNER_ACTION"

        # Update recovery event if customer replied!
        from app.services.recovery_service import RecoveryService
        rec_svc = RecoveryService(self.db)
        await rec_svc.mark_replied(salon_id, cust.id)

        # Trigger AI analysis on the message
        from app.services.ai_service import AIService
        ai_svc = AIService(self.db)
        await ai_svc.process_inbound_message(salon_id, cust, msg)

        await self.db.commit()
        await self.db.refresh(msg)
        return msg

    async def update_message_status_from_webhook(
        self,
        external_id: str,
        status: MessageDeliveryStatus,
        error_details: Optional[Dict[str, Any]] = None,
    ):
        stmt = select(Message).where(Message.external_id == external_id)
        res = await self.db.execute(stmt)
        msg = res.scalars().first()
        if not msg:
            return

        now = datetime.utcnow()
        msg.status = status
        if status == MessageDeliveryStatus.DELIVERED:
            msg.delivered_at = now
        elif status == MessageDeliveryStatus.READ:
            msg.read_at = now
        elif status == MessageDeliveryStatus.FAILED:
            msg.failed_at = now
            if error_details:
                msg.error_message = str(error_details)

        evt = MessageEvent(
            message_id=msg.id,
            event_type=f"WEBHOOK_{status.value}",
            status=status,
            details=error_details or {},
        )
        self.db.add(evt)
        await self.db.commit()
