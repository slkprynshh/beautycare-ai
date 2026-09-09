from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.auth_service import AuthService
from app.schemas.common import ResponseEnvelope
from app.schemas.auth import (
    OTPRequest,
    OTPVerifyRequest,
    PasswordLoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
    SalonMembershipInfo,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/request-otp", response_model=ResponseEnvelope[dict])
async def request_otp(
    payload: OTPRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    otp = await service.generate_otp(payload.phone)
    return ResponseEnvelope(
        success=True,
        message=f"OTP sent successfully to {payload.phone}",
        data={"phone": payload.phone, "mock_otp_dev_hint": otp},
    )


@router.post("/verify-otp", response_model=ResponseEnvelope[TokenResponse])
async def verify_otp(
    payload: OTPVerifyRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    user, access_token, refresh_token = await service.verify_otp(payload.phone, payload.otp)
    
    salons_info = [
        SalonMembershipInfo(
            salon_id=m.salon_id,
            salon_name=m.salon.name if m.salon else "My Salon",
            role=m.role,
            is_primary=m.is_primary,
        )
        for m in user.salons
    ]

    user_resp = UserResponse(
        id=user.id,
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        is_active=user.is_active,
        is_superadmin=user.is_superadmin,
        salons=salons_info,
    )

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=86400,
        user=user_resp,
    )
    return ResponseEnvelope(success=True, data=token_data)


@router.post("/login", response_model=ResponseEnvelope[TokenResponse])
async def login(
    payload: PasswordLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    user, access_token, refresh_token = await service.login_password(payload.phone_or_email, payload.password)

    salons_info = [
        SalonMembershipInfo(
            salon_id=m.salon_id,
            salon_name=m.salon.name if m.salon else "My Salon",
            role=m.role,
            is_primary=m.is_primary,
        )
        for m in user.salons
    ]

    user_resp = UserResponse(
        id=user.id,
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        is_active=user.is_active,
        is_superadmin=user.is_superadmin,
        salons=salons_info,
    )

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=86400,
        user=user_resp,
    )
    return ResponseEnvelope(success=True, data=token_data)


@router.post("/register", response_model=ResponseEnvelope[TokenResponse])
async def register(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    user, access_token, refresh_token = await service.register(payload)

    salons_info = [
        SalonMembershipInfo(
            salon_id=m.salon_id,
            salon_name=m.salon.name if m.salon else payload.salon_name,
            role=m.role,
            is_primary=m.is_primary,
        )
        for m in user.salons
    ]

    user_resp = UserResponse(
        id=user.id,
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        is_active=user.is_active,
        is_superadmin=user.is_superadmin,
        salons=salons_info,
    )

    token_data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=86400,
        user=user_resp,
    )
    return ResponseEnvelope(success=True, message="Salon registered successfully", data=token_data)


@router.get("/me", response_model=ResponseEnvelope[UserResponse])
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    salons_info = [
        SalonMembershipInfo(
            salon_id=m.salon_id,
            salon_name=m.salon.name if m.salon else "My Salon",
            role=m.role,
            is_primary=m.is_primary,
        )
        for m in current_user.salons
    ]

    user_resp = UserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        phone=current_user.phone,
        email=current_user.email,
        is_active=current_user.is_active,
        is_superadmin=current_user.is_superadmin,
        salons=salons_info,
    )
    return ResponseEnvelope(success=True, data=user_resp)
