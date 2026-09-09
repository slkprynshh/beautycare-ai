import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.core.exceptions import AppException
from app.core.logging import logger


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Injects unique request-id, logs execution duration, and attaches correlation headers."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start_time = time.time()

        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time-Ms"] = str(duration_ms)
            return response
        except AppException as exc:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.warning(
                f"Application exception [{exc.code}]: {exc.message}",
                extra={"request_id": request_id, "duration_ms": duration_ms},
            )
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "success": False,
                    "error": {
                        "code": exc.code,
                        "message": exc.message,
                        "details": exc.details,
                        "request_id": request_id,
                    }
                },
                headers={"X-Request-ID": request_id, "X-Response-Time-Ms": str(duration_ms)},
            )
        except Exception as exc:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.exception(
                f"Unhandled server error: {str(exc)}",
                extra={"request_id": request_id, "duration_ms": duration_ms},
            )
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": {
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "An unexpected error occurred. Please contact support.",
                        "details": str(exc),
                        "request_id": request_id,
                    }
                },
                headers={"X-Request-ID": request_id, "X-Response-Time-Ms": str(duration_ms)},
            )


RequestIDMiddleware = RequestContextMiddleware
TimingAndLoggingMiddleware = RequestContextMiddleware
ErrorHandlingMiddleware = RequestContextMiddleware
