import time
from typing import Optional, Dict
from app.core.exceptions import RateLimitException
from app.core.config import settings
from app.core.logging import logger

# In-memory storage for test/local fallback if Redis is unreachable
_in_memory_rate_limits: Dict[str, list] = {}


class RateLimiter:
    """Sliding-window rate limiter with graceful in-memory fallback."""
    
    def __init__(self, key_prefix: str, max_requests: int, window_seconds: int):
        self.key_prefix = key_prefix
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def check(self, identifier: str) -> None:
        key = f"rl:{self.key_prefix}:{identifier}"
        now = time.time()
        window_start = now - self.window_seconds

        # In-memory fallback
        if key not in _in_memory_rate_limits:
            _in_memory_rate_limits[key] = []
        
        # Clean older requests
        _in_memory_rate_limits[key] = [
            ts for ts in _in_memory_rate_limits[key] if ts > window_start
        ]

        if len(_in_memory_rate_limits[key]) >= self.max_requests:
            logger.warning("Rate limit reached", extra={"rate_limit_key": key})
            raise RateLimitException(
                f"Too many requests for {self.key_prefix}. Please wait {self.window_seconds // 60} minutes."
            )

        _in_memory_rate_limits[key].append(now)


# Predefined rate limiters
otp_request_limiter = RateLimiter(key_prefix="otp_req", max_requests=3, window_seconds=900)  # 3 per 15 min
otp_verify_limiter = RateLimiter(key_prefix="otp_ver", max_requests=5, window_seconds=900)   # 5 per 15 min
login_limiter = RateLimiter(key_prefix="login", max_requests=10, window_seconds=900)          # 10 per 15 min
search_limiter = RateLimiter(key_prefix="search", max_requests=60, window_seconds=60)        # 60 per min
import_limiter = RateLimiter(key_prefix="import", max_requests=5, window_seconds=3600)        # 5 per hour
