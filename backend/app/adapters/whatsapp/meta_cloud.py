import hmac
import hashlib
from typing import Dict, Any, Optional, List
import httpx

from app.adapters.whatsapp.base import BaseWhatsAppAdapter, WhatsAppSendResult
from app.core.config import settings
from app.core.logging import logger


class MetaWhatsAppCloudAdapter(BaseWhatsAppAdapter):
    """Production Meta WhatsApp Cloud Graph API v20.0 adapter."""

    def __init__(self, default_phone_number_id: Optional[str] = None, default_access_token: Optional[str] = None):
        self.default_phone_number_id = default_phone_number_id or settings.WHATSAPP_PHONE_NUMBER_ID
        self.default_access_token = default_access_token or settings.WHATSAPP_ACCESS_TOKEN
        self.api_version = settings.WHATSAPP_API_VERSION

    async def send_text_message(
        self,
        to_phone: str,
        text: str,
        phone_number_id: Optional[str] = None,
        access_token: Optional[str] = None,
    ) -> WhatsAppSendResult:
        p_id = phone_number_id or self.default_phone_number_id
        token = access_token or self.default_access_token
        url = f"https://graph.facebook.com/{self.api_version}/{p_id}/messages"

        # E.164 without leading plus for Meta Cloud API payload
        clean_phone = to_phone.replace("+", "").strip()
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": clean_phone,
            "type": "text",
            "text": {"preview_url": False, "body": text},
        }
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                data = resp.json()
                if resp.status_code in [200, 201] and "messages" in data:
                    wamid = data["messages"][0]["id"]
                    return WhatsAppSendResult(
                        success=True,
                        external_message_id=wamid,
                        raw_response=data,
                    )
                else:
                    error_data = data.get("error", {})
                    logger.error(
                        "WhatsApp send text failed",
                        status_code=resp.status_code,
                        error=error_data,
                    )
                    return WhatsAppSendResult(
                        success=False,
                        error_code=str(error_data.get("code", resp.status_code)),
                        error_message=error_data.get("message", "Failed to send message"),
                        raw_response=data,
                    )
        except Exception as exc:
            logger.exception("Meta WhatsApp API exception", exc_info=exc)
            return WhatsAppSendResult(
                success=False,
                error_code="NETWORK_EXCEPTION",
                error_message=str(exc),
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
        p_id = phone_number_id or self.default_phone_number_id
        token = access_token or self.default_access_token
        url = f"https://graph.facebook.com/{self.api_version}/{p_id}/messages"

        clean_phone = to_phone.replace("+", "").strip()
        components = []
        if variables:
            parameters = [{"type": "text", "text": v} for v in variables]
            components.append({"type": "body", "parameters": parameters})

        if button_payloads:
            for idx, payload_val in enumerate(button_payloads):
                components.append({
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": idx,
                    "parameters": [{"type": "payload", "payload": payload_val}],
                })

        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": clean_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language_code},
                "components": components,
            },
        }
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                data = resp.json()
                if resp.status_code in [200, 201] and "messages" in data:
                    wamid = data["messages"][0]["id"]
                    return WhatsAppSendResult(
                        success=True,
                        external_message_id=wamid,
                        raw_response=data,
                    )
                else:
                    error_data = data.get("error", {})
                    logger.error(
                        "WhatsApp send template failed",
                        status_code=resp.status_code,
                        error=error_data,
                    )
                    return WhatsAppSendResult(
                        success=False,
                        error_code=str(error_data.get("code", resp.status_code)),
                        error_message=error_data.get("message", "Failed to send template message"),
                        raw_response=data,
                    )
        except Exception as exc:
            logger.exception("Meta WhatsApp API template exception", exc_info=exc)
            return WhatsAppSendResult(
                success=False,
                error_code="NETWORK_EXCEPTION",
                error_message=str(exc),
            )

    async def verify_webhook_signature(
        self,
        raw_body: bytes,
        signature_header: str,
        app_secret: str,
    ) -> bool:
        if not signature_header or not signature_header.startswith("sha256="):
            return False
        expected_sig = signature_header.split("sha256=")[1]
        calculated_sig = hmac.new(
            app_secret.encode("utf-8"),
            raw_body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(calculated_sig, expected_sig)
