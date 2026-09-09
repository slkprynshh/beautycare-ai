from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, BigInteger, DateTime, Boolean, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import RecoveryStatus, RecoveryTriggerReason
from app.models.base import Base, TimestampMixin, TenantMixin, generate_uuid


class RecoveryEvent(Base, TimestampMixin, TenantMixin):
    __tablename__ = "recovery_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    original_appointment_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True, index=True)
    automation_run_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("automation_runs.id", ondelete="SET NULL"), nullable=True)
    recovered_appointment_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True, index=True)

    trigger_reason: Mapped[RecoveryTriggerReason] = mapped_column(String(50), nullable=False, index=True)
    status: Mapped[RecoveryStatus] = mapped_column(String(30), default=RecoveryStatus.TRIGGERED, index=True)

    initiated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    nudge_sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    customer_replied_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    rebooked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)  # Default: initiated_at + 7 days

    # Transparent revenue tracking in paise
    estimated_revenue_paise: Mapped[int] = mapped_column(BigInteger, default=0)   # Service list price at time of nudge
    booked_revenue_paise: Mapped[int] = mapped_column(BigInteger, default=0)      # When rebooked appointment created
    confirmed_revenue_paise: Mapped[int] = mapped_column(BigInteger, default=0)   # When rebooked appointment marked COMPLETED

    attribution_window_days: Mapped[int] = mapped_column(Integer, default=7)
    attribution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    salon: Mapped["Salon"] = relationship("Salon", back_populates="recovery_events")
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile", back_populates="recovery_events")
    original_appointment: Mapped[Optional["Appointment"]] = relationship("Appointment", foreign_keys=[original_appointment_id])
    recovered_appointment: Mapped[Optional["Appointment"]] = relationship("Appointment", foreign_keys=[recovered_appointment_id])
    automation_run: Mapped[Optional["AutomationRun"]] = relationship("AutomationRun")
    attributions: Mapped[List["RecoveryAttribution"]] = relationship("RecoveryAttribution", back_populates="recovery_event", cascade="all, delete-orphan")


class RecoveryAttribution(Base, TimestampMixin, TenantMixin):
    __tablename__ = "recovery_attributions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    recovery_event_id: Mapped[str] = mapped_column(String(36), ForeignKey("recovery_events.id", ondelete="CASCADE"), nullable=False, index=True)
    appointment_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, index=True)
    
    confidence_score: Mapped[float] = mapped_column(Float, default=1.0)  # 1.0 direct button click/flow, 0.8 same customer within 7d
    rule_applied: Mapped[str] = mapped_column(String(100), default="DIRECT_AUTOMATION_MATCH")
    revenue_paise: Mapped[int] = mapped_column(BigInteger, default=0)
    is_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    attribution_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    recovery_event: Mapped["RecoveryEvent"] = relationship("RecoveryEvent", back_populates="attributions")
    appointment: Mapped["Appointment"] = relationship("Appointment")
