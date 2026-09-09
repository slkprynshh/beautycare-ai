from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon, require_role
from app.models.salon import Salon
from app.services.staff_service import StaffServiceLogic
from app.schemas.common import ResponseEnvelope
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse
from app.core.constants import UserRole

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.get("", response_model=ResponseEnvelope[List[StaffResponse]])
async def list_staff(
    active_only: bool = Query(True),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = StaffServiceLogic(db)
    staff_list = await service.list_staff(current_salon.id, active_only=active_only)
    return ResponseEnvelope(success=True, data=[StaffResponse.model_validate(s) for s in staff_list])


@router.post("", response_model=ResponseEnvelope[StaffResponse])
async def create_staff(
    payload: StaffCreate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = StaffServiceLogic(db)
    staff = await service.create_staff(current_salon.id, payload)
    return ResponseEnvelope(success=True, message="Staff member added", data=StaffResponse.model_validate(staff))


@router.get("/{staff_id}", response_model=ResponseEnvelope[StaffResponse])
async def get_staff_detail(
    staff_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = StaffServiceLogic(db)
    staff = await service.get_staff_by_id(current_salon.id, staff_id)
    return ResponseEnvelope(success=True, data=StaffResponse.model_validate(staff))


@router.patch("/{staff_id}", response_model=ResponseEnvelope[StaffResponse])
async def update_staff(
    staff_id: str,
    payload: StaffUpdate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = StaffServiceLogic(db)
    staff = await service.update_staff(current_salon.id, staff_id, payload)
    return ResponseEnvelope(success=True, message="Staff member updated", data=StaffResponse.model_validate(staff))


@router.delete("/{staff_id}", response_model=ResponseEnvelope[dict])
async def delete_staff(
    staff_id: str,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER, UserRole.MANAGER])),
):
    service = StaffServiceLogic(db)
    await service.delete_staff(current_salon.id, staff_id)
    return ResponseEnvelope(success=True, message="Staff member removed", data={"id": staff_id})
