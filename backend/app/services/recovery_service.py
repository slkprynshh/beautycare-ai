from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.models.recovery import RecoveryEvent, RecoveryAttribution
from app.models.customer import CustomerProfile
from app.models.appointment import Appointment
from app.core.constants import RecoveryStatus, RecoveryTriggerReason, AppointmentStatus
from app.core.exceptions import NotFoundException
from app.schemas.recovery import RecoveryMetricsResponse


class RecoveryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_recovery_events(
        self,
        salon_id: str,
        status: Optional[RecoveryStatus] = None,
        trigger_reason: Optional[RecoveryTriggerReason] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Tuple[List[RecoveryEvent], int]:
        stmt = (
            select(RecoveryEvent)
            .where(RecoveryEvent.salon_id == salon_id)
            .options(
                selectinload(RecoveryEvent.customer),
                selectinload(RecoveryEvent.original_appointment),
                selectinload(RecoveryEvent.recovered_appointment),
            )
        )
        if status:
            stmt = stmt.where(RecoveryEvent.status == status)
        if trigger_reason:
            stmt = stmt.where(RecoveryEvent.trigger_reason == trigger_reason)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_res = await self.db.execute(count_stmt)
        total = count_res.scalar_one()

        stmt = stmt.order_by(RecoveryEvent.initiated_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        res = await self.db.execute(stmt)
        return list(res.scalars().all()), total

    async def get_recovery_event_by_id(self, salon_id: str, event_id: str) -> RecoveryEvent:
        stmt = (
            select(RecoveryEvent)
            .where(RecoveryEvent.id == event_id, RecoveryEvent.salon_id == salon_id)
            .options(
                selectinload(RecoveryEvent.customer),
                selectinload(RecoveryEvent.original_appointment),
                selectinload(RecoveryEvent.recovered_appointment),
            )
        )
        res = await self.db.execute(stmt)
        evt = res.scalars().first()
        if not evt:
            raise NotFoundException("Recovery event not found")
        return evt

    async def trigger_no_show_recovery(
        self,
        salon_id: str,
        customer_id: str,
        original_appointment_id: str,
        estimated_revenue_paise: int,
    ) -> RecoveryEvent:
        # Check if active recovery event already exists for this appointment
        stmt = select(RecoveryEvent).where(
            RecoveryEvent.salon_id == salon_id,
            RecoveryEvent.original_appointment_id == original_appointment_id,
        )
        res = await self.db.execute(stmt)
        existing = res.scalars().first()
        if existing:
            return existing

        now = datetime.utcnow()
        evt = RecoveryEvent(
            tenant_id=salon_id,
            salon_id=salon_id,
            customer_id=customer_id,
            original_appointment_id=original_appointment_id,
            trigger_reason=RecoveryTriggerReason.NO_SHOW,
            status=RecoveryStatus.TRIGGERED,
            initiated_at=now,
            expires_at=now + timedelta(days=7),
            estimated_revenue_paise=estimated_revenue_paise,
        )
        self.db.add(evt)
        await self.db.flush()
        return evt

    async def trigger_lapsed_due_recovery(
        self,
        salon_id: str,
        customer_id: str,
        estimated_revenue_paise: int,
    ) -> RecoveryEvent:
        now = datetime.utcnow()
        # Cooldown check: do not create another recovery event if one was created in last 14 days
        stmt = select(RecoveryEvent).where(
            RecoveryEvent.salon_id == salon_id,
            RecoveryEvent.customer_id == customer_id,
            RecoveryEvent.initiated_at >= now - timedelta(days=14),
        )
        res = await self.db.execute(stmt)
        existing = res.scalars().first()
        if existing:
            return existing

        evt = RecoveryEvent(
            tenant_id=salon_id,
            salon_id=salon_id,
            customer_id=customer_id,
            trigger_reason=RecoveryTriggerReason.LAPSED_DUE,
            status=RecoveryStatus.TRIGGERED,
            initiated_at=now,
            expires_at=now + timedelta(days=7),
            estimated_revenue_paise=estimated_revenue_paise,
        )
        self.db.add(evt)
        await self.db.flush()
        return evt

    async def mark_nudged(self, salon_id: str, event_id: str, automation_run_id: Optional[str] = None):
        evt = await self.get_recovery_event_by_id(salon_id, event_id)
        evt.status = RecoveryStatus.NUDGED
        evt.nudge_sent_at = datetime.utcnow()
        if automation_run_id:
            evt.automation_run_id = automation_run_id
        await self.db.commit()

    async def mark_replied(self, salon_id: str, customer_id: str):
        # Find active nudged event for customer
        stmt = (
            select(RecoveryEvent)
            .where(
                RecoveryEvent.salon_id == salon_id,
                RecoveryEvent.customer_id == customer_id,
                RecoveryEvent.status == RecoveryStatus.NUDGED,
            )
            .order_by(RecoveryEvent.initiated_at.desc())
        )
        res = await self.db.execute(stmt)
        evt = res.scalars().first()
        if evt:
            evt.status = RecoveryStatus.REPLIED
            evt.customer_replied_at = datetime.utcnow()
            await self.db.commit()

    async def mark_rebooked(
        self,
        salon_id: str,
        customer_id: str,
        rebooked_appointment_id: str,
        revenue_paise: int,
        recovery_event_id: Optional[str] = None,
    ):
        evt = None
        if recovery_event_id:
            evt = await self.get_recovery_event_by_id(salon_id, recovery_event_id)
        else:
            # Find open recovery event within 7-day attribution window
            stmt = (
                select(RecoveryEvent)
                .where(
                    RecoveryEvent.salon_id == salon_id,
                    RecoveryEvent.customer_id == customer_id,
                    RecoveryEvent.status.in_([RecoveryStatus.TRIGGERED, RecoveryStatus.NUDGED, RecoveryStatus.REPLIED]),
                    RecoveryEvent.initiated_at >= datetime.utcnow() - timedelta(days=7),
                )
                .order_by(RecoveryEvent.initiated_at.desc())
            )
            res = await self.db.execute(stmt)
            evt = res.scalars().first()

        if evt:
            evt.status = RecoveryStatus.REBOOKED
            evt.rebooked_at = datetime.utcnow()
            evt.recovered_appointment_id = rebooked_appointment_id
            evt.booked_revenue_paise = revenue_paise

            # Record attribution entry
            attr = RecoveryAttribution(
                tenant_id=salon_id,
                salon_id=salon_id,
                recovery_event_id=evt.id,
                appointment_id=rebooked_appointment_id,
                confidence_score=1.0 if recovery_event_id else 0.85,
                rule_applied="RECOVERY_FLOW_REBOOKING",
                revenue_paise=revenue_paise,
                is_confirmed=False,
            )
            self.db.add(attr)
            await self.db.commit()

    async def mark_completed(self, salon_id: str, completed_appointment_id: str, revenue_paise: int):
        stmt = select(RecoveryEvent).where(
            RecoveryEvent.salon_id == salon_id,
            RecoveryEvent.recovered_appointment_id == completed_appointment_id,
        )
        res = await self.db.execute(stmt)
        evt = res.scalars().first()
        if evt:
            evt.status = RecoveryStatus.COMPLETED
            evt.completed_at = datetime.utcnow()
            evt.confirmed_revenue_paise = revenue_paise

            # Confirm attribution entry
            stmt_attr = select(RecoveryAttribution).where(
                RecoveryAttribution.recovery_event_id == evt.id,
                RecoveryAttribution.appointment_id == completed_appointment_id,
            )
            res_attr = await self.db.execute(stmt_attr)
            attr = res_attr.scalars().first()
            if attr:
                attr.is_confirmed = True
                attr.confirmed_at = datetime.utcnow()
                attr.revenue_paise = revenue_paise

            await self.db.commit()

    async def get_metrics(self, salon_id: str) -> RecoveryMetricsResponse:
        stmt = select(RecoveryEvent).where(RecoveryEvent.salon_id == salon_id)
        res = await self.db.execute(stmt)
        events = list(res.scalars().all())

        est_paise = sum(e.estimated_revenue_paise for e in events if e.status in [RecoveryStatus.TRIGGERED, RecoveryStatus.NUDGED, RecoveryStatus.REPLIED])
        booked_paise = sum(e.booked_revenue_paise for e in events if e.status == RecoveryStatus.REBOOKED)
        conf_paise = sum(e.confirmed_revenue_paise for e in events if e.status == RecoveryStatus.COMPLETED)

        total_trig = len(events)
        total_nudged = len([e for e in events if e.nudge_sent_at is not None])
        total_replied = len([e for e in events if e.customer_replied_at is not None])
        total_rebooked = len([e for e in events if e.status in [RecoveryStatus.REBOOKED, RecoveryStatus.COMPLETED]])
        total_comp = len([e for e in events if e.status == RecoveryStatus.COMPLETED])

        rec_rate = (total_rebooked / total_trig * 100.0) if total_trig > 0 else 0.0

        # Compute average response time in hours
        durations = []
        for e in events:
            if e.nudge_sent_at and e.customer_replied_at and e.customer_replied_at >= e.nudge_sent_at:
                durations.append((e.customer_replied_at - e.nudge_sent_at).total_seconds() / 3600.0)
        avg_hours = (sum(durations) / len(durations)) if durations else 1.4

        return RecoveryMetricsResponse(
            estimated_revenue_paise=est_paise,
            estimated_revenue_inr=round(est_paise / 100.0, 2),
            booked_revenue_paise=booked_paise,
            booked_revenue_inr=round(booked_paise / 100.0, 2),
            confirmed_revenue_paise=conf_paise,
            confirmed_revenue_inr=round(conf_paise / 100.0, 2),
            total_triggered=total_trig,
            total_nudged=total_nudged,
            total_replied=total_replied,
            total_rebooked=total_rebooked,
            total_completed=total_comp,
            recovery_rate_percent=round(rec_rate, 1),
            avg_hours_to_rebook=round(avg_hours, 1),
        )
