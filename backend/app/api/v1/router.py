from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.salons import router as salons_router
from app.api.v1.staff import router as staff_router
from app.api.v1.services import router as services_router
from app.api.v1.customers import router as customers_router
from app.api.v1.appointments import router as appointments_router
from app.api.v1.calendar import router as calendar_router
from app.api.v1.recovery import router as recovery_router
from app.api.v1.messages import router as messages_router
from app.api.v1.webhooks import router as webhooks_router
from app.api.v1.automations import router as automations_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.ai_assistant import router as ai_router
from app.api.v1.settings import router as settings_router
from app.api.v1.health import router as health_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(salons_router)
api_v1_router.include_router(staff_router)
api_v1_router.include_router(services_router)
api_v1_router.include_router(customers_router)
api_v1_router.include_router(appointments_router)
api_v1_router.include_router(calendar_router)
api_v1_router.include_router(recovery_router)
api_v1_router.include_router(messages_router)
api_v1_router.include_router(webhooks_router)
api_v1_router.include_router(automations_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(settings_router)

__all__ = ["api_v1_router"]
