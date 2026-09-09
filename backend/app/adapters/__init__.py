from app.core.config import settings
from app.adapters.whatsapp.base import BaseWhatsAppAdapter
from app.adapters.whatsapp.meta_cloud import MetaWhatsAppCloudAdapter
from app.adapters.whatsapp.mock import MockWhatsAppAdapter
from app.adapters.ai.base import BaseAIAdapter
from app.adapters.ai.openai_provider import OpenAIAdapter
from app.adapters.ai.mock import MockAIAdapter


def get_whatsapp_adapter(is_mock: bool = False) -> BaseWhatsAppAdapter:
    if is_mock or settings.WHATSAPP_IS_MOCK or not settings.WHATSAPP_ACCESS_TOKEN:
        return MockWhatsAppAdapter()
    return MetaWhatsAppCloudAdapter()


def get_ai_adapter(is_mock: bool = False) -> BaseAIAdapter:
    if is_mock or settings.OPENAI_IS_MOCK or not settings.OPENAI_API_KEY:
        return MockAIAdapter()
    return OpenAIAdapter()


__all__ = [
    "BaseWhatsAppAdapter",
    "MetaWhatsAppCloudAdapter",
    "MockWhatsAppAdapter",
    "BaseAIAdapter",
    "OpenAIAdapter",
    "MockAIAdapter",
    "get_whatsapp_adapter",
    "get_ai_adapter",
]
