from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from app.schemas.common import BaseSchema
from app.schemas.customer import CustomerResponse
from app.schemas.staff import StaffSummaryResponse, StaffResponse
from app.core.constants import AppointmentStatus, BookingSource


class AppointmentItemInput(BaseSchema):
    service_id: str
    staff_id: Optional[str] = None
    price_paise: Optional[int] = None
    duration_minutes: Optional[int] = None


class AppointmentCreate(BaseSchema):
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    
    primary_staff_id: Optional[str] = None
    starts_at: datetime
    services: List[AppointmentItemInput] = Field(..., min_length=1)
    notes: Optional[str] = None
    source: BookingSource = BookingSource.DASHBOARD_WALKIN
    is_recovered: bool = False
    recovery_event_id: Optional[str] = None


class AppointmentUpdate(BaseSchema):
    primary_staff_id: Optional[str] = None
    starts_at: Optional[datetime] = None
    notes: Optional[str] = None
    services: Optional[List[AppointmentItemInput]] = None


class AppointmentStatusChange(BaseSchema):
    status: AppointmentStatus
    cancellation_reason: Optional[str] = None
    send_whatsapp_update: bool = True


class AppointmentServiceResponse(BaseSchema):
    id: str
    service_id: str
    staff_id: Optional[str] = None
    service_name: str
    price_paise: int
    price_inr: float = 0.0
    duration_minutes: int
    staff_name: Optional[str] = None

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        res = super().model_validate(obj, *args, **kwargs)
        if hasattr(obj, "price_paise") and obj.price_paise is not None:
            res.price_inr = round(obj.price_paise / 100.0, 2)
        return res


class AppointmentResponse(BaseSchema):
    id: str
    customer_id: str
    primary_staff_id: Optional[str] = None
    starts_at: datetime
    ends_at: datetime
    duration_minutes: int
    status: AppointmentStatus
    total_price_paise: int
    total_price_inr: float = 0.0
    source: BookingSource
    is_recovered: bool
    recovery_event_id: Optional[str] = None
    notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    
    customer: Optional[CustomerResponse] = None
    primary_staff: Optional[StaffSummaryResponse] = None
    services: List[AppointmentServiceResponse] = []
    created_at: datetime

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        res = super().model_validate(obj, *args, **kwargs)
        if hasattr(obj, "total_price_paise") and obj.total_price_paise is not None:
            res.total_price_inr = round(obj.total_price_paise / 100.0, 2)
        if hasattr(obj, "appointment_services") and obj.appointment_services:
            res.services = [AppointmentServiceResponse.model_validate(s) for s in obj.appointment_services]
        return res


class AppointmentDetailResponse(AppointmentResponse):
    status_history: List[Dict[str, Any]] = []
