from datetime import datetime, date, time, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from app.models.salon import Salon
from app.models.automation import AutomationRule, AutomationRun
from app.models.appointment import Appointment, AppointmentService
from app.models.customer import CustomerProfile
from app.models.whatsapp import WhatsAppTemplate, Message
from app.models.recovery import RecoveryEvent
from app.services.messaging_service import MessagingService
from app.services.recovery_service import RecoveryService
from app.core.constants import (
    AutomationType,
    AutomationRunStatus,
    AppointmentStatus,
    RecoveryTriggerReason,
    RecoveryStatus,
)
from app.core.logging import logger


class AutomationEngine:
    def __init__(self, db: AsyncSession):
        self.db = db

    def is_quiet_hours(self, quiet_start: str = "21:30", quiet_end: str = "09:30") -> bool:
        """Check if current time is within Indian salon quiet hours (default 21:30 to 09:30)."""
        now_time = datetime.utcnow().time()
        # In a production setup with Asia/Kolkata (+05:30), compute IST time
        # UTC + 5:30
        ist_datetime = datetime.utcnow() + timedelta(hours=5, minutes=30)
        ist_time = ist_datetime.time()

        sh, sm = map(int, quiet_start.split(":"))
        eh, em = map(int, quiet_end.split(":"))
        start_t = time(sh, sm)
        end_t = time(eh, em)

        if start_t > end_t:  # Overnight range, e.g. 21:30 to 09:30
            return ist_time >= start_t or ist_time <= end_t
        else:
            return start_t <= ist_time <= end_t

    async def run_all_automations(self, salon_id: str) -> Dict[str, Any]:
        """Trigger all active automations for a salon."""
        reminders_count = await self.process_appointment_reminders(salon_id)
        no_shows_count = await self.detect_no_shows_and_reschedule(salon_id)
        due_nudges_count = await self.process_service_due_nudges(salon_id)
        return {
            "reminders_sent": reminders_count,
            "no_shows_processed": no_shows_count,
            "due_nudges_sent": due_nudges_count,
        }

    async def process_appointment_reminders(self, salon_id: str) -> int:
        """Find upcoming appointments within 24h window and send reminders."""
        # 1. Check salon settings and rule
        stmt_rule = select(AutomationRule).where(
            AutomationRule.salon_id == salon_id,
            AutomationRule.automation_type == AutomationType.PRE_APPOINTMENT_REMINDER,
            AutomationRule.is_active == True,
        )
        res_rule = await self.db.execute(stmt_rule)
        rule = res_rule.scalars().first()
        if not rule:
            return 0

        if rule.respect_quiet_hours and self.is_quiet_hours(rule.quiet_hours_start, rule.quiet_hours_end):
            logger.info("Skipping reminders during quiet hours", salon_id=salon_id)
            return 0

        # Window: starts_at between now and now + 26 hours
        now = datetime.utcnow()
        window_end = now + timedelta(hours=26)

        stmt_appts = (
            select(Appointment)
            .where(
                Appointment.salon_id == salon_id,
                Appointment.status == AppointmentStatus.CONFIRMED,
                Appointment.starts_at >= now,
                Appointment.starts_at <= window_end,
                Appointment.is_deleted == False,
            )
            .options(
                selectinload(Appointment.customer),
                selectinload(Appointment.appointment_services),
            )
        )
        res_appts = await self.db.execute(stmt_appts)
        appts = list(res_appts.scalars().all())

        sent_count = 0
        msg_service = MessagingService(self.db)

        for appt in appts:
            if not appt.customer or appt.customer.whatsapp_opt_out:
                continue

            # Check if reminder run already executed for this appointment
            stmt_run = select(AutomationRun).where(
                AutomationRun.rule_id == rule.id,
                AutomationRun.appointment_id == appt.id,
                AutomationRun.status == AutomationRunStatus.COMPLETED,
            )
            res_run = await self.db.execute(stmt_run)
            if res_run.scalars().first():
                continue

            svc_name = appt.appointment_services[0].service_name if appt.appointment_services else "Appointment"
            time_str = appt.starts_at.strftime("%I:%M %p")
            date_str = appt.starts_at.strftime("%b %d")
            
            body = (
                f"Hello {appt.customer.full_name}, this is a reminder for your upcoming {svc_name} "
                f"appointment on {date_str} at {time_str}. Reply YES to confirm or RESCHEDULE if you need to adjust."
            )

            try:
                msg = await msg_service.send_text_message(
                    salon_id=salon_id,
                    customer_id=appt.customer_id,
                    body=body,
                )
                run = AutomationRun(
                    tenant_id=salon_id,
                    salon_id=salon_id,
                    rule_id=rule.id,
                    customer_id=appt.customer_id,
                    appointment_id=appt.id,
                    message_id=msg.id,
                    status=AutomationRunStatus.COMPLETED,
                    scheduled_for=now,
                    executed_at=now,
                )
                self.db.add(run)
                sent_count += 1
            except Exception as exc:
                logger.error("Failed to send reminder automation", exc_info=exc)

        await self.db.commit()
        return sent_count

    async def detect_no_shows_and_reschedule(self, salon_id: str) -> int:
        """Find past appointments that were never checked in, mark NO_SHOW, and send reschedule prompt."""
        stmt_rule = select(AutomationRule).where(
            AutomationRule.salon_id == salon_id,
            AutomationRule.automation_type == AutomationType.NO_SHOW_RESCHEDULE,
            AutomationRule.is_active == True,
        )
        res_rule = await self.db.execute(stmt_rule)
        rule = res_rule.scalars().first()
        if not rule:
            return 0

        # Look for appointments that started > 30 minutes ago and are still CONFIRMED or PENDING
        cutoff_time = datetime.utcnow() - timedelta(minutes=30)
        day_lookback = datetime.utcnow() - timedelta(hours=24)

        stmt_appts = (
            select(Appointment)
            .where(
                Appointment.salon_id == salon_id,
                Appointment.status.in_([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]),
                Appointment.starts_at <= cutoff_time,
                Appointment.starts_at >= day_lookback,
                Appointment.is_deleted == False,
            )
            .options(
                selectinload(Appointment.customer),
                selectinload(Appointment.appointment_services),
            )
        )
        res_appts = await self.db.execute(stmt_appts)
        missed_appts = list(res_appts.scalars().all())

        processed_count = 0
        msg_service = MessagingService(self.db)
        rec_service = RecoveryService(self.db)

        for appt in missed_appts:
            appt.status = AppointmentStatus.NO_SHOW

            if not appt.customer or appt.customer.whatsapp_opt_out:
                continue

            # Create or get recovery event
            evt = await rec_service.trigger_no_show_recovery(
                salon_id=salon_id,
                customer_id=appt.customer_id,
                original_appointment_id=appt.id,
                estimated_revenue_paise=appt.total_price_paise,
            )

            # Check if prompt message already sent for this appointment
            stmt_run = select(AutomationRun).where(
                AutomationRun.rule_id == rule.id,
                AutomationRun.appointment_id == appt.id,
            )
            res_run = await self.db.execute(stmt_run)
            if res_run.scalars().first():
                continue

            # Check quiet hours before sending
            is_quiet = rule.respect_quiet_hours and self.is_quiet_hours(rule.quiet_hours_start, rule.quiet_hours_end)
            if is_quiet:
                # Schedule for next morning
                continue

            svc_name = appt.appointment_services[0].service_name if appt.appointment_services else "service"
            body = (
                f"Hi {appt.customer.full_name}, we missed you today for your {svc_name} appointment! "
                f"We know plans change — would you like to reschedule for tomorrow or this weekend? Reply with your preferred day/time!"
            )

            try:
                msg = await msg_service.send_text_message(
                    salon_id=salon_id,
                    customer_id=appt.customer_id,
                    body=body,
                )
                run = AutomationRun(
                    tenant_id=salon_id,
                    salon_id=salon_id,
                    rule_id=rule.id,
                    customer_id=appt.customer_id,
                    appointment_id=appt.id,
                    message_id=msg.id,
                    status=AutomationRunStatus.COMPLETED,
                    scheduled_for=datetime.utcnow(),
                    executed_at=datetime.utcnow(),
                )
                self.db.add(run)
                await rec_service.mark_nudged(salon_id, evt.id, automation_run_id=run.id)
                processed_count += 1
            except Exception as exc:
                logger.error("Failed to send no-show prompt", exc_info=exc)

        await self.db.commit()
        return processed_count

    async def process_service_due_nudges(self, salon_id: str) -> int:
        """Find clients whose return cycle is due/overdue and send a personalized rebooking nudge."""
        stmt_rule = select(AutomationRule).where(
            AutomationRule.salon_id == salon_id,
            AutomationRule.automation_type == AutomationType.SERVICE_INTERVAL_DUE,
            AutomationRule.is_active == True,
        )
        res_rule = await self.db.execute(stmt_rule)
        rule = res_rule.scalars().first()
        if not rule:
            return 0

        if rule.respect_quiet_hours and self.is_quiet_hours(rule.quiet_hours_start, rule.quiet_hours_end):
            return 0

        today_date = date.today()
        # Find customers with next_due_date <= today and not opted out
        stmt_cust = (
            select(CustomerProfile)
            .where(
                CustomerProfile.salon_id == salon_id,
                CustomerProfile.whatsapp_opt_out == False,
                CustomerProfile.next_due_date.is_not(None),
                CustomerProfile.next_due_date <= today_date,
                CustomerProfile.is_deleted == False,
            )
        )
        res_cust = await self.db.execute(stmt_cust)
        due_customers = list(res_cust.scalars().all())

        nudged_count = 0
        msg_service = MessagingService(self.db)
        rec_service = RecoveryService(self.db)

        for cust in due_customers:
            # Check 14-day anti-spam cooldown
            cooldown_cutoff = datetime.utcnow() - timedelta(days=rule.cooldown_days)
            stmt_recent_run = select(AutomationRun).where(
                AutomationRun.rule_id == rule.id,
                AutomationRun.customer_id == cust.id,
                AutomationRun.executed_at >= cooldown_cutoff,
            )
            res_recent = await self.db.execute(stmt_recent_run)
            if res_recent.scalars().first():
                continue

            # Average spend or default ₹1,500
            estimated_paise = int(cust.total_spend_paise / max(1, cust.total_visits)) if cust.total_visits > 0 else 150000

            evt = await rec_service.trigger_lapsed_due_recovery(
                salon_id=salon_id,
                customer_id=cust.id,
                estimated_revenue_paise=estimated_paise,
            )

            body = (
                f"Hi {cust.full_name}, it's been about a month since your last visit. "
                f"Your hair and skin deserve a refresh! Reply here to book your preferred slot this week."
            )

            try:
                msg = await msg_service.send_text_message(
                    salon_id=salon_id,
                    customer_id=cust.id,
                    body=body,
                )
                run = AutomationRun(
                    tenant_id=salon_id,
                    salon_id=salon_id,
                    rule_id=rule.id,
                    customer_id=cust.id,
                    message_id=msg.id,
                    status=AutomationRunStatus.COMPLETED,
                    scheduled_for=datetime.utcnow(),
                    executed_at=datetime.utcnow(),
                )
                self.db.add(run)
                await rec_service.mark_nudged(salon_id, evt.id, automation_run_id=run.id)
                nudged_count += 1
            except Exception as exc:
                logger.error("Failed to send service due nudge", exc_info=exc)

        await self.db.commit()
        return nudged_count
