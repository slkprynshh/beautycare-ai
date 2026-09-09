from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon
from app.models.salon import Salon
from app.services.recovery_service import RecoveryService
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.recovery import (
    RecoveryEventResponse,
    RecoveryMetricsResponse,
    ManualRecoveryTriggerRequest,
)
from app.core.constants import RecoveryStatus, RecoveryTriggerReason

router = APIRouter(prefix="/recovery", tags=["Revenue Recovery"])


@router.get("/metrics", response_model=ResponseEnvelope[RecoveryMetricsResponse])
async def get_recovery_metrics(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = RecoveryService(db)
    metrics = await service.get_metrics(current_salon.id)
    return ResponseEnvelope(success=True, data=metrics)


@router.get("/events", response_model=ResponseEnvelope[PaginatedResponse[RecoveryEventResponse]])
async def list_recovery_events(
    status: Optional[RecoveryStatus] = Query(None),
    reason: Optional[RecoveryTriggerReason] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = RecoveryService(db)
    events, total = await service.list_recovery_events(
        salon_id=current_salon.id,
        status=status,
        trigger_reason=reason,
        page=page,
        page_size=page_size,
    )
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
    paginated = PaginatedResponse[RecoveryEventResponse](
        items=[RecoveryEventResponse.model_validate(e) for e in events],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
    return ResponseEnvelope(success=True, data=paginated)


@router.post("/trigger", response_model=ResponseEnvelope[RecoveryEventResponse])
async def manual_trigger_recovery(
    payload: ManualRecoveryTriggerRequest,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = RecoveryService(db)
    evt = await service.trigger_lapsed_due_recovery(
        salon_id=current_salon.id,
        customer_id=payload.customer_id,
        estimated_revenue_paise=150000,
    )
    if payload.custom_message:
        from app.services.messaging_service import MessagingService
        msg_svc = MessagingService(db)
        await msg_svc.send_text_message(current_salon.id, payload.customer_id, payload.custom_message)
        await service.mark_nudged(current_salon.id, evt.id)

    await db.commit()
    refreshed_evt = await service.get_recovery_event_by_id(current_salon.id, evt.id)
    return ResponseEnvelope(success=True, message="Recovery follow-up triggered", data=RecoveryEventResponse.model_validate(refreshed_evt))
