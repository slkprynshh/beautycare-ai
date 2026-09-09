from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon, get_current_user
from app.models.salon import Salon
from app.models.user import User
from app.services.appointment_service import AppointmentServiceLogic
from app.schemas.common import ResponseEnvelope
from app.schemas.appointment import (
    AppointmentResponse,
    AppointmentDetailResponse,
    AppointmentCreate,
    AppointmentStatusChange,
)
from app.core.constants import AppointmentStatus

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=ResponseEnvelope[List[AppointmentResponse]])
async def list_appointments(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    staff_id: Optional[str] = Query(None),
    customer_id: Optional[str] = Query(None),
    status: Optional[AppointmentStatus] = Query(None),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = AppointmentServiceLogic(db)
    appts = await service.list_appointments(
        salon_id=current_salon.id,
        start_date=start_date,
        end_date=end_date,
        staff_id=staff_id,
        customer_id=customer_id,
        status=status,
    )
    return ResponseEnvelope(success=True, data=[AppointmentResponse.model_validate(a) for a in appts])


@router.post("", response_model=ResponseEnvelope[AppointmentResponse])
async def create_appointment(
    payload: AppointmentCreate,
    current_salon: Salon = Depends(get_current_salon),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AppointmentServiceLogic(db)
    appt = await service.create_appointment(current_salon.id, payload, actor_id=current_user.id)
    return ResponseEnvelope(success=True, message="Appointment booked successfully", data=AppointmentResponse.model_validate(appt))


@router.get("/{appointment_id}", response_model=ResponseEnvelope[AppointmentDetailResponse])
async def get_appointment(
    appointment_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = AppointmentServiceLogic(db)
    appt = await service.get_appointment_by_id(current_salon.id, appointment_id)
    return ResponseEnvelope(success=True, data=AppointmentDetailResponse.model_validate(appt))


@router.patch("/{appointment_id}/status", response_model=ResponseEnvelope[AppointmentResponse])
async def update_appointment_status(
    appointment_id: str,
    payload: AppointmentStatusChange,
    current_salon: Salon = Depends(get_current_salon),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AppointmentServiceLogic(db)
    appt = await service.update_status(current_salon.id, appointment_id, payload, actor_id=current_user.id)
    return ResponseEnvelope(success=True, message=f"Appointment marked as {payload.status.value}", data=AppointmentResponse.model_validate(appt))
