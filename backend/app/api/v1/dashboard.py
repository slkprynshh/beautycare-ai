from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_salon
from app.models.salon import Salon
from app.services.dashboard_service import DashboardService
from app.schemas.common import ResponseEnvelope
from app.schemas.dashboard import DashboardSummaryResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=ResponseEnvelope[DashboardSummaryResponse])
async def get_dashboard_summary(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = DashboardService(db)
    summary = await service.get_dashboard_summary(current_salon.id)
    return ResponseEnvelope(success=True, data=summary)
