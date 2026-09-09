export type CustomerStatus = 'active' | 'due_soon' | 'overdue' | 'lapsed' | 'high_value' | 'no_show_risk';

export type AppointmentStatus =
  | 'confirmed'
  | 'reminder_pending'
  | 'reminder_sent'
  | 'checked_in'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'reschedule_requested';

export type WhatsAppStatus =
  | 'not_sent'
  | 'scheduled'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'replied'
  | 'failed';

export type MessageType =
  | 'appointment_reminder'
  | 'no_show_recovery'
  | 'due_nudge'
  | 'confirmation'
  | 'manual';

export type RecoverySource =
  | 'no_show'
  | 'lapsed_customer'
  | 'due_nudge'
  | 'manual_followup';

export type RecoveryStatus =
  | 'message_sent'
  | 'replied'
  | 'appointment_booked'
  | 'visit_completed'
  | 'not_interested'
  | 'no_response';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  initials: string;
  tags: string[];
  lastVisit: string; // ISO date
  nextDueDate: string; // ISO date
  preferredService: string;
  preferredStaff: string;
  typicalReturnDays: number;
  totalVisits: number;
  totalSpend: number;
  status: CustomerStatus;
  notes: string;
  formulaNotes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  staffInitials: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  durationMinutes: number;
  status: AppointmentStatus;
  price: number;
  whatsappStatus: WhatsAppStatus;
  notes?: string;
  isWalkIn?: boolean;
  isRecovered?: boolean;
  recoveryEventId?: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Hair' | 'Face & Skin' | 'Hands & Feet' | 'Spa & Body' | 'Treatments';
  durationMinutes: number;
  price: number;
  typicalReturnDays: number;
  active: boolean;
  staffIds: string[];
  reminderCopyTemplate: string;
  bookingCount: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  color: string;
  serviceIds: string[];
  workingHours: {
    start: string; // "09:30"
    end: string; // "20:00"
    days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  };
  active: boolean;
  phone: string;
  appointmentsTodayCount: number;
}

export interface RecoveryEvent {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  source: RecoverySource;
  messageSentAt: string; // ISO datetime
  responseAt?: string; // ISO datetime
  appointmentId?: string;
  serviceName: string;
  serviceId: string;
  estimatedRevenue: number;
  actualRevenue?: number;
  status: RecoveryStatus;
  isActual: boolean;
  messagePreview: string;
  replyPreview?: string;
  daysLapsed?: number;
}

export interface MessageItem {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerInitials: string;
  type: MessageType;
  body: string;
  sentAt: string; // ISO datetime
  deliveryStatus: WhatsAppStatus;
  replyStatus?: 'replied' | 'pending' | 'no_reply';
  needsReview: boolean;
  aiExtractedIntent?: {
    intent: 'reschedule' | 'confirm' | 'cancel' | 'inquiry' | 'declined';
    extractedDate?: string;
    extractedTime?: string;
    extractedService?: string;
    confidence: number;
    summary: string;
  };
  suggestedReplies?: string[];
  conversationHistory: {
    id: string;
    sender: 'system' | 'customer' | 'salon';
    text: string;
    timestamp: string;
    status?: WhatsAppStatus;
  }[];
}

export interface NotificationItem {
  id: string;
  iconType: 'recovery' | 'appointment' | 'whatsapp' | 'alert' | 'billing';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  relatedId?: string;
}

export interface SalonProfile {
  name: string;
  tagline: string;
  city: string;
  address: string;
  phone: string;
  ownerName: string;
  ownerEmail: string;
  category: string;
  currency: string;
  language: string;
  whatsappProvider: 'Gupshup' | 'Interakt' | 'Twilio';
  whatsappPhoneNumber: string;
  whatsappConnected: boolean;
  webhookStatus: 'healthy' | 'degraded' | 'offline';
  reminderAdvanceHours: number;
  noShowFollowupMinutes: number;
  maxFollowupAttempts: number;
  quietHoursStart: string;
  quietHoursEnd: string;
}
