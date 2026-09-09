from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from app.core.constants import AIIntentType


class AIParseOutput(BaseModel):
    intent: AIIntentType
    confidence: float
    entities: Dict[str, Any]  # requested_date, requested_time, service_names, staff_name, etc.
    suggested_reply: str
    requires_human_review: bool
    model_name: str = "mock"
    latency_ms: int = 0


class BaseAIAdapter(ABC):
    @abstractmethod
    async def parse_and_draft(
        self,
        customer_message: str,
        customer_name: Optional[str] = None,
        salon_name: Optional[str] = None,
        available_services: Optional[List[str]] = None,
        available_staff: Optional[List[str]] = None,
    ) -> AIParseOutput:
        pass
