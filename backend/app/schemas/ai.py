from typing import Optional, Dict, Any, List
from pydantic import Field
from app.schemas.common import BaseSchema
from app.core.constants import AIIntentType


class AIParseRequest(BaseSchema):
    text: str = Field(..., description="Raw text from customer message")
    customer_id: Optional[str] = None
    thread_id: Optional[str] = None


class ExtractedBookingEntities(BaseSchema):
    requested_date: Optional[str] = None
    requested_time: Optional[str] = None
    service_names: List[str] = []
    staff_name: Optional[str] = None
    cancellation_requested: bool = False
    reschedule_requested: bool = False


class AIParseResponse(BaseSchema):
    detected_intent: AIIntentType
    confidence_score: float
    requires_human_review: bool
    entities: ExtractedBookingEntities
    suggested_reply: str


class AIDraftReplyRequest(BaseSchema):
    customer_id: str
    thread_id: Optional[str] = None
    last_message: str
    intent_override: Optional[AIIntentType] = None
    additional_instructions: Optional[str] = None


class AIDraftReplyResponse(BaseSchema):
    draft_reply: str
    detected_intent: AIIntentType
    confidence: float
    action_type: str = "SUGGESTION_ONLY"
