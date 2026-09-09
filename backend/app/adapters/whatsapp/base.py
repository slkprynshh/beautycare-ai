from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from pydantic import BaseModel


class WhatsAppSendResult(BaseModel):
    success: bool
    external_message_id: Optional[str] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    raw_response: Dict[str, Any] = {}


class BaseWhatsAppAdapter(ABC):
    @abstractmethod
    async def send_text_message(
        self,
        to_phone: str,
        text: str,
        phone_number_id: Optional[str] = None,
        access_token: Optional[str] = None,
    ) -> WhatsAppSendResult:
        pass

    @abstractmethod
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
        pass

    @abstractmethod
    async def verify_webhook_signature(
        self,
        raw_body: bytes,
        signature_header: str,
        app_secret: str,
    ) -> bool:
        pass
