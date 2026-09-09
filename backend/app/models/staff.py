from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import StaffRole
from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid


class StaffProfile(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "staff_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    display_title: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    staff_role: Mapped[StaffRole] = mapped_column(String(50), default=StaffRole.SENIOR_STYLIST)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    staff_services: Mapped[List["StaffService"]] = relationship("StaffService", back_populates="staff", cascade="all, delete-orphan")
    working_hours: Mapped[List["StaffWorkingHours"]] = relationship("StaffWorkingHours", back_populates="staff", cascade="all, delete-orphan")
    time_off: Mapped[List["StaffTimeOff"]] = relationship("StaffTimeOff", back_populates="staff", cascade="all, delete-orphan")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="primary_staff")


class StaffService(Base, TimestampMixin):
    __tablename__ = "staff_services"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    staff_id: Mapped[str] = mapped_column(String(36), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id: Mapped[str] = mapped_column(String(36), ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)

    # Relationships
    staff: Mapped["StaffProfile"] = relationship("StaffProfile", back_populates="staff_services")
    service: Mapped["Service"] = relationship("Service", back_populates="staff_services")


class StaffWorkingHours(Base, TimestampMixin):
    __tablename__ = "staff_working_hours"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    staff_id: Mapped[str] = mapped_column(String(36), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time: Mapped[str] = mapped_column(String(10), default="10:00")
    end_time: Mapped[str] = mapped_column(String(10), default="19:00")
    is_day_off: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    staff: Mapped["StaffProfile"] = relationship("StaffProfile", back_populates="working_hours")


class StaffTimeOff(Base, TimestampMixin):
    __tablename__ = "staff_time_off"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    staff_id: Mapped[str] = mapped_column(String(36), ForeignKey("staff_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    staff: Mapped["StaffProfile"] = relationship("StaffProfile", back_populates="time_off")
