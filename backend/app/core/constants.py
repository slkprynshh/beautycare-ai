import enum
from typing import Set, Dict


class PlatformRole(str, enum.Enum):
    USER = "USER"
    SUPPORT_ADMIN = "SUPPORT_ADMIN"


class SalonRole(str, enum.Enum):
    OWNER = "OWNER"
    MANAGER = "MANAGER"
    RECEPTIONIST = "RECEPTIONIST"
    STAFF = "STAFF"


UserRole = SalonRole


class StaffRole(str, enum.Enum):
    CREATIVE_DIRECTOR = "CREATIVE_DIRECTOR"
    SENIOR_STYLIST = "SENIOR_STYLIST"
    STYLIST = "STYLIST"
    JUNIOR_STYLIST = "JUNIOR_STYLIST"
    COLORIST = "COLORIST"
    ESTHETICIAN = "ESTHETICIAN"
    NAIL_TECHNICIAN = "NAIL_TECHNICIAN"
    MASSAGE_THERAPIST = "MASSAGE_THERAPIST"


class Permission(str, enum.Enum):
    MANAGE_SALON = "manage_salon"
    MANAGE_BILLING = "manage_billing"
    MANAGE_STAFF = "manage_staff"
    MANAGE_SERVICES = "manage_services"
    MANAGE_CUSTOMERS = "manage_customers"
    EXPORT_CUSTOMERS = "export_customers"
    MANAGE_APPOINTMENTS = "manage_appointments"
    VIEW_ALL_APPOINTMENTS = "view_all_appointments"
    VIEW_OWN_APPOINTMENTS = "view_own_appointments"
    MANAGE_MESSAGES = "manage_messages"
    MANAGE_AUTOMATIONS = "manage_automations"
    VIEW_RECOVERY_ANALYTICS = "view_recovery_analytics"
    APPROVE_AI_MESSAGES = "approve_ai_messages"


ROLE_PERMISSIONS: Dict[SalonRole, Set[Permission]] = {
    SalonRole.OWNER: {
        Permission.MANAGE_SALON,
        Permission.MANAGE_BILLING,
        Permission.MANAGE_STAFF,
        Permission.MANAGE_SERVICES,
        Permission.MANAGE_CUSTOMERS,
        Permission.EXPORT_CUSTOMERS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.VIEW_ALL_APPOINTMENTS,
        Permission.MANAGE_MESSAGES,
        Permission.MANAGE_AUTOMATIONS,
        Permission.VIEW_RECOVERY_ANALYTICS,
        Permission.APPROVE_AI_MESSAGES,
    },
    SalonRole.MANAGER: {
        Permission.MANAGE_STAFF,
        Permission.MANAGE_SERVICES,
        Permission.MANAGE_CUSTOMERS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.VIEW_ALL_APPOINTMENTS,
        Permission.MANAGE_MESSAGES,
        Permission.VIEW_RECOVERY_ANALYTICS,
        Permission.APPROVE_AI_MESSAGES,
    },
    SalonRole.RECEPTIONIST: {
        Permission.MANAGE_CUSTOMERS,
        Permission.MANAGE_APPOINTMENTS,
        Permission.VIEW_ALL_APPOINTMENTS,
        Permission.MANAGE_MESSAGES,
    },
    SalonRole.STAFF: {
        Permission.VIEW_OWN_APPOINTMENTS,
    },
}


class CustomerLifecycleStage(str, enum.Enum):
    NEW = "NEW"
    ACTIVE = "ACTIVE"
    DUE_FOR_RETURN = "DUE_FOR_RETURN"
    OVERDUE_LAPSED = "OVERDUE_LAPSED"
    CHURNED_RISK = "CHURNED_RISK"


CustomerStatus = CustomerLifecycleStage


class AppointmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    IN_SERVICE = "IN_SERVICE"
    CHECKED_IN = "CHECKED_IN"
    COMPLETED = "COMPLETED"
    NO_SHOW = "NO_SHOW"
    CANCELLED = "CANCELLED"
    RESCHEDULE_REQUESTED = "RESCHEDULE_REQUESTED"
    RESCHEDULED = "RESCHEDULED"


class BookingSource(str, enum.Enum):
    MANUAL = "MANUAL"
    WALK_IN = "WALK_IN"
    DASHBOARD_WALKIN = "DASHBOARD_WALKIN"
    WHATSAPP = "WHATSAPP"
    WHATSAPP_NUDGE = "WHATSAPP_NUDGE"
    AUTOMATION = "AUTOMATION"
    AI_ASSISTED = "AI_ASSISTED"
    IMPORTED = "IMPORTED"


class MessageDirection(str, enum.Enum):
    INBOUND = "INBOUND"
    OUTBOUND = "OUTBOUND"


class MessageType(str, enum.Enum):
    TEXT = "TEXT"
    TEMPLATE = "TEMPLATE"
    INTERACTIVE = "INTERACTIVE"
    BUTTON_REPLY = "BUTTON_REPLY"
    IMAGE = "IMAGE"
    DOCUMENT = "DOCUMENT"
    SYSTEM = "SYSTEM"


class MessageDeliveryStatus(str, enum.Enum):
    QUEUED = "QUEUED"
    SCHEDULED = "SCHEDULED"
    SENT = "SENT"
    DELIVERED = "DELIVERED"
    READ = "READ"
    REPLIED = "REPLIED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    RECEIVED = "RECEIVED"


MessageStatus = MessageDeliveryStatus


class WhatsAppTemplateType(str, enum.Enum):
    APPOINTMENT_REMINDER_24H = "APPOINTMENT_REMINDER_24H"
    NO_SHOW_RESCHEDULE_PROMPT = "NO_SHOW_RESCHEDULE_PROMPT"
    SERVICE_INTERVAL_DUE_NUDGE = "SERVICE_INTERVAL_DUE_NUDGE"
    APPOINTMENT_CONFIRMATION = "APPOINTMENT_CONFIRMATION"
    CUSTOM = "CUSTOM"


class WhatsAppTemplateStatus(str, enum.Enum):
    APPROVED = "APPROVED"
    PENDING = "PENDING"
    REJECTED = "REJECTED"


class AutomationType(str, enum.Enum):
    PRE_APPOINTMENT_REMINDER = "PRE_APPOINTMENT_REMINDER"
    NO_SHOW_RESCHEDULE = "NO_SHOW_RESCHEDULE"
    SERVICE_INTERVAL_DUE = "SERVICE_INTERVAL_DUE"
    LAPSED_CLIENT_REENGAGEMENT = "LAPSED_CLIENT_REENGAGEMENT"
    APPOINTMENT_REMINDER = "APPOINTMENT_REMINDER"
    NO_SHOW_RECOVERY = "NO_SHOW_RECOVERY"
    DUE_FOR_SERVICE = "DUE_FOR_SERVICE"
    LAPSED_CUSTOMER = "LAPSED_CUSTOMER"


class AutomationRunStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    SKIPPED = "SKIPPED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class RecoveryTriggerReason(str, enum.Enum):
    NO_SHOW = "NO_SHOW"
    LAPSED_DUE = "LAPSED_DUE"
    MANUAL_FOLLOWUP = "MANUAL_FOLLOWUP"
    NO_SHOW_RECOVERY = "NO_SHOW_RECOVERY"
    DUE_FOR_SERVICE = "DUE_FOR_SERVICE"
    LAPSED_CUSTOMER = "LAPSED_CUSTOMER"


class RecoveryStatus(str, enum.Enum):
    TRIGGERED = "TRIGGERED"
    NUDGED = "NUDGED"
    REPLIED = "REPLIED"
    REBOOKED = "REBOOKED"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"
    CREATED = "CREATED"
    MESSAGE_SENT = "MESSAGE_SENT"
    CUSTOMER_REPLIED = "CUSTOMER_REPLIED"
    BOOKED = "BOOKED"
    CANCELLED = "CANCELLED"


class AIIntentType(str, enum.Enum):
    BOOKING_REQUEST = "BOOKING_REQUEST"
    RESCHEDULE_REQUEST = "RESCHEDULE_REQUEST"
    CANCEL_REQUEST = "CANCEL_REQUEST"
    INQUIRY_HOURS = "INQUIRY_HOURS"
    INQUIRY_PRICING = "INQUIRY_PRICING"
    COMPLAINT = "COMPLAINT"
    GENERAL_GREETING = "GENERAL_GREETING"
    UNKNOWN = "UNKNOWN"


class AuditActorType(str, enum.Enum):
    USER = "USER"
    SYSTEM = "SYSTEM"
    WEBHOOK = "WEBHOOK"
    AUTOMATION = "AUTOMATION"
    AI = "AI"
    SUPPORT_ADMIN = "SUPPORT_ADMIN"


# Default Indian Business Configurations
DEFAULT_TIMEZONE = "Asia/Kolkata"
DEFAULT_CURRENCY = "INR"
DEFAULT_ATTRIBUTION_WINDOW_DAYS = 7
DEFAULT_QUIET_HOURS_START = "21:30"
DEFAULT_QUIET_HOURS_END = "09:30"
PAISE_IN_RUPEE = 100
