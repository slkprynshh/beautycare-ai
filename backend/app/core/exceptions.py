from typing import Optional, List, Dict, Any
from fastapi import status


class AppException(Exception):
    """Base application exception supporting standard error response formatting."""
    def __init__(
        self,
        message: str = "An error occurred",
        code: str = "BAD_REQUEST",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[List[Dict[str, Any]]] = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or []
        super().__init__(message)


class BadRequestException(AppException):
    def __init__(self, message: str = "Invalid request payload", details: Optional[List[Dict[str, Any]]] = None):
        super().__init__(
            code="BAD_REQUEST",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details,
        )


class NotFoundException(AppException):
    def __init__(self, resource: str = "Resource", identifier: Optional[Any] = None):
        msg = f"{resource} not found." if not identifier else f"{resource} with ID '{identifier}' not found."
        super().__init__(
            code="RESOURCE_NOT_FOUND",
            message=msg,
            status_code=status.HTTP_404_NOT_FOUND,
        )


class ConflictException(AppException):
    def __init__(self, message: str, code: str = "RESOURCE_CONFLICT", details: Optional[List[Dict[str, Any]]] = None):
        super().__init__(
            code=code,
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


class AppointmentConflictException(ConflictException):
    def __init__(self, message: str = "The selected staff member is unavailable at this time.", details: Optional[List[Dict[str, Any]]] = None):
        super().__init__(
            code="APPOINTMENT_CONFLICT",
            message=message,
            details=details,
        )


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication credentials were not provided or are invalid."):
        super().__init__(
            code="UNAUTHORIZED",
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


AuthenticationException = UnauthorizedException


class ForbiddenException(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(
            code="FORBIDDEN",
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
        )


class RateLimitException(AppException):
    def __init__(self, message: str = "Rate limit exceeded. Please try again later."):
        super().__init__(
            code="RATE_LIMIT_EXCEEDED",
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        )


class QuietHoursException(AppException):
    def __init__(self, message: str = "Cannot dispatch messages during configured salon quiet hours."):
        super().__init__(
            code="QUIET_HOURS_RESTRICTION",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class OptOutException(AppException):
    def __init__(self, message: str = "Customer has opted out of automated WhatsApp communications."):
        super().__init__(
            code="CUSTOMER_OPTED_OUT",
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
        )
