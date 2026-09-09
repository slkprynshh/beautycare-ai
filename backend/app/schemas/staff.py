from typing import Optional, List
from pydantic import Field, EmailStr
from app.schemas.common import BaseSchema
from app.core.constants import StaffRole


class StaffWorkingHoursSchema(BaseSchema):
    day_of_week: int = Field(..., ge=0, le=6)
    start_time: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    end_time: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    is_day_off: bool = False


class StaffCreate(BaseSchema):
    full_name: str = Field(..., min_length=2, max_length=150)
    display_title: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    staff_role: StaffRole = StaffRole.SENIOR_STYLIST
    bio: Optional[str] = None
    service_ids: Optional[List[str]] = None
    working_hours: Optional[List[StaffWorkingHoursSchema]] = None


class StaffUpdate(BaseSchema):
    full_name: Optional[str] = None
    display_title: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    staff_role: Optional[StaffRole] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None
    service_ids: Optional[List[str]] = None
    working_hours: Optional[List[StaffWorkingHoursSchema]] = None


class StaffSummaryResponse(BaseSchema):
    id: str
    full_name: str
    display_title: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    staff_role: StaffRole
    avatar_url: Optional[str] = None
    is_active: bool = True


class StaffResponse(BaseSchema):
    id: str
    full_name: str
    display_title: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    staff_role: StaffRole
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    working_hours: Optional[List[StaffWorkingHoursSchema]] = None
