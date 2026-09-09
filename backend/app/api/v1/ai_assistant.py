from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon
from app.models.salon import Salon
from app.services.ai_service import AIService
from app.schemas.common import ResponseEnvelope
from app.schemas.ai import (
    AIParseRequest,
    AIParseResponse,
    AIDraftReplyRequest,
    AIDraftReplyResponse,
)

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/parse", response_model=ResponseEnvelope[AIParseResponse])
async def parse_customer_message(
    payload: AIParseRequest,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = AIService(db)
    result = await service.parse_text_endpoint(
        salon_id=current_salon.id,
        text=payload.text,
        customer_id=payload.customer_id,
    )
    return ResponseEnvelope(success=True, data=result)


@router.post("/draft-reply", response_model=ResponseEnvelope[AIDraftReplyResponse])
async def generate_draft_reply(
    payload: AIDraftReplyRequest,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = AIService(db)
    parsed = await service.parse_text_endpoint(
        salon_id=current_salon.id,
        text=payload.last_message,
        customer_id=payload.customer_id,
    )
    draft = AIDraftReplyResponse(
        draft_reply=parsed.suggested_reply,
        detected_intent=parsed.detected_intent,
        confidence=parsed.confidence_score,
        action_type="SUGGESTION_ONLY",
    )
    return ResponseEnvelope(success=True, data=draft)
