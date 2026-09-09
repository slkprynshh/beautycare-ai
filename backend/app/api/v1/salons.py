from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon, require_role
from app.models.salon import Salon
from app.services.salon_service import SalonService
from app.schemas.common import ResponseEnvelope
from app.schemas.salon import SalonResponse, SalonUpdate, BusinessHoursCreate, BusinessHoursResponse
from app.core.constants import UserRole

router = APIRouter(prefix="/salons", tags=["Salons"])


@router.get("/current", response_model=ResponseEnvelope[SalonResponse])
async def get_current_salon_details(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = SalonService(db)
    salon = await service.get_salon_by_id(current_salon.id)
    return ResponseEnvelope(success=True, data=SalonResponse.model_validate(salon))


@router.patch("/current", response_model=ResponseEnvelope[SalonResponse])
async def update_current_salon_profile(
    payload: SalonUpdate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = SalonService(db)
    salon = await service.update_salon(current_salon.id, payload)
    return ResponseEnvelope(success=True, message="Salon profile updated", data=SalonResponse.model_validate(salon))


@router.get("/current/business-hours", response_model=ResponseEnvelope[List[BusinessHoursResponse]])
async def get_current_business_hours(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = SalonService(db)
    hours = await service.get_business_hours(current_salon.id)
    return ResponseEnvelope(success=True, data=[BusinessHoursResponse.model_validate(h) for h in hours])


@router.put("/current/business-hours", response_model=ResponseEnvelope[List[BusinessHoursResponse]])
async def update_current_business_hours(
    payload: List[BusinessHoursCreate],
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = SalonService(db)
    hours = await service.set_business_hours(current_salon.id, payload)
    return ResponseEnvelope(success=True, message="Business hours updated", data=[BusinessHoursResponse.model_validate(h) for h in hours])
