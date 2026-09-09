from datetime import date, datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, BigInteger, DateTime, Date, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import CustomerLifecycleStage
from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid


class CustomerProfile(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "customer_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    anniversary_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    lifecycle_stage: Mapped[CustomerLifecycleStage] = mapped_column(String(50), default=CustomerLifecycleStage.NEW, index=True)
    total_visits: Mapped[int] = mapped_column(Integer, default=0)
    no_show_count: Mapped[int] = mapped_column(Integer, default=0)
    cancelled_count: Mapped[int] = mapped_column(Integer, default=0)
    total_spend_paise: Mapped[int] = mapped_column(BigInteger, default=0)
    
    last_visit_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    
    whatsapp_opt_out: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    preferences: Mapped[Optional["CustomerPreference"]] = relationship("CustomerPreference", back_populates="customer", uselist=False, cascade="all, delete-orphan")
    service_cycles: Mapped[List["CustomerServiceCycle"]] = relationship("CustomerServiceCycle", back_populates="customer", cascade="all, delete-orphan")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="customer")
    recovery_events: Mapped[List["RecoveryEvent"]] = relationship("RecoveryEvent", back_populates="customer")
    message_threads: Mapped[List["MessageThread"]] = relationship("MessageThread", back_populates="customer")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="customer")


class CustomerPreference(Base, TimestampMixin):
    __tablename__ = "customer_preferences"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    allergies: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    preferred_stylist_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    preferred_beverage: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    hair_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    skin_tone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    general_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    whatsapp_opt_out: Mapped[bool] = mapped_column(Boolean, default=False)
    sms_opt_out: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile", back_populates="preferences")


class CustomerServiceCycle(Base, TimestampMixin, TenantMixin):
    __tablename__ = "customer_service_cycles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id: Mapped[str] = mapped_column(String(36), ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    interval_days: Mapped[int] = mapped_column(Integer, default=30)
    last_service_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Relationships
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile", back_populates="service_cycles")
    service: Mapped["Service"] = relationship("Service")
