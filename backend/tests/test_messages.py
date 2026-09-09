import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.customer import CustomerProfile
from app.core.constants import CustomerLifecycleStage


@pytest.mark.asyncio
async def test_messages_and_webhooks(app_client: AsyncClient, seeded_test_data: dict, db_session: AsyncSession):
    salon = seeded_test_data["salon"]
    headers = seeded_test_data["headers"]

    # 1. Create a customer
    cust = CustomerProfile(
        tenant_id=salon.id,
        salon_id=salon.id,
        full_name="Vikramaditya Motwane",
        phone="+919876544444",
        lifecycle_stage=CustomerLifecycleStage.ACTIVE,
    )
    db_session.add(cust)
    await db_session.commit()

    # 2. Send an outbound WhatsApp text message
    send_resp = await app_client.post(
        "/api/v1/messages/send",
        json={
            "customer_id": cust.id,
            "body": "Hello Vikram, your appointment is confirmed for tomorrow 5pm!",
        },
        headers=headers,
    )
    assert send_resp.status_code == 200
    msg_data = send_resp.json()["data"]
    assert msg_data["status"] == "SENT"
    assert msg_data["direction"] == "OUTBOUND"

    # 3. Verify WhatsApp Webhook challenge
    verify_resp = await app_client.get(
        "/api/v1/webhooks/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "vertops_verify_secret",
            "hub.challenge": "1158201244",
        },
    )
    assert verify_resp.status_code == 200
    assert verify_resp.text == "1158201244"

    # 4. Ingest an Inbound WhatsApp Webhook payload
    webhook_payload = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "108923847291823",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {"phone_number_id": "108923847291823"},
                            "messages": [
                                {
                                    "from": "+919876544444",
                                    "id": "wamid.inbound.test.999",
                                    "type": "text",
                                    "text": {"body": "Thank you! See you at 5pm."},
                                }
                            ],
                        }
                    }
                ],
            }
        ],
    }
    hook_post = await app_client.post("/api/v1/webhooks/whatsapp", json=webhook_payload)
    assert hook_post.status_code == 200
