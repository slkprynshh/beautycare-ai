import { create } from 'zustand';
import {
  Customer,
  Appointment,
  Service,
  Staff,
  RecoveryEvent,
  MessageItem,
  NotificationItem,
  SalonProfile,
  AppointmentStatus,
  WhatsAppStatus,
} from '@/types';
import {
  mockSalonProfile,
  mockStaff,
  mockServices,
  mockCustomers,
  mockAppointments,
  mockRecoveryEvents,
  mockMessages,
  mockNotifications,
} from '@/lib/mockData';

interface VertOpsState {
  // Theme & App State
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Domain Data
  salonProfile: SalonProfile;
  staff: Staff[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
  recoveryEvents: RecoveryEvent[];
  messages: MessageItem[];
  notifications: NotificationItem[];

  // Global Dialogs & Drawers
  isCommandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  isNewAppointmentOpen: boolean;
  setNewAppointmentOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;

  // Selected Detail Drawers
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (apt: Appointment | null) => void;
  selectedRecoveryEvent: RecoveryEvent | null;
  setSelectedRecoveryEvent: (event: RecoveryEvent | null) => void;

  // Date Range Filter
  activeDateRange: 'this_week' | 'this_month' | 'last_month' | 'custom';
  setActiveDateRange: (range: 'this_week' | 'this_month' | 'last_month' | 'custom') => void;

  // Mutations
  addAppointment: (appointment: Omit<Appointment, 'id' | 'whatsappStatus'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, startTime: string, endTime: string) => void;
  markNoShowAndTriggerRecovery: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'initials'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  sendWhatsAppMessage: (messageId: string, text: string) => void;
  sendManualNudgeToCustomer: (customerId: string, customText?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  addService: (service: Omit<Service, 'id' | 'bookingCount'>) => Service;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  addStaff: (staffMember: Omit<Staff, 'id' | 'appointmentsTodayCount' | 'initials'>) => Staff;
}

export const useStore = create<VertOpsState>((set, get) => ({
  theme: 'light',
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },
  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  salonProfile: mockSalonProfile,
  staff: mockStaff,
  services: mockServices,
  customers: mockCustomers,
  appointments: mockAppointments,
  recoveryEvents: mockRecoveryEvents,
  messages: mockMessages,
  notifications: mockNotifications,

  isCommandMenuOpen: false,
  setCommandMenuOpen: (open) => set({ isCommandMenuOpen: open }),
  isNewAppointmentOpen: false,
  setNewAppointmentOpen: (open) => set({ isNewAppointmentOpen: open }),
  isAssistantOpen: false,
  setAssistantOpen: (open) => set({ isAssistantOpen: open }),
  isNotificationDrawerOpen: false,
  setNotificationDrawerOpen: (open) => set({ isNotificationDrawerOpen: open }),

  selectedAppointment: null,
  setSelectedAppointment: (apt) => set({ selectedAppointment: apt }),
  selectedRecoveryEvent: null,
  setSelectedRecoveryEvent: (event) => set({ selectedRecoveryEvent: event }),

  activeDateRange: 'this_month',
  setActiveDateRange: (range) => set({ activeDateRange: range }),

  addAppointment: (newAptData) => {
    const id = `apt-${Date.now()}`;
    const newApt: Appointment = {
      ...newAptData,
      id,
      whatsappStatus: 'scheduled',
    };
    set((state) => ({
      appointments: [newApt, ...state.appointments],
    }));
    return newApt;
  },

  updateAppointmentStatus: (id, status) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      ),
      selectedAppointment:
        state.selectedAppointment?.id === id
          ? { ...state.selectedAppointment, status }
          : state.selectedAppointment,
    }));
  },

  rescheduleAppointment: (id, startTime, endTime) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id
          ? { ...apt, startTime, endTime, status: 'confirmed' as AppointmentStatus, whatsappStatus: 'sent' as WhatsAppStatus }
          : apt
      ),
      selectedAppointment:
        state.selectedAppointment?.id === id
          ? { ...state.selectedAppointment, startTime, endTime, status: 'confirmed' as AppointmentStatus }
          : state.selectedAppointment,
    }));
  },

  markNoShowAndTriggerRecovery: (id) => {
    const state = get();
    const targetApt = state.appointments.find((a) => a.id === id);
    if (!targetApt) return;

    // 1. Mark status as no-show
    const updatedAppointments = state.appointments.map((apt) =>
      apt.id === id ? { ...apt, status: 'no_show' as AppointmentStatus } : apt
    );

    // 2. Create recovery event
    const recoveryId = `rec-${Date.now()}`;
    const newRecoveryEvent: RecoveryEvent = {
      id: recoveryId,
      customerId: targetApt.customerId,
      customerName: targetApt.customerName,
      customerPhone: targetApt.customerPhone,
      source: 'no_show',
      messageSentAt: new Date().toISOString(),
      serviceName: targetApt.serviceName,
      serviceId: targetApt.serviceId,
      estimatedRevenue: targetApt.price,
      status: 'message_sent',
      isActual: false,
      messagePreview: `Hi ${targetApt.customerName.split(' ')[0]}, we missed you today for your ${targetApt.serviceName}. Click here to easily reschedule.`,
      daysLapsed: 0,
    };

    // 3. Create WhatsApp message entry
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      customerId: targetApt.customerId,
      customerName: targetApt.customerName,
      customerPhone: targetApt.customerPhone,
      customerInitials: targetApt.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2),
      type: 'no_show_recovery',
      body: `Hi ${targetApt.customerName.split(' ')[0]}, we missed you today for your ${targetApt.serviceName}. Click here to easily reschedule: https://luxeaura.in/reschedule/${recoveryId}`,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'sent',
      replyStatus: 'pending',
      needsReview: false,
      conversationHistory: [
        {
          id: `c-${Date.now()}`,
          sender: 'system',
          text: `Hi ${targetApt.customerName.split(' ')[0]}, we missed you today for your ${targetApt.serviceName}. Click here to easily reschedule: https://luxeaura.in/reschedule/${recoveryId}`,
          timestamp: new Date().toISOString(),
          status: 'sent',
        },
      ],
    };

    // 4. Create Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      iconType: 'recovery',
      title: `No-Show Recovery Triggered for ${targetApt.customerName}`,
      description: `Automated WhatsApp reschedule prompt dispatched for ${targetApt.serviceName} (₹${targetApt.price}).`,
      timestamp: new Date().toISOString(),
      read: false,
      actionLabel: 'View Recovery',
      actionUrl: '/recovery',
      relatedId: recoveryId,
    };

    set({
      appointments: updatedAppointments,
      recoveryEvents: [newRecoveryEvent, ...state.recoveryEvents],
      messages: [newMsg, ...state.messages],
      notifications: [newNotif, ...state.notifications],
      selectedAppointment:
        state.selectedAppointment?.id === id
          ? { ...state.selectedAppointment, status: 'no_show' }
          : state.selectedAppointment,
    });
  },

  addCustomer: (custData) => {
    const id = `cust-${Date.now()}`;
    const nameParts = custData.name.trim().split(/\s+/);
    const initials = nameParts.length === 1
      ? nameParts[0].slice(0, 2).toUpperCase()
      : (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();

    const newCustomer: Customer = {
      ...custData,
      id,
      initials,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      customers: [newCustomer, ...state.customers],
    }));
    return newCustomer;
  },

  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  sendWhatsAppMessage: (messageId, text) => {
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            needsReview: false,
            conversationHistory: [
              ...m.conversationHistory,
              {
                id: `c-${Date.now()}`,
                sender: 'salon',
                text,
                timestamp: new Date().toISOString(),
                status: 'delivered',
              },
            ],
          };
        }
        return m;
      }),
    }));
  },

  sendManualNudgeToCustomer: (customerId, customText) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    if (!customer) return;

    const bodyText = customText || `Hi ${customer.name.split(' ')[0]}, Priya and the team at Luxe Aura are checking in! You are due for your ${customer.preferredService}. Would you like to pick a time this week? ✨`;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerInitials: customer.initials,
      type: 'due_nudge',
      body: bodyText,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'sent',
      replyStatus: 'pending',
      needsReview: false,
      conversationHistory: [
        {
          id: `c-${Date.now()}`,
          sender: 'salon',
          text: bodyText,
          timestamp: new Date().toISOString(),
          status: 'sent',
        },
      ],
    };

    const newRecoveryEvent: RecoveryEvent = {
      id: `rec-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      source: 'due_nudge',
      messageSentAt: new Date().toISOString(),
      serviceName: customer.preferredService,
      serviceId: 'srv-1',
      estimatedRevenue: 1200,
      status: 'message_sent',
      isActual: false,
      messagePreview: bodyText,
      daysLapsed: 15,
    };

    set({
      messages: [newMsg, ...state.messages],
      recoveryEvents: [newRecoveryEvent, ...state.recoveryEvents],
    });
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  updateService: (id, updates) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  addService: (serviceData) => {
    const id = `srv-${Date.now()}`;
    const newService: Service = {
      ...serviceData,
      id,
      bookingCount: 0,
    };
    set((state) => ({
      services: [...state.services, newService],
    }));
    return newService;
  },

  updateStaff: (id, updates) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  addStaff: (staffData) => {
    const id = `staff-${Date.now()}`;
    const nameParts = staffData.name.trim().split(/\s+/);
    const initials = nameParts.length === 1
      ? nameParts[0].slice(0, 2).toUpperCase()
      : (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();

    const newStaff: Staff = {
      ...staffData,
      id,
      initials,
      appointmentsTodayCount: 0,
    };
    set((state) => ({
      staff: [...state.staff, newStaff],
    }));
    return newStaff;
  },
}));
