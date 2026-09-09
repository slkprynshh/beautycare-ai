from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.dependencies import get_current_salon, require_role
from app.models.salon import Salon
from app.models.whatsapp import WhatsAppAccount
from app.services.salon_service import SalonService
from app.schemas.common import ResponseEnvelope
from app.schemas.settings import WhatsAppAccountResponse, WhatsAppSettingsUpdate
from app.core.constants import UserRole
from app.core.security import encrypt_field

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/whatsapp", response_model=ResponseEnvelope[WhatsAppAccountResponse])
async def get_whatsapp_settings(
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
):
    service = SalonService(db)
    wa = await service.get_whatsapp_settings(current_salon.id)
    return ResponseEnvelope(
        success=True,
        data=WhatsAppAccountResponse(
            id=wa.id,
            phone_number_id=wa.phone_number_id,
            waba_id=wa.waba_id,
            display_phone_number=wa.display_phone_number,
            quality_rating=wa.quality_rating,
            verified_name=wa.verified_name,
            is_active=wa.is_active,
            is_mock=wa.is_mock,
            webhook_url="/api/v1/webhooks/whatsapp",
        ),
    )


@router.patch("/whatsapp", response_model=ResponseEnvelope[WhatsAppAccountResponse])
async def update_whatsapp_settings(
    payload: WhatsAppSettingsUpdate,
    current_salon: Salon = Depends(get_current_salon),
    db: AsyncSession = Depends(get_db),
    _role: None = Depends(require_role([UserRole.OWNER])),
):
    service = SalonService(db)
    wa = await service.get_whatsapp_settings(current_salon.id)

    if payload.phone_number_id is not None:
        wa.phone_number_id = payload.phone_number_id
    if payload.waba_id is not None:
        wa.waba_id = payload.waba_id
    if payload.access_token is not None:
        wa.encrypted_access_token = encrypt_field(payload.access_token)
    if payload.webhook_secret is not None:
        wa.webhook_secret = payload.webhook_secret
    if payload.is_mock is not None:
        wa.is_mock = payload.is_mock

    await db.commit()
    await db.refresh(wa)

    return ResponseEnvelope(
        success=True,
        message="WhatsApp account settings updated",
        data=WhatsAppAccountResponse(
            id=wa.id,
            phone_number_id=wa.phone_number_id,
            waba_id=wa.waba_id,
            display_phone_number=wa.display_phone_number,
            quality_rating=wa.quality_rating,
            verified_name=wa.verified_name,
            is_active=wa.is_active,
            is_mock=wa.is_mock,
            webhook_url="/api/v1/webhooks/whatsapp",
        ),
    )
