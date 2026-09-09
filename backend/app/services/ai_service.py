from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.ai import AIInteraction
from app.models.customer import CustomerProfile
from app.models.whatsapp import Message
from app.models.salon import Salon
from app.models.service import Service
from app.models.staff import StaffProfile
from app.adapters import get_ai_adapter
from app.schemas.ai import AIParseResponse, ExtractedBookingEntities, AIDraftReplyResponse


class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def process_inbound_message(
        self,
        salon_id: str,
        customer: CustomerProfile,
        message: Message,
    ) -> AIInteraction:
        # Load salon and services context
        stmt_s = select(Salon).where(Salon.id == salon_id)
        res_s = await self.db.execute(stmt_s)
        salon = res_s.scalars().first()
        salon_name = salon.name if salon else "VertOps Salon"

        stmt_svc = select(Service.name).where(Service.salon_id == salon_id, Service.is_active == True)
        res_svc = await self.db.execute(stmt_svc)
        services = list(res_svc.scalars().all())

        stmt_st = select(StaffProfile.full_name).where(StaffProfile.salon_id == salon_id, StaffProfile.is_active == True)
        res_st = await self.db.execute(stmt_st)
        staff_names = list(res_st.scalars().all())

        adapter = get_ai_adapter()
        ai_out = await adapter.parse_and_draft(
            customer_message=message.body,
            customer_name=customer.full_name,
            salon_name=salon_name,
            available_services=services,
            available_staff=staff_names,
        )

        interaction = AIInteraction(
            tenant_id=salon_id,
            salon_id=salon_id,
            customer_id=customer.id,
            message_id=message.id,
            interaction_type="INTENT_AND_DRAFT",
            input_text=message.body,
            extracted_intent=ai_out.intent,
            extracted_entities=ai_out.entities,
            generated_reply=ai_out.suggested_reply,
            confidence_score=ai_out.confidence,
            requires_human_review=ai_out.requires_human_review,
            model_name=ai_out.model_name,
            latency_ms=ai_out.latency_ms,
        )
        self.db.add(interaction)
        await self.db.flush()
        return interaction

    async def parse_text_endpoint(
        self,
        salon_id: str,
        text: str,
        customer_id: Optional[str] = None,
    ) -> AIParseResponse:
        customer_name = "Guest"
        if customer_id:
            stmt_c = select(CustomerProfile).where(CustomerProfile.id == customer_id, CustomerProfile.salon_id == salon_id)
            res_c = await self.db.execute(stmt_c)
            cust = res_c.scalars().first()
            if cust:
                customer_name = cust.full_name

        stmt_s = select(Salon).where(Salon.id == salon_id)
        res_s = await self.db.execute(stmt_s)
        salon = res_s.scalars().first()
        salon_name = salon.name if salon else "VertOps Salon"

        stmt_svc = select(Service.name).where(Service.salon_id == salon_id, Service.is_active == True)
        res_svc = await self.db.execute(stmt_svc)
        services = list(res_svc.scalars().all())

        stmt_st = select(StaffProfile.full_name).where(StaffProfile.salon_id == salon_id, StaffProfile.is_active == True)
        res_st = await self.db.execute(stmt_st)
        staff_names = list(res_st.scalars().all())

        adapter = get_ai_adapter()
        ai_out = await adapter.parse_and_draft(
            customer_message=text,
            customer_name=customer_name,
            salon_name=salon_name,
            available_services=services,
            available_staff=staff_names,
        )

        return AIParseResponse(
            detected_intent=ai_out.intent,
            confidence_score=ai_out.confidence,
            requires_human_review=ai_out.requires_human_review,
            entities=ExtractedBookingEntities(
                requested_date=ai_out.entities.get("requested_date"),
                requested_time=ai_out.entities.get("requested_time"),
                service_names=ai_out.entities.get("service_names", []),
                staff_name=ai_out.entities.get("staff_name"),
                cancellation_requested=ai_out.entities.get("cancellation_requested", False),
                reschedule_requested=ai_out.entities.get("reschedule_requested", False),
            ),
            suggested_reply=ai_out.suggested_reply,
        )
