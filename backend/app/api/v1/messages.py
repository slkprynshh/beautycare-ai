from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon
from app.models.salon import Salon
from app.services.messaging_service import MessagingService
from app.schemas.common import ResponseEnvelope
from app.schemas.message import (
    ThreadResponse,
    ThreadDetailResponse,
    MessageResponse,
    SendMessageRequest,
)

router = APIRouter(prefix="/messages", tags=["Messages & Inbox"])


@router.get("/threads", response_model=ResponseEnvelope[List[ThreadResponse]])
async def list_threads(
    is_archived: bool = Query(False),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = MessagingService(db)
    threads = await service.list_threads(current_salon.id, is_archived=is_archived)
    return ResponseEnvelope(success=True, data=[ThreadResponse.model_validate(t) for t in threads])


@router.get("/threads/{thread_id}", response_model=ResponseEnvelope[ThreadDetailResponse])
async def get_thread(
    thread_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = MessagingService(db)
    thread = await service.get_thread_by_id(current_salon.id, thread_id)
    # Reset unread count on view
    thread.unread_count = 0
    await db.commit()
    return ResponseEnvelope(success=True, data=ThreadDetailResponse.model_validate(thread))


@router.post("/send", response_model=ResponseEnvelope[MessageResponse])
async def send_message(
    payload: SendMessageRequest,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = MessagingService(db)
    msg = await service.send_text_message(
        salon_id=current_salon.id,
        customer_id=payload.customer_id,
        body=payload.body,
        template_id=payload.template_id,
    )
    return ResponseEnvelope(success=True, message="WhatsApp message dispatched", data=MessageResponse.model_validate(msg))
