from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, BigInteger, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import AppointmentStatus, BookingSource
from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid


class Appointment(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    primary_staff_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=45)
    
    status: Mapped[AppointmentStatus] = mapped_column(String(50), default=AppointmentStatus.CONFIRMED, index=True)
    total_price_paise: Mapped[int] = mapped_column(BigInteger, default=0)
    source: Mapped[BookingSource] = mapped_column(String(50), default=BookingSource.DASHBOARD_WALKIN)
    
    is_recovered: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    recovery_event_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("recovery_events.id", ondelete="SET NULL", use_alter=True), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cancellation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile", back_populates="appointments")
    primary_staff: Mapped[Optional["StaffProfile"]] = relationship("StaffProfile", back_populates="appointments")
    appointment_services: Mapped[List["AppointmentService"]] = relationship("AppointmentService", back_populates="appointment", cascade="all, delete-orphan")
    status_events: Mapped[List["AppointmentStatusEvent"]] = relationship("AppointmentStatusEvent", back_populates="appointment", cascade="all, delete-orphan", order_by="AppointmentStatusEvent.created_at")


class AppointmentService(Base, TimestampMixin, TenantMixin):
    __tablename__ = "appointment_services"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id: Mapped[str] = mapped_column(String(36), ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    staff_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True)
    
    service_name: Mapped[str] = mapped_column(String(150), nullable=False)
    price_paise: Mapped[int] = mapped_column(BigInteger, default=0)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=45)

    # Relationships
    appointment: Mapped["Appointment"] = relationship("Appointment", back_populates="appointment_services")
    service: Mapped["Service"] = relationship("Service", back_populates="appointment_services")
    staff: Mapped[Optional["StaffProfile"]] = relationship("StaffProfile")


class AppointmentStatusEvent(Base, TimestampMixin):
    __tablename__ = "appointment_status_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    appointment_id: Mapped[str] = mapped_column(String(36), ForeignKey("appointments.id", ondelete="CASCADE"), nullable=False, index=True)
    from_status: Mapped[Optional[AppointmentStatus]] = mapped_column(String(50), nullable=True)
    to_status: Mapped[AppointmentStatus] = mapped_column(String(50), nullable=False)
    changed_by_user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    appointment: Mapped["Appointment"] = relationship("Appointment", back_populates="status_events")
    changed_by: Mapped[Optional["User"]] = relationship("User")
