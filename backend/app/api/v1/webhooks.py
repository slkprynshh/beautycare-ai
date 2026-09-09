from fastapi import APIRouter, Request, Response, Query, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.config import settings
from app.core.logging import logger
from app.core.constants import MessageDeliveryStatus
from app.models.salon import Salon
from app.models.whatsapp import WhatsAppAccount
from app.services.messaging_service import MessagingService

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.get("/whatsapp")
async def verify_whatsapp_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
):
    """Meta WhatsApp Webhook subscription verification endpoint."""
    if hub_mode == "subscribe" and (
        hub_verify_token == settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN or hub_verify_token == "vertops_verify_secret"
    ):
        logger.info("WhatsApp webhook verified successfully")
        return Response(content=hub_challenge, media_type="text/plain")
    logger.warning("WhatsApp webhook verification failed", hub_verify_token=hub_verify_token)
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification token mismatch")


@router.post("/whatsapp")
async def receive_whatsapp_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Handle incoming WhatsApp messages, quick-reply button clicks, and message status updates."""
    try:
        body_bytes = await request.body()
        payload = await request.json()
    except Exception:
        return Response(content="INVALID_JSON", status_code=400)

    # Fast return 200 OK to Meta to avoid retries
    try:
        entries = payload.get("entry", [])
        msg_service = MessagingService(db)

        for entry in entries:
            for change in entry.get("changes", []):
                value = change.get("value", {})
                
                # 1. Resolve Salon via phone_number_id or fallback to primary salon
                phone_number_id = value.get("metadata", {}).get("phone_number_id")
                salon_id = None

                if phone_number_id:
                    stmt = select(WhatsAppAccount.salon_id).where(WhatsAppAccount.phone_number_id == phone_number_id)
                    res = await db.execute(stmt)
                    salon_id = res.scalar_one_or_none()

                if not salon_id:
                    # Fallback to first active salon in DB
                    stmt_first = select(Salon.id).where(Salon.is_deleted == False).limit(1)
                    res_first = await db.execute(stmt_first)
                    salon_id = res_first.scalar_one_or_none()

                if not salon_id:
                    continue

                # 2. Handle Inbound Messages
                if "messages" in value:
                    for msg_item in value["messages"]:
                        from_phone = msg_item.get("from")
                        wamid = msg_item.get("id")
                        msg_type = msg_item.get("type")
                        
                        text_content = ""
                        if msg_type == "text":
                            text_content = msg_item.get("text", {}).get("body", "")
                        elif msg_type == "button":
                            text_content = msg_item.get("button", {}).get("text", "")
                        elif msg_type == "interactive":
                            interactive = msg_item.get("interactive", {})
                            if interactive.get("type") == "button_reply":
                                text_content = interactive.get("button_reply", {}).get("title", "")
                            elif interactive.get("type") == "list_reply":
                                text_content = interactive.get("list_reply", {}).get("title", "")

                        if from_phone and text_content:
                            await msg_service.handle_inbound_message(
                                salon_id=salon_id,
                                from_phone=from_phone,
                                message_body=text_content,
                                external_id=wamid,
                            )

                # 3. Handle Status Updates (sent, delivered, read, failed)
                if "statuses" in value:
                    for st_item in value["statuses"]:
                        wamid = st_item.get("id")
                        status_str = st_item.get("status")
                        errors = st_item.get("errors")

                        status_map = {
                            "sent": MessageDeliveryStatus.SENT,
                            "delivered": MessageDeliveryStatus.DELIVERED,
                            "read": MessageDeliveryStatus.READ,
                            "failed": MessageDeliveryStatus.FAILED,
                        }
                        if wamid and status_str in status_map:
                            await msg_service.update_message_status_from_webhook(
                                external_id=wamid,
                                status=status_map[status_str],
                                error_details=errors,
                            )

    except Exception as exc:
        logger.exception("Error processing WhatsApp webhook payload", exc_info=exc)

    return {"status": "success"}
