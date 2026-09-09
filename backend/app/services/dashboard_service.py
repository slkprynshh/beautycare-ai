from datetime import date, datetime, time, timedelta
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.models.appointment import Appointment, AppointmentService
from app.models.recovery import RecoveryEvent
from app.models.whatsapp import Message
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    TodayOverview,
    RevenueRecoveryCard,
    ActivityFeedItem,
    ChartDataPoint,
)
from app.schemas.appointment import AppointmentResponse
from app.core.constants import AppointmentStatus, RecoveryStatus
from app.services.recovery_service import RecoveryService


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_summary(self, salon_id: str) -> DashboardSummaryResponse:
        today = date.today()
        today_start = datetime.combine(today, time.min)
        today_end = datetime.combine(today, time.max)

        # 1. Fetch Today's Appointments
        stmt_today_appts = (
            select(Appointment)
            .where(
                Appointment.salon_id == salon_id,
                Appointment.is_deleted == False,
                Appointment.starts_at >= today_start,
                Appointment.starts_at <= today_end,
            )
            .options(
                selectinload(Appointment.customer),
                selectinload(Appointment.primary_staff),
                selectinload(Appointment.appointment_services).selectinload(AppointmentService.service),
            )
            .order_by(Appointment.starts_at)
        )
        res_today = await self.db.execute(stmt_today_appts)
        today_appts = list(res_today.scalars().all())

        confirmed_count = len([a for a in today_appts if a.status == AppointmentStatus.CONFIRMED])
        in_service_count = len([a for a in today_appts if a.status == AppointmentStatus.IN_SERVICE])
        completed_count = len([a for a in today_appts if a.status == AppointmentStatus.COMPLETED])
        no_show_count = len([a for a in today_appts if a.status == AppointmentStatus.NO_SHOW])
        
        today_rev_paise = sum(a.total_price_paise for a in today_appts if a.status in [AppointmentStatus.COMPLETED, AppointmentStatus.IN_SERVICE])
        today_overview = TodayOverview(
            total_appointments_today=len(today_appts),
            confirmed_count=confirmed_count,
            in_service_count=in_service_count,
            completed_count=completed_count,
            no_show_count=no_show_count,
            today_revenue_inr=round(today_rev_paise / 100.0, 2),
        )

        # 2. Recovery Metrics
        rec_svc = RecoveryService(self.db)
        rec_metrics = await rec_svc.get_metrics(salon_id)

        recovery_card = RevenueRecoveryCard(
            estimated_revenue_inr=rec_metrics.estimated_revenue_inr,
            booked_revenue_inr=rec_metrics.booked_revenue_inr,
            confirmed_revenue_inr=rec_metrics.confirmed_revenue_inr,
            active_recovery_count=rec_metrics.total_triggered - rec_metrics.total_completed,
            recovery_rate_percentage=rec_metrics.recovery_rate_percent,
        )

        # 3. Upcoming Appointments
        now = datetime.utcnow()
        upcoming_appts = [a for a in today_appts if a.starts_at >= now and a.status == AppointmentStatus.CONFIRMED][:5]
        upcoming_responses = [AppointmentResponse.model_validate(a) for a in upcoming_appts]

        # 4. Activity Feed (from recent Recovery Events & Messages)
        stmt_rec_evts = (
            select(RecoveryEvent)
            .where(RecoveryEvent.salon_id == salon_id)
            .options(selectinload(RecoveryEvent.customer))
            .order_by(RecoveryEvent.initiated_at.desc())
            .limit(5)
        )
        res_evts = await self.db.execute(stmt_rec_evts)
        recent_evts = list(res_evts.scalars().all())

        activity_items: List[ActivityFeedItem] = []
        for evt in recent_evts:
            cname = evt.customer.full_name if evt.customer else "Client"
            if evt.status == RecoveryStatus.COMPLETED:
                activity_items.append(
                    ActivityFeedItem(
                        id=f"rec-comp-{evt.id}",
                        type="RECOVERY_CONFIRMED",
                        title=f"Recovered ₹{evt.confirmed_revenue_paise / 100:.0f} Revenue",
                        description=f"{cname} completed their rebooked appointment",
                        timestamp=evt.completed_at or evt.initiated_at,
                        customer_name=cname,
                        amount_inr=round(evt.confirmed_revenue_paise / 100.0, 2),
                        badge_color="emerald",
                    )
                )
            elif evt.status == RecoveryStatus.REBOOKED:
                activity_items.append(
                    ActivityFeedItem(
                        id=f"rec-book-{evt.id}",
                        type="APPOINTMENT_BOOKED",
                        title="Reschedule Confirmed via WhatsApp",
                        description=f"{cname} rebooked via automated prompt",
                        timestamp=evt.rebooked_at or evt.initiated_at,
                        customer_name=cname,
                        amount_inr=round(evt.booked_revenue_paise / 100.0, 2),
                        badge_color="teal",
                    )
                )
            elif evt.status == RecoveryStatus.NUDGED:
                activity_items.append(
                    ActivityFeedItem(
                        id=f"rec-nudge-{evt.id}",
                        type="RECOVERY_NUDGE",
                        title="Reschedule Prompt Sent",
                        description=f"Automated follow-up delivered to {cname}",
                        timestamp=evt.nudge_sent_at or evt.initiated_at,
                        customer_name=cname,
                        amount_inr=round(evt.estimated_revenue_paise / 100.0, 2),
                        badge_color="amber",
                    )
                )

        # 5. 7-Day Revenue Trend Chart
        chart_data: List[ChartDataPoint] = []
        for d in range(6, -1, -1):
            target_d = today - timedelta(days=d)
            d_start = datetime.combine(target_d, time.min)
            d_end = datetime.combine(target_d, time.max)

            stmt_d_appts = select(Appointment).where(
                Appointment.salon_id == salon_id,
                Appointment.is_deleted == False,
                Appointment.starts_at >= d_start,
                Appointment.starts_at <= d_end,
                Appointment.status == AppointmentStatus.COMPLETED,
            )
            res_d = await self.db.execute(stmt_d_appts)
            d_appts = list(res_d.scalars().all())

            rec_sum = sum(a.total_price_paise for a in d_appts if a.is_recovered)
            dir_sum = sum(a.total_price_paise for a in d_appts if not a.is_recovered)
            rec_cnt = len([a for a in d_appts if a.is_recovered])

            chart_data.append(
                ChartDataPoint(
                    date=target_d.strftime("%a %d"),
                    recovered_inr=round(rec_sum / 100.0, 2),
                    direct_inr=round(dir_sum / 100.0, 2),
                    no_shows_count=0,
                    recovered_count=rec_cnt,
                )
            )

        return DashboardSummaryResponse(
            today=today_overview,
            recovery=recovery_card,
            upcoming_appointments=upcoming_responses,
            recent_activity=activity_items,
            revenue_chart_7d=chart_data,
        )
