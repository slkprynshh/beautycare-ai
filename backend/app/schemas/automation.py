from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import Field
from app.schemas.common import BaseSchema
from app.core.constants import AutomationType, AutomationRunStatus


class AutomationRuleCreate(BaseSchema):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    automation_type: AutomationType
    is_active: bool = True
    trigger_offset_minutes: int = 0
    template_id: Optional[str] = None
    target_service_category_id: Optional[str] = None
    cooldown_days: int = 7
    max_attempts: int = 1
    respect_quiet_hours: bool = True
    quiet_hours_start: str = "21:30"
    quiet_hours_end: str = "09:30"
    config_overrides: Optional[Dict[str, Any]] = None


class AutomationRuleUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    trigger_offset_minutes: Optional[int] = None
    template_id: Optional[str] = None
    target_service_category_id: Optional[str] = None
    cooldown_days: Optional[int] = None
    max_attempts: Optional[int] = None
    respect_quiet_hours: Optional[bool] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None
    config_overrides: Optional[Dict[str, Any]] = None


class AutomationRuleResponse(BaseSchema):
    id: str
    name: str
    description: Optional[str] = None
    automation_type: AutomationType
    is_active: bool
    trigger_offset_minutes: int
    template_id: Optional[str] = None
    target_service_category_id: Optional[str] = None
    cooldown_days: int
    max_attempts: int
    respect_quiet_hours: bool
    quiet_hours_start: str
    quiet_hours_end: str
    config_overrides: Optional[Dict[str, Any]] = None
    created_at: datetime


class AutomationRunResponse(BaseSchema):
    id: str
    rule_id: str
    customer_id: str
    appointment_id: Optional[str] = None
    message_id: Optional[str] = None
    status: AutomationRunStatus
    scheduled_for: datetime
    executed_at: Optional[datetime] = None
    skip_reason: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime


class TriggerAutomationRunRequest(BaseSchema):
    rule_id: str
    customer_id: str
    appointment_id: Optional[str] = None
    force_ignore_quiet_hours: bool = False
