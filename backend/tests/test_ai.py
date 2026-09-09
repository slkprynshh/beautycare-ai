import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_ai_parse_message(app_client: AsyncClient, seeded_test_data: dict):
    headers = seeded_test_data["headers"]

    # Test booking request
    resp1 = await app_client.post(
        "/api/v1/ai/parse",
        json={"text": "Can I book a haircut for tomorrow at 4:00 pm?"},
        headers=headers,
    )
    assert resp1.status_code == 200
    data1 = resp1.json()["data"]
    assert data1["detected_intent"] in ["BOOKING_REQUEST", "RESCHEDULE_REQUEST"]
    assert "Haircut" in data1["entities"]["service_names"]
    assert data1["entities"]["requested_time"] == "4:00 Pm"
    assert data1["suggested_reply"] is not None

    # Test reschedule request
    resp2 = await app_client.post(
        "/api/v1/ai/parse",
        json={"text": "Please reschedule my appointment to Saturday 5pm"},
        headers=headers,
    )
    assert resp2.status_code == 200
    data2 = resp2.json()["data"]
    assert data2["detected_intent"] == "RESCHEDULE_REQUEST"
    assert data2["entities"]["reschedule_requested"] is True
