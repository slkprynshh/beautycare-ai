from typing import Optional, List, Dict, Any
from pydantic import Field, EmailStr
from app.schemas.common import BaseSchema


class BusinessHoursCreate(BaseSchema):
    day_of_week: int = Field(..., ge=0, le=6, description="0=Monday, 6=Sunday")
    open_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="HH:MM format, e.g. 10:00")
    close_time: str = Field(..., pattern=r"^\d{2}:\d{2}$", description="HH:MM format, e.g. 20:00")
    is_closed: bool = False


class BusinessHoursResponse(BaseSchema):
    id: str
    day_of_week: int
    open_time: str
    close_time: str
    is_closed: bool


class SalonCreate(BaseSchema):
    name: str = Field(..., min_length=2, max_length=150)
    slug: Optional[str] = Field(None, max_length=150)
    tagline: Optional[str] = None
    phone: str = Field(...)
    email: Optional[EmailStr] = None
    address_line: Optional[str] = None
    locality: Optional[str] = None
    city: str = Field(..., max_length=100)
    state: Optional[str] = Field("Maharashtra", max_length=100)
    postal_code: Optional[str] = None
    timezone: str = Field("Asia/Kolkata")
    currency: str = Field("INR")
    business_hours: Optional[List[BusinessHoursCreate]] = None


class SalonUpdate(BaseSchema):
    name: Optional[str] = None
    tagline: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address_line: Optional[str] = None
    locality: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    auto_reminders_enabled: Optional[bool] = None
    auto_reschedule_enabled: Optional[bool] = None
    auto_due_nudges_enabled: Optional[bool] = None
    service_charge_percent: Optional[float] = None
    gst_percent: Optional[float] = None


class SalonResponse(BaseSchema):
    id: str
    name: str
    slug: str
    tagline: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address_line: Optional[str] = None
    locality: Optional[str] = None
    city: str
    state: str
    postal_code: Optional[str] = None
    timezone: str
    currency: str
    quiet_hours_start: str
    quiet_hours_end: str
    auto_reminders_enabled: bool
    auto_reschedule_enabled: bool
    auto_due_nudges_enabled: bool
    service_charge_percent: float
    gst_percent: float
    business_hours: List[BusinessHoursResponse] = []
