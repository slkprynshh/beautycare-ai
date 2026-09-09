from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid
from app.core.constants import SalonRole, DEFAULT_TIMEZONE, DEFAULT_CURRENCY


class Salon(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "salons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    tagline: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    address_line: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    locality: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Mumbai", nullable=False)
    state: Mapped[str] = mapped_column(String(100), default="Maharashtra", nullable=False)
    postal_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    timezone: Mapped[str] = mapped_column(String(50), default=DEFAULT_TIMEZONE)
    currency: Mapped[str] = mapped_column(String(10), default=DEFAULT_CURRENCY)
    
    quiet_hours_start: Mapped[str] = mapped_column(String(10), default="21:30")
    quiet_hours_end: Mapped[str] = mapped_column(String(10), default="09:30")
    auto_reminders_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    auto_reschedule_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    auto_due_nudges_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    service_charge_percent: Mapped[float] = mapped_column(Float, default=0.0)
    gst_percent: Mapped[float] = mapped_column(Float, default=18.0)

    # Relationships
    memberships: Mapped[List["SalonMembership"]] = relationship("SalonMembership", back_populates="salon", cascade="all, delete-orphan")
    business_hours: Mapped[List["SalonBusinessHours"]] = relationship("SalonBusinessHours", back_populates="salon", cascade="all, delete-orphan")
    whatsapp_account: Mapped[Optional["WhatsAppAccount"]] = relationship("WhatsAppAccount", back_populates="salon", uselist=False)
    whatsapp_templates: Mapped[List["WhatsAppTemplate"]] = relationship("WhatsAppTemplate", back_populates="salon")
    automation_rules: Mapped[List["AutomationRule"]] = relationship("AutomationRule", back_populates="salon")
    recovery_events: Mapped[List["RecoveryEvent"]] = relationship("RecoveryEvent", back_populates="salon")


class SalonMembership(Base, TimestampMixin):
    __tablename__ = "salon_memberships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    salon_id: Mapped[str] = mapped_column(String(36), ForeignKey("salons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[SalonRole] = mapped_column(String(50), default=SalonRole.OWNER, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    salon: Mapped["Salon"] = relationship("Salon", back_populates="memberships")
    user: Mapped["User"] = relationship("User", back_populates="salons")


class SalonBusinessHours(Base, TimestampMixin, TenantMixin):
    __tablename__ = "salon_business_hours"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    open_time: Mapped[str] = mapped_column(String(10), default="10:00")
    close_time: Mapped[str] = mapped_column(String(10), default="20:00")
    is_closed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    salon: Mapped["Salon"] = relationship("Salon", back_populates="business_hours")
