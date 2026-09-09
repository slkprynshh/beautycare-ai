from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from app.schemas.common import BaseSchema
from app.schemas.appointment import AppointmentResponse


class TimeSlot(BaseSchema):
    start_time: str
    end_time: str
    is_available: bool = True
    reason_unavailable: Optional[str] = None


class StaffCalendarDay(BaseSchema):
    staff_id: str
    staff_name: str
    is_working_today: bool
    working_hours: Optional[Dict[str, str]] = None
    appointments: List[AppointmentResponse] = []
    available_slots: List[TimeSlot] = []


class CalendarQuery(BaseSchema):
    view_date: date = Field(default_factory=date.today)
    staff_id: Optional[str] = None
    view_mode: str = "day"  # day, week, month


class CalendarViewResponse(BaseSchema):
    date: date
    is_salon_open: bool
    salon_business_hours: Optional[Dict[str, str]] = None
    staff_schedules: List[StaffCalendarDay] = []
    total_appointments: int = 0
    total_revenue_paise: int = 0
    total_revenue_inr: float = 0.0
