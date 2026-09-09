import time
import json
from typing import Optional, Dict, Any, List
import httpx

from app.adapters.ai.base import BaseAIAdapter, AIParseOutput
from app.core.config import settings
from app.core.constants import AIIntentType
from app.core.logging import logger


class OpenAIAdapter(BaseAIAdapter):
    """OpenAI GPT-4o-mini async client for parsing WhatsApp messages and drafting replies."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL

    async def parse_and_draft(
        self,
        customer_message: str,
        customer_name: Optional[str] = None,
        salon_name: Optional[str] = None,
        available_services: Optional[List[str]] = None,
        available_staff: Optional[List[str]] = None,
    ) -> AIParseOutput:
        start_t = time.time()
        c_name = customer_name or "Guest"
        s_name = salon_name or "the salon"
        services_str = ", ".join(available_services) if available_services else "Haircut, Facial, Pedicure, Manicure"
        staff_str = ", ".join(available_staff) if available_staff else "Priya, Rahul, Ananya"

        system_prompt = f"""You are VertOps AI Assistant for {s_name} in India.
Your job is to analyze incoming WhatsApp messages from clients (often in English, Hinglish, or informal style) and return structured JSON.

Available services: {services_str}
Available staff: {staff_str}

Respond STRICTLY with valid JSON having the following schema:
{{
  "intent": "<ONE_OF: BOOKING_REQUEST, RESCHEDULE_REQUEST, CANCEL_REQUEST, INQUIRY_HOURS, INQUIRY_PRICING, COMPLAINT, GENERAL_GREETING, UNKNOWN>",
  "confidence": <float between 0.0 and 1.0>,
  "entities": {{
    "requested_date": "<e.g. Tomorrow, Saturday, 2026-09-12 or null>",
    "requested_time": "<e.g. 4:00 PM, evening or null>",
    "service_names": ["<matched service names>"],
    "staff_name": "<matched staff or null>",
    "cancellation_requested": <boolean>,
    "reschedule_requested": <boolean>
  }},
  "suggested_reply": "<Polite, warm, concise 1-2 sentence WhatsApp draft addressing {c_name} with Indian salon hospitality>",
  "requires_human_review": <true if confidence < 0.85 or intent is COMPLAINT or CANCEL_REQUEST, else false>
}}"""

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Customer '{c_name}' says: \"{customer_message}\""},
            ],
            "temperature": 0.2,
        }

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                elapsed_ms = int((time.time() - start_t) * 1000)
                
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    
                    intent_str = parsed.get("intent", "UNKNOWN")
                    # Validate against AIIntentType
                    try:
                        intent_enum = AIIntentType(intent_str)
                    except ValueError:
                        intent_enum = AIIntentType.UNKNOWN

                    return AIParseOutput(
                        intent=intent_enum,
                        confidence=float(parsed.get("confidence", 0.8)),
                        entities=parsed.get("entities", {}),
                        suggested_reply=parsed.get("suggested_reply", f"Hello {c_name}, thank you for reaching out! We'd be happy to assist you."),
                        requires_human_review=parsed.get("requires_human_review", True),
                        model_name=self.model,
                        latency_ms=elapsed_ms,
                    )
                else:
                    logger.error("OpenAI API call failed", status_code=resp.status_code, body=resp.text)
                    from app.adapters.ai.mock import MockAIAdapter
                    fallback = MockAIAdapter()
                    return await fallback.parse_and_draft(customer_message, customer_name, salon_name, available_services, available_staff)
        except Exception as exc:
            logger.exception("OpenAI adapter exception, falling back to mock", exc_info=exc)
            from app.adapters.ai.mock import MockAIAdapter
            fallback = MockAIAdapter()
            return await fallback.parse_and_draft(customer_message, customer_name, salon_name, available_services, available_staff)
