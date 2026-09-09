import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import asyncio
from datetime import datetime, date, time, timedelta
from sqlalchemy import select

from app.core.database import init_db, AsyncSessionLocal
from app.core.security import hash_password, normalize_phone_number
from app.core.constants import (
    UserRole,
    StaffRole,
    CustomerLifecycleStage,
    AppointmentStatus,
    BookingSource,
    RecoveryStatus,
    RecoveryTriggerReason,
    MessageDirection,
    MessageDeliveryStatus,
    MessageType,
    WhatsAppTemplateType,
    WhatsAppTemplateStatus,
    AutomationType,
)
from app.models.salon import Salon, SalonMembership, SalonBusinessHours
from app.models.user import User
from app.models.customer import CustomerProfile, CustomerPreference
from app.models.service import ServiceCategory, Service
from app.models.staff import StaffProfile, StaffWorkingHours, StaffService
from app.models.appointment import Appointment, AppointmentService, AppointmentStatusEvent
from app.models.whatsapp import WhatsAppAccount, WhatsAppTemplate, MessageThread, Message, MessageEvent
from app.models.automation import AutomationRule
from app.models.recovery import RecoveryEvent, RecoveryAttribution
from app.models.ai import AIInteraction
from app.core.logging import logger


async def seed_data():
    logger.info("Initializing database tables for seeding...")
    await init_db()

    async with AsyncSessionLocal() as db:
        logger.info("Starting seed process for Luxe Aura Salon Mumbai...")

        # 1. Create Owner User
        owner_phone = "+919820011223"
        stmt_check = select(User).where(User.phone == owner_phone)
        res_check = await db.execute(stmt_check)
        if res_check.scalars().first():
            logger.info("Database is already seeded with Luxe Aura Salon Mumbai! Skipping seed.")
            return

        owner = User(
            full_name="Rohan Mehra",
            phone=owner_phone,
            email="rohan@luxeaura.in",
            password_hash=hash_password("vertops123"),
            is_active=True,
        )
        db.add(owner)
        await db.flush()

        # Manager User
        manager = User(
            full_name="Neha Sharma",
            phone="+919820044556",
            email="neha@luxeaura.in",
            password_hash=hash_password("vertops123"),
            is_active=True,
        )
        db.add(manager)
        await db.flush()

        # 2. Create Salon
        salon = Salon(
            name="Luxe Aura Salon & Spa",
            slug="luxe-aura-mumbai",
            tagline="Premier Bespoke Hair & Skin Sanctuary",
            phone="+919820011223",
            email="concierge@luxeaura.in",
            address_line="Shop 4 & 5, Silver Pearl Heritage, Waterfield Road",
            locality="Bandra West",
            city="Mumbai",
            state="Maharashtra",
            postal_code="400050",
            timezone="Asia/Kolkata",
            currency="INR",
            quiet_hours_start="21:30",
            quiet_hours_end="09:30",
            auto_reminders_enabled=True,
            auto_reschedule_enabled=True,
            auto_due_nudges_enabled=True,
            service_charge_percent=5.0,
            gst_percent=18.0,
        )
        db.add(salon)
        await db.flush()

        # Memberships
        db.add(SalonMembership(salon_id=salon.id, user_id=owner.id, role=UserRole.OWNER, is_primary=True))
        db.add(SalonMembership(salon_id=salon.id, user_id=manager.id, role=UserRole.MANAGER, is_primary=True))

        # 3. Salon Business Hours (Tue-Sun 10:00 - 20:30, Mon closed)
        for day in range(7):
            bh = SalonBusinessHours(
                tenant_id=salon.id,
                salon_id=salon.id,
                day_of_week=day,
                open_time="10:00",
                close_time="20:30",
                is_closed=(day == 0),
            )
            db.add(bh)

        # 4. WhatsApp Account
        wa_account = WhatsAppAccount(
            tenant_id=salon.id,
            salon_id=salon.id,
            phone_number_id="108923847291823",
            waba_id="92837461928374",
            display_phone_number="+91 98200 11223",
            quality_rating="GREEN",
            verified_name="Luxe Aura Salon",
            is_active=True,
            is_mock=True,
        )
        db.add(wa_account)

        # 5. WhatsApp Templates
        t1 = WhatsAppTemplate(
            tenant_id=salon.id,
            salon_id=salon.id,
            template_type=WhatsAppTemplateType.APPOINTMENT_REMINDER_24H,
            name="appointment_reminder_24h",
            body="Hello {{1}}, friendly reminder from Luxe Aura for your {{2}} tomorrow at {{3}} with {{4}}. Reply YES to confirm or RESCHEDULE to pick a new slot.",
            variables=["customer_name", "service_name", "appointment_time", "staff_name"],
            status=WhatsAppTemplateStatus.APPROVED,
        )
        t2 = WhatsAppTemplate(
            tenant_id=salon.id,
            salon_id=salon.id,
            template_type=WhatsAppTemplateType.NO_SHOW_RESCHEDULE_PROMPT,
            name="no_show_reschedule_prompt",
            body="Hi {{1}}, we missed you today at Luxe Aura for your {{2}}! We know things come up — reply with a day & time that suits you better, and we'll save your spot.",
            variables=["customer_name", "service_name"],
            status=WhatsAppTemplateStatus.APPROVED,
        )
        t3 = WhatsAppTemplate(
            tenant_id=salon.id,
            salon_id=salon.id,
            template_type=WhatsAppTemplateType.SERVICE_INTERVAL_DUE_NUDGE,
            name="service_due_nudge",
            body="Hi {{1}}, it's been about 4 weeks since your last {{2}} at Luxe Aura. Time for a refresh! Reply here to claim our VIP priority slot this week.",
            variables=["customer_name", "service_name"],
            status=WhatsAppTemplateStatus.APPROVED,
        )
        db.add_all([t1, t2, t3])

        # 6. Automation Rules
        db.add(AutomationRule(
            tenant_id=salon.id,
            salon_id=salon.id,
            name="24-Hour Pre-Appointment Reminder",
            automation_type=AutomationType.PRE_APPOINTMENT_REMINDER,
            trigger_offset_minutes=-1440,
            is_active=True,
            cooldown_days=1,
            max_attempts=1,
        ))
        db.add(AutomationRule(
            tenant_id=salon.id,
            salon_id=salon.id,
            name="30-Min Post No-Show Reschedule Follow-up",
            automation_type=AutomationType.NO_SHOW_RESCHEDULE,
            trigger_offset_minutes=30,
            is_active=True,
            cooldown_days=7,
            max_attempts=1,
        ))
        db.add(AutomationRule(
            tenant_id=salon.id,
            salon_id=salon.id,
            name="4-Week Hair & Skin Refresh Nudge",
            automation_type=AutomationType.SERVICE_INTERVAL_DUE,
            trigger_offset_minutes=0,
            is_active=True,
            cooldown_days=14,
            max_attempts=1,
        ))

        # 7. Service Categories & Services
        cat_hair = ServiceCategory(tenant_id=salon.id, salon_id=salon.id, name="Hair Artistry & Styling", display_order=1)
        cat_color = ServiceCategory(tenant_id=salon.id, salon_id=salon.id, name="Color & Texture Rituals", display_order=2)
        cat_skin = ServiceCategory(tenant_id=salon.id, salon_id=salon.id, name="Luxury Skin & Facials", display_order=3)
        cat_spa = ServiceCategory(tenant_id=salon.id, salon_id=salon.id, name="Hands, Feet & Wellness", display_order=4)
        db.add_all([cat_hair, cat_color, cat_skin, cat_spa])
        await db.flush()

        svc1 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_hair.id,
            name="Master Stylist Haircut & Blowdry", duration_minutes=45,
            price_paise=180000, typical_return_interval_days=28, display_order=1,
        )
        svc2 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_hair.id,
            name="Signature Scalp Detox & Blowout", duration_minutes=60,
            price_paise=240000, typical_return_interval_days=21, display_order=2,
        )
        svc3 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_color.id,
            name="Custom Balayage & Glossing", duration_minutes=150,
            price_paise=750000, typical_return_interval_days=60, display_order=1,
        )
        svc4 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_color.id,
            name="Organic Root Touch-Up & Shine Glaze", duration_minutes=75,
            price_paise=320000, typical_return_interval_days=30, display_order=2,
        )
        svc5 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_color.id,
            name="Brazilian Keratin Smooth Infusion", duration_minutes=120,
            price_paise=580000, typical_return_interval_days=90, display_order=3,
        )
        svc6 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_skin.id,
            name="Hydra-Glow Collagen Radiance Facial", duration_minutes=60,
            price_paise=420000, typical_return_interval_days=30, display_order=1,
        )
        svc7 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_skin.id,
            name="24K Gold Brightening Ritual", duration_minutes=75,
            price_paise=550000, typical_return_interval_days=45, display_order=2,
        )
        svc8 = Service(
            tenant_id=salon.id, salon_id=salon.id, category_id=cat_spa.id,
            name="Rose Petal & Sea Salt Pedicure", duration_minutes=50,
            price_paise=160000, typical_return_interval_days=21, display_order=1,
        )
        db.add_all([svc1, svc2, svc3, svc4, svc5, svc6, svc7, svc8])
        await db.flush()

        # 8. Staff Profiles
        staff1 = StaffProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Priya Deshmukh", display_title="Creative Color & Styling Director",
            phone="+919820011111", email="priya@luxeaura.in",
            staff_role=StaffRole.CREATIVE_DIRECTOR,
        )
        staff2 = StaffProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Rahul Verma", display_title="Senior Hair Artist & Texture Expert",
            phone="+919820022222", email="rahul@luxeaura.in",
            staff_role=StaffRole.SENIOR_STYLIST,
        )
        staff3 = StaffProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Ananya Sen", display_title="Lead Aesthetician & Dermal Therapist",
            phone="+919820033333", email="ananya@luxeaura.in",
            staff_role=StaffRole.ESTHETICIAN,
        )
        staff4 = StaffProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Vikram Kapoor", display_title="Master Barber & Stylist",
            phone="+919820044444", email="vikram@luxeaura.in",
            staff_role=StaffRole.STYLIST,
        )
        db.add_all([staff1, staff2, staff3, staff4])
        await db.flush()

        for st in [staff1, staff2, staff3, staff4]:
            for day in range(7):
                db.add(StaffWorkingHours(
                    staff_id=st.id,
                    day_of_week=day,
                    start_time="10:00",
                    end_time="19:30",
                    is_day_off=(day == 0),
                ))

        # 9. Customer Profiles
        c1 = CustomerProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Aarav Singhania", phone="+919819123456", email="aarav@gmail.com",
            lifecycle_stage=CustomerLifecycleStage.ACTIVE, total_visits=4, total_spend_paise=1120000,
            last_visit_at=datetime.utcnow() - timedelta(days=12),
            next_due_date=date.today() + timedelta(days=16),
        )
        c2 = CustomerProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Meera Kapoor", phone="+919820987654", email="meera.k@outlook.com",
            lifecycle_stage=CustomerLifecycleStage.DUE_FOR_RETURN, total_visits=6, total_spend_paise=2450000,
            last_visit_at=datetime.utcnow() - timedelta(days=34),
            next_due_date=date.today() - timedelta(days=4), # Due!
        )
        c3 = CustomerProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Dia Merchant", phone="+919833445566", email="dia.m@gmail.com",
            lifecycle_stage=CustomerLifecycleStage.OVERDUE_LAPSED, total_visits=3, total_spend_paise=980000,
            last_visit_at=datetime.utcnow() - timedelta(days=58),
            next_due_date=date.today() - timedelta(days=28), # Overdue!
        )
        c4 = CustomerProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Kabir Oberoi", phone="+919811223344", email="kabir@oberoi.in",
            lifecycle_stage=CustomerLifecycleStage.ACTIVE, total_visits=2, total_spend_paise=540000,
            last_visit_at=datetime.utcnow() - timedelta(days=6),
            next_due_date=date.today() + timedelta(days=22),
        )
        c5 = CustomerProfile(
            tenant_id=salon.id, salon_id=salon.id,
            full_name="Rhea Chawla", phone="+919822334455", email="rhea@chawla.com",
            lifecycle_stage=CustomerLifecycleStage.NEW, total_visits=0, total_spend_paise=0,
        )
        db.add_all([c1, c2, c3, c4, c5])
        await db.flush()

        # Add Preferences
        for cust in [c1, c2, c3, c4, c5]:
            db.add(CustomerPreference(
                customer_id=cust.id,
                preferred_beverage="Green Tea / Black Coffee",
                preferred_stylist_id=staff1.id,
                allergies="None",
            ))

        # 10. Appointments
        now = datetime.utcnow()
        # Appointment 1: Today confirmed (Aarav with Priya)
        appt1 = Appointment(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c1.id, primary_staff_id=staff1.id,
            starts_at=now.replace(hour=11, minute=0, second=0),
            ends_at=now.replace(hour=11, minute=45, second=0),
            duration_minutes=45, status=AppointmentStatus.CONFIRMED,
            total_price_paise=180000, source=BookingSource.WHATSAPP_NUDGE,
        )
        # Appointment 2: Today afternoon (Kabir with Rahul)
        appt2 = Appointment(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c4.id, primary_staff_id=staff2.id,
            starts_at=now.replace(hour=15, minute=0, second=0),
            ends_at=now.replace(hour=16, minute=0, second=0),
            duration_minutes=60, status=AppointmentStatus.CONFIRMED,
            total_price_paise=240000, source=BookingSource.DASHBOARD_WALKIN,
        )
        # Appointment 3: Recovered & Completed 2 days ago (Meera)
        appt3 = Appointment(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c2.id, primary_staff_id=staff3.id,
            starts_at=now - timedelta(days=2, hours=3),
            ends_at=now - timedelta(days=2, hours=2),
            duration_minutes=60, status=AppointmentStatus.COMPLETED,
            total_price_paise=420000, source=BookingSource.WHATSAPP_NUDGE, is_recovered=True,
        )
        # Appointment 4: Past No-Show 3 days ago (Dia)
        appt4 = Appointment(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c3.id, primary_staff_id=staff1.id,
            starts_at=now - timedelta(days=3, hours=5),
            ends_at=now - timedelta(days=3, hours=3),
            duration_minutes=120, status=AppointmentStatus.NO_SHOW,
            total_price_paise=580000, source=BookingSource.DASHBOARD_WALKIN,
        )
        db.add_all([appt1, appt2, appt3, appt4])
        await db.flush()

        db.add(AppointmentService(
            tenant_id=salon.id, salon_id=salon.id, appointment_id=appt1.id,
            service_id=svc1.id, staff_id=staff1.id, service_name=svc1.name,
            price_paise=svc1.price_paise, duration_minutes=45,
        ))
        db.add(AppointmentService(
            tenant_id=salon.id, salon_id=salon.id, appointment_id=appt2.id,
            service_id=svc2.id, staff_id=staff2.id, service_name=svc2.name,
            price_paise=svc2.price_paise, duration_minutes=60,
        ))
        db.add(AppointmentService(
            tenant_id=salon.id, salon_id=salon.id, appointment_id=appt3.id,
            service_id=svc6.id, staff_id=staff3.id, service_name=svc6.name,
            price_paise=svc6.price_paise, duration_minutes=60,
        ))
        db.add(AppointmentService(
            tenant_id=salon.id, salon_id=salon.id, appointment_id=appt4.id,
            service_id=svc5.id, staff_id=staff1.id, service_name=svc5.name,
            price_paise=svc5.price_paise, duration_minutes=120,
        ))

        # 11. Recovery Pipeline Seed Records
        # Recovery 1: Completed recovery for Meera (Hydra-Glow ₹4,200 recovered revenue)
        rec1 = RecoveryEvent(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c2.id,
            trigger_reason=RecoveryTriggerReason.LAPSED_DUE,
            status=RecoveryStatus.COMPLETED,
            initiated_at=now - timedelta(days=4),
            nudge_sent_at=now - timedelta(days=4),
            customer_replied_at=now - timedelta(days=4, hours=-1),
            rebooked_at=now - timedelta(days=3),
            completed_at=now - timedelta(days=2),
            recovered_appointment_id=appt3.id,
            estimated_revenue_paise=420000,
            booked_revenue_paise=420000,
            confirmed_revenue_paise=420000,
        )
        # Recovery 2: Nudged no-show for Dia (Keratin ₹5,800 estimated)
        rec2 = RecoveryEvent(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c3.id,
            original_appointment_id=appt4.id,
            trigger_reason=RecoveryTriggerReason.NO_SHOW,
            status=RecoveryStatus.NUDGED,
            initiated_at=now - timedelta(days=3),
            nudge_sent_at=now - timedelta(days=3, minutes=-30),
            estimated_revenue_paise=580000,
        )
        db.add_all([rec1, rec2])
        await db.flush()

        db.add(RecoveryAttribution(
            tenant_id=salon.id, salon_id=salon.id,
            recovery_event_id=rec1.id, appointment_id=appt3.id,
            confidence_score=1.0, rule_applied="DIRECT_WHATSAPP_REBOOKING",
            revenue_paise=420000, is_confirmed=True, confirmed_at=now - timedelta(days=2),
        ))

        # 12. WhatsApp Conversation Threads & Messages
        # Thread for Meera
        thread_meera = MessageThread(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c2.id,
            last_message_at=now - timedelta(days=3),
            last_message_snippet="Yes please! Can you book me for Hydra-Glow with Ananya?",
            unread_count=0, ai_handling_state="RESOLVED",
        )
        db.add(thread_meera)
        await db.flush()

        m1 = Message(
            tenant_id=salon.id, salon_id=salon.id, thread_id=thread_meera.id, customer_id=c2.id,
            direction=MessageDirection.OUTBOUND, message_type=MessageType.TEMPLATE,
            status=MessageDeliveryStatus.READ,
            body="Hi Meera, it's been about 4 weeks since your last visit to Luxe Aura. Time for a refresh! Reply here to claim your VIP priority slot this week.",
            sent_at=now - timedelta(days=4), delivered_at=now - timedelta(days=4), read_at=now - timedelta(days=4),
        )
        m2 = Message(
            tenant_id=salon.id, salon_id=salon.id, thread_id=thread_meera.id, customer_id=c2.id,
            direction=MessageDirection.INBOUND, message_type=MessageType.TEXT,
            status=MessageDeliveryStatus.DELIVERED,
            body="Yes please! Can you book me for Hydra-Glow with Ananya for day after tomorrow 3pm?",
            delivered_at=now - timedelta(days=4, hours=-1),
        )
        m3 = Message(
            tenant_id=salon.id, salon_id=salon.id, thread_id=thread_meera.id, customer_id=c2.id,
            direction=MessageDirection.OUTBOUND, message_type=MessageType.TEXT,
            status=MessageDeliveryStatus.READ,
            body="Done Meera! Your Hydra-Glow with Ananya is locked in for Thursday at 3:00 PM. See you soon! ✨",
            sent_at=now - timedelta(days=3), delivered_at=now - timedelta(days=3), read_at=now - timedelta(days=3),
        )
        db.add_all([m1, m2, m3])

        # AI Interaction for Meera's inbound message
        db.add(AIInteraction(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c2.id, message_id=m2.id,
            interaction_type="INTENT_AND_DRAFT",
            input_text=m2.body,
            extracted_intent="BOOKING_REQUEST",
            extracted_entities={"service_names": ["Hydra-Glow Collagen Radiance Facial"], "staff_name": "Ananya Sen", "requested_time": "3:00 PM"},
            generated_reply="Hello Meera! We have booked your Hydra-Glow Facial with Ananya for Thursday at 3:00 PM.",
            confidence_score=0.96, requires_human_review=False, is_approved_by_owner=True, applied_in_reply=True,
        ))

        # Thread for Dia (No-Show follow-up)
        thread_dia = MessageThread(
            tenant_id=salon.id, salon_id=salon.id, customer_id=c3.id,
            last_message_at=now - timedelta(days=3, minutes=-30),
            last_message_snippet="Hi Dia, we missed you today for your Brazilian Keratin...",
            unread_count=0, ai_handling_state="AWAITING_OWNER_ACTION",
        )
        db.add(thread_dia)
        await db.flush()

        m_dia = Message(
            tenant_id=salon.id, salon_id=salon.id, thread_id=thread_dia.id, customer_id=c3.id,
            direction=MessageDirection.OUTBOUND, message_type=MessageType.TEMPLATE,
            status=MessageDeliveryStatus.DELIVERED,
            body="Hi Dia, we missed you today at Luxe Aura for your Brazilian Keratin! We know things come up — reply with a day & time that suits you better, and we'll save your spot.",
            sent_at=now - timedelta(days=3, minutes=-30), delivered_at=now - timedelta(days=3, minutes=-29),
        )
        db.add(m_dia)

        await db.commit()
        logger.info("Successfully seeded Luxe Aura Salon & Spa Mumbai with realistic test data!")


if __name__ == "__main__":
    asyncio.run(seed_data())
