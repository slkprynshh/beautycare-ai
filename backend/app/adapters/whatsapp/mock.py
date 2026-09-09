import uuid
from typing import Dict, Any, Optional, List
from app.adapters.whatsapp.base import BaseWhatsAppAdapter, WhatsAppSendResult
from app.core.logging import logger


class MockWhatsAppAdapter(BaseWhatsAppAdapter):
    """Deterministic Mock WhatsApp Adapter for testing and local zero-cost simulation."""

    def __init__(self):
        self.sent_messages: List[Dict[str, Any]] = []

    async def send_text_message(
        self,
        to_phone: str,
        text: str,
        phone_number_id: Optional[str] = None,
        access_token: Optional[str] = None,
    ) -> WhatsAppSendResult:
        wamid = f"wamid.mock.{uuid.uuid4().hex[:16]}"
        record = {
            "wamid": wamid,
            "to": to_phone,
            "text": text,
            "type": "text",
            "phone_number_id": phone_number_id,
        }
        self.sent_messages.append(record)
        logger.info("Mock WhatsApp Text Sent", **record)
        return WhatsAppSendResult(
            success=True,
            external_message_id=wamid,
            raw_response={"status": "mock_sent", "wamid": wamid},
        )

    async def send_template_message(
        self,
        to_phone: str,
        template_name: str,
        language_code: str = "en",
        variables: Optional[List[str]] = None,
        button_payloads: Optional[List[str]] = None,
        phone_number_id: Optional[str] = None,
        access_token: Optional[str] = None,
    ) -> WhatsAppSendResult:
        wamid = f"wamid.mock.{uuid.uuid4().hex[:16]}"
        record = {
            "wamid": wamid,
            "to": to_phone,
            "template_name": template_name,
            "variables": variables or [],
            "button_payloads": button_payloads or [],
            "type": "template",
            "phone_number_id": phone_number_id,
        }
        self.sent_messages.append(record)
        logger.info("Mock WhatsApp Template Sent", **record)
        return WhatsAppSendResult(
            success=True,
            external_message_id=wamid,
            raw_response={"status": "mock_sent", "wamid": wamid},
        )

    async def verify_webhook_signature(
        self,
        raw_body: bytes,
        signature_header: str,
        app_secret: str,
    ) -> bool:
        # Always passes in mock mode or if secret matches
        return True
