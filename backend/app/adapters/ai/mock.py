import re
from typing import Optional, Dict, Any, List
from app.adapters.ai.base import BaseAIAdapter, AIParseOutput
from app.core.constants import AIIntentType


class MockAIAdapter(BaseAIAdapter):
    """Deterministic, highly accurate regex & rule-based offline AI adapter for tests and local development."""

    async def parse_and_draft(
        self,
        customer_message: str,
        customer_name: Optional[str] = None,
        salon_name: Optional[str] = None,
        available_services: Optional[List[str]] = None,
        available_staff: Optional[List[str]] = None,
    ) -> AIParseOutput:
        msg_lower = customer_message.lower().strip()
        c_name = customer_name or "Guest"
        s_name = salon_name or "our salon"

        intent = AIIntentType.UNKNOWN
        confidence = 0.90
        requires_human_review = False
        entities: Dict[str, Any] = {
            "requested_date": None,
            "requested_time": None,
            "service_names": [],
            "staff_name": None,
            "cancellation_requested": False,
            "reschedule_requested": False,
        }

        # Date & Time extraction
        if "tomorrow" in msg_lower:
            entities["requested_date"] = "Tomorrow"
        elif "today" in msg_lower:
            entities["requested_date"] = "Today"
        elif "saturday" in msg_lower:
            entities["requested_date"] = "Saturday"
        elif "sunday" in msg_lower:
            entities["requested_date"] = "Sunday"
        elif "friday" in msg_lower:
            entities["requested_date"] = "Friday"

        time_match = re.search(r"(\d{1,2}(?::\d{2})?\s*(?:am|pm|pm\b|am\b|in the evening|in the morning))", msg_lower)
        if time_match:
            entities["requested_time"] = time_match.group(1).title()

        # Service extraction
        known_services = available_services or ["Haircut", "Facial", "Pedicure", "Manicure", "Keratin", "Root Touch Up", "Bridal Makeup", "Head Massage"]
        for s in known_services:
            if s.lower() in msg_lower:
                entities["service_names"].append(s)

        # Staff extraction
        known_staff = available_staff or ["Priya", "Rahul", "Ananya", "Vikram", "Sneha"]
        for st in known_staff:
            if st.lower() in msg_lower:
                entities["staff_name"] = st

        # Intent classification
        if any(w in msg_lower for w in ["reschedule", "shift", "postpone", "move appointment", "different time", "change time"]):
            intent = AIIntentType.RESCHEDULE_REQUEST
            entities["reschedule_requested"] = True
            time_str = f" for {entities['requested_time']}" if entities["requested_time"] else ""
            date_str = f" on {entities['requested_date']}" if entities["requested_date"] else ""
            suggested_reply = f"Hello {c_name}! We'd be happy to reschedule your appointment{date_str}{time_str}. Let me hold that slot for you right away."
        
        elif any(w in msg_lower for w in ["cancel", "can't make it", "cannot come", "wont be able"]):
            intent = AIIntentType.CANCEL_REQUEST
            entities["cancellation_requested"] = True
            requires_human_review = True
            suggested_reply = f"Hello {c_name}, we have noted your cancellation request. Would you prefer to reschedule for another day this week instead?"

        elif any(w in msg_lower for w in ["book", "appointment", "slot", "need a", "want a", "haircut", "facial", "pedicure"]):
            intent = AIIntentType.BOOKING_REQUEST
            svc = entities["service_names"][0] if entities["service_names"] else "your appointment"
            suggested_reply = f"Hello {c_name}! We have open slots available for {svc}. Would {entities['requested_time'] or '4:00 PM'} work well for you?"

        elif any(w in msg_lower for w in ["price", "cost", "how much", "rate", "charges", "rate card"]):
            intent = AIIntentType.INQUIRY_PRICING
            suggested_reply = f"Hello {c_name}! Our haircut starts from ₹800 and premium facials from ₹2,500. Which service would you like the details for?"

        elif any(w in msg_lower for w in ["open", "timing", "hours", "close", "working hours"]):
            intent = AIIntentType.INQUIRY_HOURS
            suggested_reply = f"Hello {c_name}! {s_name} is open from 10:00 AM to 8:00 PM Tuesday through Sunday. How can we assist you today?"

        elif any(w in msg_lower for w in ["bad", "complaint", "rude", "poor", "worst", "unhappy", "refund"]):
            intent = AIIntentType.COMPLAINT
            confidence = 0.95
            requires_human_review = True
            suggested_reply = f"Dear {c_name}, we are truly sorry to hear about your experience. Our salon manager is personally reviewing this and will contact you shortly."

        elif any(w in msg_lower for w in ["hi", "hello", "hey", "namaste", "good morning", "good evening"]):
            intent = AIIntentType.GENERAL_GREETING
            suggested_reply = f"Hello {c_name}! Welcome to {s_name}. How may we pamper you today?"

        else:
            intent = AIIntentType.UNKNOWN
            confidence = 0.50
            requires_human_review = True
            suggested_reply = f"Hello {c_name}! Thank you for your message. Our team at {s_name} is checking on this and will assist you in just a moment."

        return AIParseOutput(
            intent=intent,
            confidence=confidence,
            entities=entities,
            suggested_reply=suggested_reply,
            requires_human_review=requires_human_review,
            model_name="mock-rule-engine",
            latency_ms=5,
        )
