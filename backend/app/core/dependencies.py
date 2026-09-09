from typing import Optional, List, Callable, Tuple
from fastapi import Depends, Header, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException, NotFoundException
from app.core.constants import SalonRole, Permission, ROLE_PERMISSIONS
from app.models.user import User
from app.models.salon import Salon, SalonMembership

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Dependency that extracts and validates current authenticated User from JWT token."""
    if not auth or not auth.credentials:
        raise UnauthorizedException("Authentication token is missing.")

    payload = decode_token(auth.credentials)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Invalid or expired access token.")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Malformed token payload.")

    stmt = (
        select(User)
        .where(User.id == user_id, User.is_active == True, User.is_deleted == False)
        .options(selectinload(User.salons).selectinload(SalonMembership.salon))
    )
    result = await db.execute(stmt)
    user = result.scalars().first()
    if not user:
        raise UnauthorizedException("User account not found or deactivated.")

    return user


async def get_current_salon_membership(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    user: User = Depends(get_current_user),
    x_salon_id: Optional[str] = Header(None, alias="X-Salon-ID"),
    salon_id_query: Optional[str] = Query(None, alias="salon_id"),
    db: AsyncSession = Depends(get_db),
) -> Tuple[SalonMembership, Salon]:
    """
    Dependency that resolves the active Salon and Membership for the authenticated User.
    Ensures strict tenant isolation by verifying the salon_memberships table.
    """
    token_salon_id = None
    if auth and auth.credentials:
        payload = decode_token(auth.credentials)
        if payload:
            token_salon_id = payload.get("salon_id")

    target_salon_id = x_salon_id or salon_id_query or token_salon_id

    if target_salon_id:
        stmt = (
            select(SalonMembership, Salon)
            .join(Salon, Salon.id == SalonMembership.salon_id)
            .where(
                SalonMembership.user_id == user.id,
                SalonMembership.salon_id == target_salon_id,
                Salon.is_deleted == False,
            )
        )
        result = await db.execute(stmt)
        row = result.first()
        if not row:
            raise ForbiddenException("You do not have active membership in this salon.")
        membership, salon = row
        return membership, salon

    # Otherwise default to user's primary or first active salon
    stmt = (
        select(SalonMembership, Salon)
        .join(Salon, Salon.id == SalonMembership.salon_id)
        .where(
            SalonMembership.user_id == user.id,
            Salon.is_deleted == False,
        )
        .order_by(SalonMembership.is_primary.desc(), SalonMembership.created_at.asc())
    )
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise ForbiddenException("User is not associated with any active salon.")
    membership, salon = row
    return membership, salon


async def get_current_salon(
    membership_and_salon: Tuple[SalonMembership, Salon] = Depends(get_current_salon_membership),
) -> Salon:
    """Returns the verified active Salon model."""
    _, salon = membership_and_salon
    return salon


async def get_current_membership(
    membership_and_salon: Tuple[SalonMembership, Salon] = Depends(get_current_salon_membership),
) -> SalonMembership:
    """Returns the verified active SalonMembership model."""
    membership, _ = membership_and_salon
    return membership


def require_role(allowed_roles: List[SalonRole]) -> Callable:
    """Dependency factory checking that user holds at least one of the allowed roles in current salon."""
    allowed_values = {r.value if hasattr(r, "value") else str(r) for r in allowed_roles}
    async def role_checker(membership: SalonMembership = Depends(get_current_membership)):
        role_val = membership.role.value if hasattr(membership.role, "value") else str(membership.role)
        if role_val not in allowed_values:
            raise ForbiddenException(
                f"Action requires one of the following roles: {', '.join([r.value if hasattr(r, 'value') else str(r) for r in allowed_roles])}"
            )
        return membership
    return role_checker


def require_permission(permission: Permission) -> Callable:
    """Dependency factory verifying fine-grained permission based on role."""
    async def permission_checker(membership: SalonMembership = Depends(get_current_membership)):
        role = membership.role
        allowed_permissions = ROLE_PERMISSIONS.get(role, set())
        if permission not in allowed_permissions:
            raise ForbiddenException(f"Action requires permission: {permission.value}")
        return membership
    return permission_checker
