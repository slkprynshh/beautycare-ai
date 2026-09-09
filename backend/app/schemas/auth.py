from typing import Optional, List
from pydantic import Field, EmailStr
from app.schemas.common import BaseSchema
from app.core.constants import UserRole


class OTPRequest(BaseSchema):
    phone: str = Field(..., description="Indian 10-digit or E.164 phone number, e.g. +919876543210")


class OTPVerifyRequest(BaseSchema):
    phone: str = Field(..., description="Phone number")
    otp: str = Field(..., min_length=4, max_length=6, description="4 or 6 digit verification OTP")


class PasswordLoginRequest(BaseSchema):
    phone_or_email: str = Field(..., description="Phone number or email address")
    password: str = Field(..., min_length=6)


class RegisterRequest(BaseSchema):
    full_name: str = Field(..., min_length=2, max_length=150)
    phone: str = Field(..., description="Phone number")
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
    salon_name: str = Field(..., min_length=2, max_length=150)
    city: Optional[str] = Field("Mumbai", max_length=100)


class RefreshTokenRequest(BaseSchema):
    refresh_token: str = Field(...)


class SalonMembershipInfo(BaseSchema):
    salon_id: str
    salon_name: str
    role: UserRole
    is_primary: bool


class UserResponse(BaseSchema):
    id: str
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    is_superadmin: bool
    salons: List[SalonMembershipInfo] = []


class TokenResponse(BaseSchema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse
