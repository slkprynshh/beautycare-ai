from typing import Optional, List, Dict, Any
from pydantic import Field
from app.schemas.common import BaseSchema


class WhatsAppSettingsUpdate(BaseSchema):
    phone_number_id: Optional[str] = None
    waba_id: Optional[str] = None
    access_token: Optional[str] = None
    webhook_secret: Optional[str] = None
    is_mock: Optional[bool] = None


class WhatsAppAccountResponse(BaseSchema):
    id: str
    phone_number_id: Optional[str] = None
    waba_id: Optional[str] = None
    display_phone_number: Optional[str] = None
    quality_rating: str
    verified_name: Optional[str] = None
    is_active: bool
    is_mock: bool
    webhook_url: Optional[str] = None


class SalonSettingsUpdate(BaseSchema):
    name: Optional[str] = None
    tagline: Optional[str] = None
    phone: Optional[str] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    auto_reminders_enabled: Optional[bool] = None
    auto_reschedule_enabled: Optional[bool] = None
    auto_due_nudges_enabled: Optional[bool] = None
    service_charge_percent: Optional[float] = None
    gst_percent: Optional[float] = None
