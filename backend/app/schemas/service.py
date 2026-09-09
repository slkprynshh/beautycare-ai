from typing import Optional, List
from pydantic import Field
from app.schemas.common import BaseSchema


class ServiceCategoryCreate(BaseSchema):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    display_order: int = 0
    icon_name: Optional[str] = None


class ServiceCategoryResponse(BaseSchema):
    id: str
    name: str
    description: Optional[str] = None
    display_order: int
    icon_name: Optional[str] = None


class ServiceCreate(BaseSchema):
    category_id: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None
    duration_minutes: int = Field(..., ge=5, le=480, description="Duration in minutes (e.g. 45)")
    buffer_minutes_after: int = Field(0, ge=0, le=120)
    price_paise: int = Field(..., ge=0, description="Price in paise (e.g. 150000 for ₹1,500)")
    typical_return_interval_days: int = Field(30, ge=1, le=365, description="Days before client is due for repeat service")
    is_active: bool = True
    display_order: int = 0


class ServiceUpdate(BaseSchema):
    category_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    buffer_minutes_after: Optional[int] = None
    price_paise: Optional[int] = None
    typical_return_interval_days: Optional[int] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class ServiceResponse(BaseSchema):
    id: str
    category_id: Optional[str] = None
    category: Optional[ServiceCategoryResponse] = None
    name: str
    description: Optional[str] = None
    duration_minutes: int
    buffer_minutes_after: int
    price_paise: int
    price_inr: float = Field(0.0, description="Formatted INR currency amount")
    typical_return_interval_days: int
    is_active: bool
    display_order: int

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        # Automatically calculate price_inr from price_paise
        res = super().model_validate(obj, *args, **kwargs)
        if hasattr(obj, "price_paise") and obj.price_paise is not None:
            res.price_inr = round(obj.price_paise / 100.0, 2)
        return res
