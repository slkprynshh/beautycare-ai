from datetime import date, datetime
from typing import Optional, List, Dict, Any
from app.schemas.common import BaseSchema
from app.schemas.recovery import RecoveryMetricsResponse
from app.schemas.appointment import AppointmentResponse


class ActivityFeedItem(BaseSchema):
    id: str
    type: str  # RECOVERY_NUDGE, NO_SHOW_DETECTED, APPOINTMENT_BOOKED, MESSAGE_RECEIVED, RECOVERY_CONFIRMED
    title: str
    description: str
    timestamp: datetime
    customer_name: Optional[str] = None
    amount_inr: Optional[float] = None
    badge_color: Optional[str] = None


class RevenueRecoveryCard(BaseSchema):
    estimated_revenue_inr: float = 0.0
    booked_revenue_inr: float = 0.0
    confirmed_revenue_inr: float = 0.0
    active_recovery_count: int = 0
    recovery_rate_percentage: float = 0.0


class TodayOverview(BaseSchema):
    total_appointments_today: int = 0
    confirmed_count: int = 0
    in_service_count: int = 0
    completed_count: int = 0
    no_show_count: int = 0
    today_revenue_inr: float = 0.0


class ChartDataPoint(BaseSchema):
    date: str
    recovered_inr: float = 0.0
    direct_inr: float = 0.0
    no_shows_count: int = 0
    recovered_count: int = 0


class DashboardSummaryResponse(BaseSchema):
    today: TodayOverview
    recovery: RevenueRecoveryCard
    upcoming_appointments: List[AppointmentResponse] = []
    recent_activity: List[ActivityFeedItem] = []
    revenue_chart_7d: List[ChartDataPoint] = []
