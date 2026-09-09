from typing import Optional, Dict, Any
from sqlalchemy import String, Float, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import AIIntentType
from app.models.base import Base, TimestampMixin, TenantMixin, generate_uuid


class AIInteraction(Base, TimestampMixin, TenantMixin):
    __tablename__ = "ai_interactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    customer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("customer_profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    message_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("messages.id", ondelete="SET NULL"), nullable=True, index=True)
    
    interaction_type: Mapped[str] = mapped_column(String(50), default="INTENT_AND_DRAFT")  # INTENT_CLASSIFICATION, DRAFT_REPLY, ENTITY_EXTRACTION
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    
    extracted_intent: Mapped[Optional[AIIntentType]] = mapped_column(String(50), nullable=True)
    extracted_entities: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)  # date, time, service_name, staff_name, party_size
    generated_reply: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    requires_human_review: Mapped[bool] = mapped_column(Boolean, default=True)  # True if confidence < 0.85
    is_approved_by_owner: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    applied_in_reply: Mapped[bool] = mapped_column(Boolean, default=False)
    
    model_name: Mapped[str] = mapped_column(String(50), default="gpt-4o-mini")
    latency_ms: Mapped[Optional[int]] = mapped_column(nullable=True)
    metadata_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Relationships
    customer: Mapped[Optional["CustomerProfile"]] = relationship("CustomerProfile")
    message: Mapped[Optional["Message"]] = relationship("Message")
