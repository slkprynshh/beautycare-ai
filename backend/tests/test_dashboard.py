import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_dashboard_summary_endpoint(app_client: AsyncClient, seeded_test_data: dict):
    headers = seeded_test_data["headers"]

    resp = await app_client.get("/api/v1/dashboard/summary", headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]

    assert "today" in data
    assert "recovery" in data
    assert "upcoming_appointments" in data
    assert "recent_activity" in data
    assert "revenue_chart_7d" in data

    assert "total_appointments_today" in data["today"]
    assert "estimated_revenue_inr" in data["recovery"]
    assert len(data["revenue_chart_7d"]) == 7
