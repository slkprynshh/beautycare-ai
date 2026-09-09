import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_request_otp(app_client: AsyncClient):
    response = await app_client.post(
        "/api/v1/auth/request-otp",
        json={"phone": "+919876543210"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["phone"] == "+919876543210"


@pytest.mark.asyncio
async def test_verify_otp_and_login(app_client: AsyncClient):
    # Request OTP first
    await app_client.post(
        "/api/v1/auth/request-otp",
        json={"phone": "+919820099887"},
    )

    # Verify with default OTP
    response = await app_client.post(
        "/api/v1/auth/verify-otp",
        json={"phone": "+919820099887", "otp": "123456"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["phone"] == "+919820099887"


@pytest.mark.asyncio
async def test_register_salon(app_client: AsyncClient):
    payload = {
        "full_name": "Karan Singhania",
        "phone": "+919833322110",
        "email": "karan@singhania.com",
        "password": "strongPassword123",
        "salon_name": "Aura Hair Studio",
        "city": "Bengaluru",
    }
    response = await app_client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["user"]["full_name"] == "Karan Singhania"
    assert len(data["data"]["user"]["salons"]) > 0
