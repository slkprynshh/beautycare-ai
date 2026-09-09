import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_customer_crud_and_batch_import(app_client: AsyncClient, seeded_test_data: dict):
    headers = seeded_test_data["headers"]

    # 1. Create Customer
    create_resp = await app_client.post(
        "/api/v1/customers",
        json={
            "full_name": "Deepika Padukone",
            "phone": "+919876599999",
            "email": "deepika@padukone.com",
            "gender": "Female",
            "preferences": {
                "allergies": "Sensitive skin, ammonia-free only",
                "preferred_beverage": "Iced Lemon Water",
            },
        },
        headers=headers,
    )
    assert create_resp.status_code == 200
    cust_data = create_resp.json()["data"]
    cust_id = cust_data["id"]
    assert cust_data["full_name"] == "Deepika Padukone"
    assert cust_data["phone"] == "+919876599999"

    # 2. Get Customer Detail
    get_resp = await app_client.get(f"/api/v1/customers/{cust_id}", headers=headers)
    assert get_resp.status_code == 200
    detail = get_resp.json()["data"]
    assert detail["preferences"]["preferred_beverage"] == "Iced Lemon Water"

    # 3. Batch Import
    import_resp = await app_client.post(
        "/api/v1/customers/import",
        json={
            "customers": [
                {"full_name": "Ranveer Singh", "phone": "+919876511111", "email": "ranveer@singh.com", "notes": "VIP client"},
                {"full_name": "Alia Bhatt", "phone": "+919876522222", "email": "alia@bhatt.com", "notes": "Prefers evening slots"},
            ]
        },
        headers=headers,
    )
    assert import_resp.status_code == 200
    imp_data = import_resp.json()["data"]
    assert imp_data["imported_count"] == 2
    assert imp_data["failed_count"] == 0
