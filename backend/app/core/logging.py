import json
import logging
import sys
import re
from datetime import datetime, timezone
from typing import Any, Dict
from app.core.config import settings


class JSONFormatter(logging.Formatter):
    """Structured JSON formatter with PII redaction and contextual metadata."""
    
    PHONE_RE = re.compile(r"(\+91|0)?([6-9]\d{9})")
    TOKEN_RE = re.compile(r"(access_token|authorization|secret|password|bearer\s+[A-Za-z0-9_\-\.]+)", re.IGNORECASE)

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "environment": settings.APP_ENV,
        }

        # Contextual request metadata
        for attr in ["request_id", "salon_id", "user_id", "job_id", "automation_run_id"]:
            if hasattr(record, attr):
                log_obj[attr] = getattr(record, attr)

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        # Redact raw phone numbers and secrets in serialized string
        serialized = json.dumps(log_obj)
        # Mask middle 4 digits of 10-digit Indian phone numbers
        serialized = self.PHONE_RE.sub(r"\1\g<2>[0:2]****\g<2>[6:10]", serialized)
        return serialized


def setup_logging() -> None:
    """Configure root logger with structured JSON handler."""
    root_logger = logging.getLogger()
    root_logger.setLevel(settings.LOG_LEVEL.upper())

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    root_logger.addHandler(handler)

    # Quieten noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING if not settings.DEBUG else logging.INFO)


logger = logging.getLogger("vertops")
