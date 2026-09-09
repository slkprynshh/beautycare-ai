from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from app.schemas.common import BaseSchema
from app.core.constants import RecoveryStatus, RecoveryTriggerReason


class RecoveryEventResponse(BaseSchema):
    id: str
    customer_id: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    original_appointment_id: Optional[str] = None
    recovered_appointment_id: Optional[str] = None
    trigger_reason: RecoveryTriggerReason
    status: RecoveryStatus
    
    initiated_at: datetime
    nudge_sent_at: Optional[datetime] = None
    customer_replied_at: Optional[datetime] = None
    rebooked_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    estimated_revenue_paise: int
    estimated_revenue_inr: float = 0.0
    booked_revenue_paise: int
    booked_revenue_inr: float = 0.0
    confirmed_revenue_paise: int
    confirmed_revenue_inr: float = 0.0
    
    attribution_window_days: int
    attribution_notes: Optional[str] = None

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        res = super().model_validate(obj, *args, **kwargs)
        if hasattr(obj, "estimated_revenue_paise") and obj.estimated_revenue_paise is not None:
            res.estimated_revenue_inr = round(obj.estimated_revenue_paise / 100.0, 2)
        if hasattr(obj, "booked_revenue_paise") and obj.booked_revenue_paise is not None:
            res.booked_revenue_inr = round(obj.booked_revenue_paise / 100.0, 2)
        if hasattr(obj, "confirmed_revenue_paise") and obj.confirmed_revenue_paise is not None:
            res.confirmed_revenue_inr = round(obj.confirmed_revenue_paise / 100.0, 2)
        if hasattr(obj, "customer") and obj.customer is not None:
            res.customer_name = obj.customer.full_name
            res.customer_phone = obj.customer.phone
        return res


class RecoveryMetricsResponse(BaseSchema):
    # Distinct revenue tiers
    estimated_revenue_paise: int = 0
    estimated_revenue_inr: float = 0.0
    booked_revenue_paise: int = 0
    booked_revenue_inr: float = 0.0
    confirmed_revenue_paise: int = 0
    confirmed_revenue_inr: float = 0.0

    total_triggered: int = 0
    total_nudged: int = 0
    total_replied: int = 0
    total_rebooked: int = 0
    total_completed: int = 0
    
    recovery_rate_percent: float = 0.0
    avg_hours_to_rebook: float = 0.0


class ManualRecoveryTriggerRequest(BaseSchema):
    customer_id: str
    reason: RecoveryTriggerReason = RecoveryTriggerReason.MANUAL_FOLLOWUP
    custom_message: Optional[str] = None
    service_id: Optional[str] = None
