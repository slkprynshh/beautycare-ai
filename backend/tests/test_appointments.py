from datetime import datetime, timedelta
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import CustomerProfile
from app.models.service import Service
from app.models.staff import StaffProfile
from app.core.constants import CustomerLifecycleStage, StaffRole


@pytest.mark.asyncio
async def test_create_appointment_and_collision(app_client: AsyncClient, seeded_test_data: dict, db_session: AsyncSession):
    headers = seeded_test_data["headers"]
    salon = seeded_test_data["salon"]

    # 1. Create Customer
    cust = CustomerProfile(
        tenant_id=salon.id,
        salon_id=salon.id,
        full_name="Simran Kaur",
        phone="+919876543322",
        lifecycle_stage=CustomerLifecycleStage.NEW,
    )
    db_session.add(cust)

    # 2. Create Staff
    staff = StaffProfile(
        tenant_id=salon.id,
        salon_id=salon.id,
        full_name="Priya Stylist",
        phone="+919876543311",
        staff_role=StaffRole.SENIOR_STYLIST,
    )
    db_session.add(staff)

    # 3. Create Service
    svc = Service(
        tenant_id=salon.id,
        salon_id=salon.id,
        name="Luxury Hair Spa",
        duration_minutes=60,
        price_paise=250000,
    )
    db_session.add(svc)
    await db_session.commit()

    start_time = datetime.utcnow() + timedelta(days=1, hours=2)

    # 4. Book first appointment
    resp1 = await app_client.post(
        "/api/v1/appointments",
        json={
            "customer_id": cust.id,
            "primary_staff_id": staff.id,
            "starts_at": start_time.isoformat(),
            "services": [{"service_id": svc.id}],
        },
        headers=headers,
    )
    assert resp1.status_code == 200
    appt_data = resp1.json()["data"]
    assert appt_data["total_price_paise"] == 250000
    assert appt_data["total_price_inr"] == 2500.0

    # 5. Try to double-book same staff in overlapping window -> Should return 409 Conflict
    resp_conflict = await app_client.post(
        "/api/v1/appointments",
        json={
            "customer_name": "Another Guest",
            "customer_phone": "+919876543399",
            "primary_staff_id": staff.id,
            "starts_at": (start_time + timedelta(minutes=15)).isoformat(),
            "services": [{"service_id": svc.id}],
        },
        headers=headers,
    )
    assert resp_conflict.status_code == 409
