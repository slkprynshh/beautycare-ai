from typing import Optional, List
from sqlalchemy import String, Integer, BigInteger, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid


class ServiceCategory(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "service_categories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    icon_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Relationships
    services: Mapped[List["Service"]] = relationship("Service", back_populates="category")


class Service(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    category_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("service_categories.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=45)
    buffer_minutes_after: Mapped[int] = mapped_column(Integer, default=0)
    price_paise: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    typical_return_interval_days: Mapped[int] = mapped_column(Integer, default=30)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    category: Mapped[Optional["ServiceCategory"]] = relationship("ServiceCategory", back_populates="services")
    staff_services: Mapped[List["StaffService"]] = relationship("StaffService", back_populates="service", cascade="all, delete-orphan")
    appointment_services: Mapped[List["AppointmentService"]] = relationship("AppointmentService", back_populates="service")
