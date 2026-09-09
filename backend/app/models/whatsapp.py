from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Integer, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import (
    MessageDirection,
    MessageDeliveryStatus,
    MessageType,
    WhatsAppTemplateType,
    WhatsAppTemplateStatus,
)
from app.models.base import Base, TimestampMixin, SoftDeleteMixin, TenantMixin, generate_uuid


class WhatsAppAccount(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "whatsapp_accounts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    phone_number_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    waba_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    display_phone_number: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    quality_rating: Mapped[str] = mapped_column(String(30), default="GREEN")
    verified_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    encrypted_access_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    webhook_secret: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_mock: Mapped[bool] = mapped_column(Boolean, default=True)
    meta_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    salon: Mapped["Salon"] = relationship("Salon", back_populates="whatsapp_account")


class WhatsAppTemplate(Base, TimestampMixin, SoftDeleteMixin, TenantMixin):
    __tablename__ = "whatsapp_templates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    template_type: Mapped[WhatsAppTemplateType] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="UTILITY")
    language: Mapped[str] = mapped_column(String(10), default="en")
    body: Mapped[str] = mapped_column(Text, nullable=False)
    variables: Mapped[List[str]] = mapped_column(JSON, default=list)  # list of variable names e.g. ["customer_name", "service_name", "time"]
    button_config: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    meta_template_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[WhatsAppTemplateStatus] = mapped_column(String(30), default=WhatsAppTemplateStatus.APPROVED)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    salon: Mapped["Salon"] = relationship("Salon", back_populates="whatsapp_templates")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="template")


class MessageThread(Base, TimestampMixin, TenantMixin):
    __tablename__ = "message_threads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    last_message_snippet: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    unread_count: Mapped[int] = mapped_column(Integer, default=0)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    channel: Mapped[str] = mapped_column(String(30), default="WHATSAPP")
    ai_handling_state: Mapped[str] = mapped_column(String(30), default="AWAITING_OWNER_ACTION")  # AWAITING_OWNER_ACTION, RESOLVED, AUTO_REPLIED

    # Relationships
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile", back_populates="message_threads")
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="thread", cascade="all, delete-orphan", order_by="Message.created_at")


class Message(Base, TimestampMixin, TenantMixin):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    thread_id: Mapped[str] = mapped_column(String(36), ForeignKey("message_threads.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[str] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    direction: Mapped[MessageDirection] = mapped_column(String(20), nullable=False, index=True)
    message_type: Mapped[MessageType] = mapped_column(String(30), default=MessageType.TEXT)
    status: Mapped[MessageDeliveryStatus] = mapped_column(String(30), default=MessageDeliveryStatus.QUEUED, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    template_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("whatsapp_templates.id", ondelete="SET NULL"), nullable=True)
    external_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)  # WhatsApp Message ID (wamid)
    payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    failed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    thread: Mapped["MessageThread"] = relationship("MessageThread", back_populates="messages")
    customer: Mapped["CustomerProfile"] = relationship("CustomerProfile", back_populates="messages")
    template: Mapped[Optional["WhatsAppTemplate"]] = relationship("WhatsAppTemplate", back_populates="messages")
    events: Mapped[List["MessageEvent"]] = relationship("MessageEvent", back_populates="message", cascade="all, delete-orphan")


class MessageEvent(Base, TimestampMixin):
    __tablename__ = "message_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    message_id: Mapped[str] = mapped_column(String(36), ForeignKey("messages.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # sent, delivered, read, failed, webhook_received
    status: Mapped[MessageDeliveryStatus] = mapped_column(String(30), nullable=False)
    event_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    message: Mapped["Message"] = relationship("Message", back_populates="events")
