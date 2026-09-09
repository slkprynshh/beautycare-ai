from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import Field, EmailStr
from app.schemas.common import BaseSchema
from app.core.constants import CustomerLifecycleStage


class CustomerPreferenceSchema(BaseSchema):
    allergies: Optional[str] = None
    preferred_stylist_id: Optional[str] = None
    preferred_beverage: Optional[str] = None
    hair_type: Optional[str] = None
    skin_tone: Optional[str] = None
    general_notes: Optional[str] = None
    whatsapp_opt_out: bool = False
    sms_opt_out: bool = False


class CustomerCreate(BaseSchema):
    full_name: str = Field(..., min_length=2, max_length=150)
    phone: str = Field(..., description="Indian phone number e.g. +919876543210")
    email: Optional[EmailStr] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    anniversary_date: Optional[date] = None
    notes: Optional[str] = None
    preferences: Optional[CustomerPreferenceSchema] = None


class CustomerUpdate(BaseSchema):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    anniversary_date: Optional[date] = None
    notes: Optional[str] = None
    whatsapp_opt_out: Optional[bool] = None
    preferences: Optional[CustomerPreferenceSchema] = None


class CustomerResponse(BaseSchema):
    id: str
    full_name: str
    phone: str
    email: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    anniversary_date: Optional[date] = None
    lifecycle_stage: CustomerLifecycleStage
    total_visits: int
    no_show_count: int
    cancelled_count: int
    total_spend_paise: int
    total_spend_inr: float = 0.0
    last_visit_at: Optional[datetime] = None
    next_due_date: Optional[date] = None
    is_due_for_service: bool = False
    whatsapp_opt_out: bool
    notes: Optional[str] = None
    created_at: datetime

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        res = super().model_validate(obj, *args, **kwargs)
        if hasattr(obj, "total_spend_paise") and obj.total_spend_paise is not None:
            res.total_spend_inr = round(obj.total_spend_paise / 100.0, 2)
        return res


class CustomerDetailResponse(CustomerResponse):
    preferences: Optional[CustomerPreferenceSchema] = None
    recent_appointments: List[Dict[str, Any]] = []


class CustomerImportItem(BaseSchema):
    full_name: str
    phone: str
    email: Optional[str] = None
    last_service_name: Optional[str] = None
    last_visit_date: Optional[str] = None
    preferred_stylist: Optional[str] = None
    notes: Optional[str] = None


class CustomerImportBatchRequest(BaseSchema):
    customers: List[CustomerImportItem]
    tag: Optional[str] = "CSV_IMPORT"


class CustomerImportResponse(BaseSchema):
    imported_count: int
    updated_count: int
    failed_count: int
    errors: List[Dict[str, Any]] = []
