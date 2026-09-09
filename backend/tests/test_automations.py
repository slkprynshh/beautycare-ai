from datetime import datetime, timedelta, date
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import CustomerProfile
from app.models.service import Service
from app.models.appointment import Appointment, AppointmentService
from app.models.automation import AutomationRule
from app.core.constants import CustomerLifecycleStage, AppointmentStatus, BookingSource, AutomationType


@pytest.mark.asyncio
async def test_automation_engine_cycle(app_client: AsyncClient, seeded_test_data: dict, db_session: AsyncSession):
    salon = seeded_test_data["salon"]
    headers = seeded_test_data["headers"]

    # 1. Create Customer
    cust = CustomerProfile(
        tenant_id=salon.id,
        salon_id=salon.id,
        full_name="Kavita Iyer",
        phone="+919876543200",
        lifecycle_stage=CustomerLifecycleStage.ACTIVE,
        next_due_date=date.today() - timedelta(days=2),  # Due now
    )
    db_session.add(cust)

    # 2. Create Service
    svc = Service(
        tenant_id=salon.id,
        salon_id=salon.id,
        name="Keratin Treatment",
        duration_minutes=90,
        price_paise=600000,
    )
    db_session.add(svc)
    await db_session.flush()

    # 3. Create Automation Rule for Service Due
    rule_due = AutomationRule(
        tenant_id=salon.id,
        salon_id=salon.id,
        name="Service Due Nudge Rule",
        automation_type=AutomationType.SERVICE_INTERVAL_DUE,
        is_active=True,
        respect_quiet_hours=False,  # Bypass for testing
        cooldown_days=7,
    )
    db_session.add(rule_due)

    # 4. Create Past Appointment that became No-Show
    past_appt = Appointment(
        tenant_id=salon.id,
        salon_id=salon.id,
        customer_id=cust.id,
        starts_at=datetime.utcnow() - timedelta(hours=2),
        ends_at=datetime.utcnow() - timedelta(hours=1),
        duration_minutes=60,
        status=AppointmentStatus.CONFIRMED,  # Still confirmed 2 hours later -> Should become NO_SHOW
        total_price_paise=600000,
    )
    db_session.add(past_appt)
    await db_session.flush()

    db_session.add(AppointmentService(
        tenant_id=salon.id,
        salon_id=salon.id,
        appointment_id=past_appt.id,
        service_id=svc.id,
        service_name="Keratin Treatment",
        price_paise=600000,
    ))

    rule_noshow = AutomationRule(
        tenant_id=salon.id,
        salon_id=salon.id,
        name="No Show Reschedule Prompt",
        automation_type=AutomationType.NO_SHOW_RESCHEDULE,
        is_active=True,
        respect_quiet_hours=False,
    )
    db_session.add(rule_noshow)
    await db_session.commit()

    # 5. Run automation engine via API
    run_resp = await app_client.post("/api/v1/automations/run-now", headers=headers)
    assert run_resp.status_code == 200
    res_data = run_resp.json()["data"]
    assert res_data["no_shows_processed"] >= 1
    assert res_data["due_nudges_sent"] >= 1
