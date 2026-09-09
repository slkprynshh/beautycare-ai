import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import CustomerProfile
from app.models.service import Service
from app.models.appointment import Appointment
from app.core.constants import CustomerLifecycleStage, AppointmentStatus, BookingSource


@pytest.mark.asyncio
async def test_recovery_lifecycle_and_metrics(app_client: AsyncClient, seeded_test_data: dict, db_session: AsyncSession):
    headers = seeded_test_data["headers"]
    salon = seeded_test_data["salon"]

    # 1. Create a customer
    cust = CustomerProfile(
        tenant_id=salon.id,
        salon_id=salon.id,
        full_name="Pooja Hegde",
        phone="+919876500001",
        lifecycle_stage=CustomerLifecycleStage.ACTIVE,
    )
    db_session.add(cust)

    # 2. Create a service
    svc = Service(
        tenant_id=salon.id,
        salon_id=salon.id,
        name="Signature Balayage",
        duration_minutes=90,
        price_paise=500000,  # ₹5,000
    )
    db_session.add(svc)
    await db_session.commit()

    # 3. Manually trigger recovery for customer
    trigger_resp = await app_client.post(
        "/api/v1/recovery/trigger",
        json={
            "customer_id": cust.id,
            "reason": "LAPSED_DUE",
            "custom_message": "Hi Pooja, we miss you! Book this week for 10% off.",
        },
        headers=headers,
    )
    assert trigger_resp.status_code == 200
    rec_data = trigger_resp.json()["data"]
    assert rec_data["status"] == "NUDGED"
    assert rec_data["estimated_revenue_paise"] == 150000

    # 4. Check Recovery Metrics endpoint
    metrics_resp = await app_client.get("/api/v1/recovery/metrics", headers=headers)
    assert metrics_resp.status_code == 200
    metrics = metrics_resp.json()["data"]
    assert metrics["total_triggered"] >= 1
    assert metrics["total_nudged"] >= 1
    assert metrics["estimated_revenue_inr"] > 0
