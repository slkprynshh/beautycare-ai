from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import AutomationType, AutomationRunStatus
from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid


class AutomationRule(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "automation_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    automation_type: Mapped[AutomationType] = mapped_column(String(50), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Trigger configuration
    trigger_offset_minutes: Mapped[int] = mapped_column(Integer, default=0)  # e.g., -1440 for 24h before, +30 for 30m after no-show
    template_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("whatsapp_templates.id", ondelete="SET NULL"), nullable=True)
    target_service_category_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("service_categories.id", ondelete="SET NULL"), nullable=True)

    # Anti-spam & guardrails
    cooldown_days: Mapped[int] = mapped_column(Integer, default=7)
    max_attempts: Mapped[int] = mapped_column(Integer, default=1)  # Strict: 1 follow-up rule
    respect_quiet_hours: Mapped[bool] = mapped_column(Boolean, default=True)
    quiet_hours_start: Mapped[str] = mapped_column(String(10), default="21:30")
    quiet_hours_end: Mapped[str] = mapped_column(String(10), default="09:30")
    
    # Custom rule parameters
    config_overrides: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    salon: Mapped["Salon"] = relationship("Salon", back_populates="automation_rules")
    template: Mapped[Optional["WhatsAppTemplate"]] = relationship("WhatsAppTemplate")
    runs: Mapped[List["AutomationRun"]] = relationship("AutomationRun", back_populates="rule", cascade="all, delete-orphan")


class AutomationRun(Base, TimestampMixin, TenantMixin):
    __tablename__ = "automation_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    rule_id: Mapped[str] = mapped_column(String(36), ForeignKey("automation_rules.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    appointment_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True, index=True)
    message_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)

    status: Mapped[AutomationRunStatus] = mapped_column(String(30), default=AutomationRunStatus.SCHEDULED, index=True)
    scheduled_for: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    executed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    skip_reason: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)  # QUIET_HOURS, OPTED_OUT, ALREADY_BOOKED, RECENTLY_MESSAGED, CANCELLED
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    rule: Mapped["AutomationRule"] = relationship("AutomationRule", back_populates="runs")
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile")
    appointment: Mapped[Optional["Appointment"]] = relationship("Appointment")
    message: Mapped[Optional["Message"]] = relationship("Message")
