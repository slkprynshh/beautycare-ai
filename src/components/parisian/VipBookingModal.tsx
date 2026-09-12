'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  ChevronRight,
  Shield,
  Heart,
} from 'lucide-react';
import { Treatment, TREATMENTS } from './TreatmentMenu';

interface Specialist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  initials: string;
  avatarBg: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: 'elise',
    name: 'Elise Laurent',
    role: 'Senior Aesthetician',
    specialty: 'Skin Peptides & Glow',
    initials: 'EL',
    avatarBg: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'charlotte',
    name: 'Charlotte Dubois',
    role: 'Master Facialist',
    specialty: 'Cryo & Lymphatic Sculpt',
    initials: 'CD',
    avatarBg: 'bg-rose-100 text-rose-900',
  },
  {
    id: 'mathieu',
    name: 'Mathieu Moreau',
    role: 'Wellness Specialist',
    specialty: 'Deep Tissue & Hot Stone',
    initials: 'MM',
    avatarBg: 'bg-stone-200 text-stone-900',
  },
  {
    id: 'camille',
    name: 'Camille Vane',
    role: 'Haute Coiffeuse',
    specialty: 'French Balayage & Gloss',
    initials: 'CV',
    avatarBg: 'bg-amber-50 text-amber-800',
  },
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

// 7 upcoming dates
const getUpcomingDates = () => {
  const dates = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : days[d.getDay()],
      dayNum: d.getDate(),
      month: months[d.getMonth()],
    });
  }
  return dates;
};

interface VipBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTreatment?: Treatment | null;
  currency: 'EUR' | 'INR' | 'USD';
}

export function VipBookingModal({
  isOpen,
  onClose,
  initialTreatment,
  currency,
}: VipBookingModalProps) {
  const dates = getUpcomingDates();

  const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(
    initialTreatment || TREATMENTS[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>(dates[0].dateStr);
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(SPECIALISTS[0]);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestNotes, setGuestNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  // Update selected treatment if initialTreatment changes
  React.useEffect(() => {
    if (initialTreatment) {
      setSelectedTreatment(initialTreatment);
    }
  }, [initialTreatment]);

  if (!isOpen) return null;

  const formatPrice = (treatment: Treatment) => {
    switch (currency) {
      case 'EUR':
        return `€${treatment.priceEUR}`;
      case 'INR':
        return `₹${treatment.priceINR.toLocaleString('en-IN')}`;
      case 'USD':
        return `$${treatment.priceUSD}`;
      default:
        return `€${treatment.priceEUR}`;
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `PARIS-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-muted/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gold-surface border border-gold-border text-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-medium text-foreground">
                VIP Concierge Reservation
              </h3>
              <p className="text-[11px] text-muted-foreground uppercase font-label tracking-wider">
                Maison Fleurie • Paris
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-gold-surface border border-gold text-gold flex items-center justify-center shadow-gold-glow">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-surface-muted border border-border text-xs font-mono font-bold text-foreground">
                  Ref: {bookingRef}
                </div>
                <h4 className="text-2xl font-serif text-foreground">
                  Votre Réservation est Confirmée
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  We look forward to welcoming you, <span className="font-semibold text-foreground">{guestName || 'Cher VIP'}</span>. A confirmation & WhatsApp calendar invitation has been generated.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="rounded-2xl border border-gold-border bg-gold-surface/40 p-5 text-left space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gold-border/60">
                  <span className="text-xs uppercase font-label tracking-wider text-gold-hover font-semibold">
                    Treatment
                  </span>
                  <span className="font-serif font-medium text-foreground text-sm">
                    {selectedTreatment.title}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Date & Time</span>
                    <span className="font-semibold text-foreground">
                      {selectedDate} • {selectedTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Specialist</span>
                    <span className="font-semibold text-foreground">
                      {selectedSpecialist.name}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gold-border/60 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground text-[11px]">
                    34 Rue du Faubourg Saint-Honoré, 75008 Paris
                  </span>
                </div>
              </div>

              {/* WhatsApp Notification Simulator Box */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left">
                <div className="p-2 rounded-full bg-emerald-500 text-white shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    WhatsApp VIP Reminder Dispatched
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Deterministic 24-hr concierge reminder active with instant 1-tap reschedule.
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase shadow-md hover:bg-primary-hover transition-all"
              >
                Back to Maison Experience
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              {/* Step 1: Selected Treatment Overview */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-label tracking-widest text-muted-foreground block">
                  1. Selected Treatment
                </label>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-muted border border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border">
                      <Image
                        src={selectedTreatment.image}
                        alt={selectedTreatment.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-serif font-medium text-foreground truncate">
                        {selectedTreatment.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {selectedTreatment.durationMinutes} mins • {formatPrice(selectedTreatment)}
                      </p>
                    </div>
                  </div>

                  <select
                    value={selectedTreatment.id}
                    onChange={(e) => {
                      const found = TREATMENTS.find((t) => t.id === e.target.value);
                      if (found) setSelectedTreatment(found);
                    }}
                    aria-label="Change Selected Treatment"
                    className="text-xs font-medium bg-surface border border-border rounded-lg px-2 py-1.5 text-foreground cursor-pointer focus:outline-none focus:border-gold"
                  >
                    {TREATMENTS.map((t) => (
                      <option key={t.id} value={t.id}>
                        Change...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Date & Time Selector (Minimalist Horizontal Strip) */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-label tracking-widest text-muted-foreground block">
                  2. Select Date & Hour
                </label>

                {/* Horizontal Date Picker */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {dates.map((d) => {
                    const isSelected = selectedDate === d.dateStr;
                    return (
                      <button
                        type="button"
                        key={d.dateStr}
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-champagne-gold text-charcoal border-transparent shadow-gold-glow font-bold'
                            : 'bg-surface border-border text-foreground hover:border-gold-border'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-label tracking-wider opacity-80">
                          {d.dayName}
                        </span>
                        <span className="text-base font-serif font-bold my-0.5">
                          {d.dayNum}
                        </span>
                        <span className="text-[9px] opacity-75">{d.month}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                            : 'bg-surface-muted text-muted-foreground hover:text-foreground border border-border'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Choose Your Therapist */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-label tracking-widest text-muted-foreground block">
                  3. Choose Your Specialist
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SPECIALISTS.map((s) => {
                    const isSelected = selectedSpecialist.id === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSelectedSpecialist(s)}
                        className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-gold-surface border-gold text-foreground shadow-sm ring-2 ring-gold/40'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-serif font-bold text-xs mb-1.5 shadow-sm ${s.avatarBg} ${
                            isSelected ? 'ring-2 ring-gold ring-offset-2' : ''
                          }`}
                        >
                          {s.initials}
                        </div>
                        <span className="text-xs font-semibold text-foreground truncate w-full">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate w-full">
                          {s.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="text-xs uppercase font-label tracking-widest text-muted-foreground block">
                  4. Guest Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Full Name (e.g. Juliette Dupont)"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Mobile (+33 / +91 / +1)"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Special Concierge Notes (Optional: tea preferences, allergies)"
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                />
              </div>

              {/* Frictionless Gold Pill CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="shimmer-effect w-full py-4 rounded-full bg-champagne-gold bg-champagne-gold-hover text-charcoal font-bold text-xs uppercase tracking-widest shadow-gold-glow transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-charcoal" />
                  <span>Confirm VIP Reservation</span>
                </button>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  No advance payment required. Complimentary cancellation up to 4 hours prior.
                </p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
