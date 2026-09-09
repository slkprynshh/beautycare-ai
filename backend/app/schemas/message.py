from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from app.schemas.common import BaseSchema
from app.schemas.customer import CustomerResponse
from app.core.constants import MessageDirection, MessageDeliveryStatus, MessageType


class SendMessageRequest(BaseSchema):
    customer_id: str
    body: str = Field(..., min_length=1)
    message_type: MessageType = MessageType.TEXT
    template_id: Optional[str] = None
    template_variables: Optional[Dict[str, str]] = None


class MessageResponse(BaseSchema):
    id: str
    thread_id: str
    customer_id: str
    direction: MessageDirection
    message_type: MessageType
    status: MessageDeliveryStatus
    body: str
    template_id: Optional[str] = None
    external_id: Optional[str] = None
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime


class ThreadResponse(BaseSchema):
    id: str
    customer_id: str
    customer: Optional[CustomerResponse] = None
    last_message_at: Optional[datetime] = None
    last_message_snippet: Optional[str] = None
    unread_count: int = 0
    is_archived: bool = False
    ai_handling_state: str
    created_at: datetime


class ThreadDetailResponse(ThreadResponse):
    messages: List[MessageResponse] = []


class WhatsAppWebhookPayload(BaseSchema):
    object: Optional[str] = None
    entry: Optional[List[Dict[str, Any]]] = None
