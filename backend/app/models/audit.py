from typing import Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import AuditActorType
from app.models.base import Base, TimestampMixin, TenantMixin, generate_uuid


class AuditLog(Base, TimestampMixin, TenantMixin):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    actor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    actor_type: Mapped[AuditActorType] = mapped_column(String(30), default=AuditActorType.USER, index=True)
    
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # e.g., APPOINTMENT_CANCELLED, RECOVERY_NUDGE_SENT, TEMPLATE_UPDATED
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # e.g., APPOINTMENT, CUSTOMER, WHATSAPP_ACCOUNT
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True, index=True)
    
    before_state: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    after_state: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    
    ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    actor: Mapped[Optional["User"]] = relationship("User")
