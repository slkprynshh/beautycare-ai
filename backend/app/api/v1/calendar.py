from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon
from app.models.salon import Salon
from app.services.calendar_service import CalendarService
from app.schemas.common import ResponseEnvelope
from app.schemas.calendar import CalendarViewResponse

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.get("/day", response_model=ResponseEnvelope[CalendarViewResponse])
async def get_day_schedule(
    view_date: Optional[date] = Query(None),
    staff_id: Optional[str] = Query(None),
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    target_date = view_date or date.today()
    service = CalendarService(db)
    sched = await service.get_day_schedule(
        salon_id=current_salon.id,
        target_date=target_date,
        staff_id_filter=staff_id,
    )
    return ResponseEnvelope(success=True, data=sched)
