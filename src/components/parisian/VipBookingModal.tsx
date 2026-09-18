'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Car,
  Plane,
  MapPin,
} from 'lucide-react';
import { Treatment, TREATMENTS, LuxuryCurrency } from './TreatmentMenu';

export type LogisticsOption = 'none' | 'chauffeur' | 'tarmac';

export const LOGISTICS_PRICES: Record<
  LogisticsOption,
  { EUR: number; USD: number; GBP: number; AED: number; INR: number; label: string }
> = {
  none: {
    EUR: 0,
    USD: 0,
    GBP: 0,
    AED: 0,
    INR: 0,
    label: 'Independent Arrival (Private Valet on Via Monte Napoleone)',
  },
  chauffeur: {
    EUR: 180,
    USD: 195,
    GBP: 155,
    AED: 720,
    INR: 16000,
    label: 'Mercedes-Maybach S-Class Door-to-Door Chauffeur',
  },
  tarmac: {
    EUR: 380,
    USD: 410,
    GBP: 325,
    AED: 1520,
    INR: 34000,
    label: 'Private Jet Tarmac VIP Pick-Up (Linate / Malpensa Terminal)',
  },
};

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
    id: 'elena',
    name: 'Elena Russo',
    role: 'Master Aesthetician',
    specialty: 'Tuscan Botanicals & Peptides',
    initials: 'ER',
    avatarBg: 'bg-amber-100 text-amber-900',
  },
  {
    id: 'chiara',
    name: 'Chiara Belladonna',
    role: 'Senior Facialist',
    specialty: 'Roman Lymphatic & Cryo',
    initials: 'CB',
    avatarBg: 'bg-rose-100 text-rose-900',
  },
  {
    id: 'matteo',
    name: 'Matteo Romano',
    role: 'Wellness Specialist',
    specialty: 'Volcanic Basalt Hot Stone',
    initials: 'MR',
    avatarBg: 'bg-stone-200 text-stone-900',
  },
  {
    id: 'gianluigi',
    name: 'Gianluigi Moretti',
    role: 'Lead Hair Stylist',
    specialty: 'Milanese Balayage & Gloss',
    initials: 'GM',
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
  currency: LuxuryCurrency;
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
  const [selectedLogistics, setSelectedLogistics] = useState<LogisticsOption>('none');
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
      case 'USD':
        return `$${treatment.priceUSD}`;
      case 'INR':
        return `₹${treatment.priceINR.toLocaleString('en-IN')}`;
      case 'AED':
        return `AED ${treatment.priceAED.toLocaleString()}`;
      case 'GBP':
        return `£${treatment.priceGBP}`;
      default:
        return `€${treatment.priceEUR}`;
    }
  };

  const getLogisticsPriceFormatted = (opt: LogisticsOption) => {
    if (opt === 'none') return 'Included';
    const price = LOGISTICS_PRICES[opt][currency];
    switch (currency) {
      case 'EUR':
        return `+€${price}`;
      case 'USD':
        return `+$${price}`;
      case 'GBP':
        return `+£${price}`;
      case 'AED':
        return `+AED ${price.toLocaleString()}`;
      case 'INR':
        return `+₹${price.toLocaleString('en-IN')}`;
      default:
        return `+€${price}`;
    }
  };

  const getTotalPriceFormatted = () => {
    const baseEUR = selectedTreatment.priceEUR;
    const addEUR = LOGISTICS_PRICES[selectedLogistics].EUR;
    
    switch (currency) {
      case 'USD': {
        const total = selectedTreatment.priceUSD + LOGISTICS_PRICES[selectedLogistics].USD;
        return `$${total}`;
      }
      case 'GBP': {
        const total = selectedTreatment.priceGBP + LOGISTICS_PRICES[selectedLogistics].GBP;
        return `£${total}`;
      }
      case 'AED': {
        const total = selectedTreatment.priceAED + LOGISTICS_PRICES[selectedLogistics].AED;
        return `AED ${total.toLocaleString()}`;
      }
      case 'INR': {
        const total = selectedTreatment.priceINR + LOGISTICS_PRICES[selectedLogistics].INR;
        return `₹${total.toLocaleString('en-IN')}`;
      }
      default:
        return `€${baseEUR + addEUR}`;
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `MILAN-${Math.floor(100000 + Math.random() * 900000)}`;
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
                Villa Belladonna • Milan
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
                  Your VIP Reservation is Confirmed
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  We look forward to welcoming you, <span className="font-semibold text-foreground">{guestName || 'Valued VIP Guest'}</span>. A confirmation & WhatsApp calendar invitation has been generated.
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
                  <span className="text-muted-foreground">Arrival Protocol:</span>
                  <span className="font-semibold text-gold text-[11px] truncate max-w-[280px]">
                    {LOGISTICS_PRICES[selectedLogistics].label}
                  </span>
                </div>

                <div className="pt-2 border-t border-gold-border/60 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold">Total Estimated Amount:</span>
                  <span className="font-serif font-bold text-foreground text-sm">
                    {getTotalPriceFormatted()}
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
                    WhatsApp VIP Reminder &amp; Logistics Brief Dispatched
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Deterministic 24-hr concierge reminder active with ground transport chauffeur coordinates.
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase shadow-md hover:bg-primary-hover transition-all cursor-pointer"
              >
                Back to Villa Experience
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
                  2. Select Date &amp; Hour
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
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
                        className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
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

              {/* Step 4: Palazzo Ground Logistics & Transfers (Chauffeur / Tarmac / Independent) */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-label tracking-widest text-muted-foreground block">
                    4. Palazzo Ground Logistics &amp; Transfers
                  </label>
                  <span className="text-[11px] font-mono text-gold font-semibold">
                    {selectedLogistics === 'none' ? 'Valet Included' : getLogisticsPriceFormatted(selectedLogistics)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  {/* Option 1: Independent Arrival */}
                  <button
                    type="button"
                    onClick={() => setSelectedLogistics('none')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedLogistics === 'none'
                        ? 'bg-gold-surface border-gold text-foreground shadow-sm ring-2 ring-gold/40'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-gold-border'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <MapPin className={`w-4 h-4 ${selectedLogistics === 'none' ? 'text-gold' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-label uppercase font-bold text-gold">Included</span>
                      </div>
                      <h5 className="text-xs font-serif font-bold text-foreground">Independent Arrival</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        Private subterranean valet on Via Monte Napoleone.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Milan Maybach Chauffeur */}
                  <button
                    type="button"
                    onClick={() => setSelectedLogistics('chauffeur')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedLogistics === 'chauffeur'
                        ? 'bg-gold-surface border-gold text-foreground shadow-sm ring-2 ring-gold/40'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-gold-border'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Car className={`w-4 h-4 ${selectedLogistics === 'chauffeur' ? 'text-gold' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-label uppercase font-bold text-gold">{getLogisticsPriceFormatted('chauffeur')}</span>
                      </div>
                      <h5 className="text-xs font-serif font-bold text-foreground">Milan Chauffeur</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        Mercedes-Maybach S-Class door-to-door in Milan.
                      </p>
                    </div>
                  </button>

                  {/* Option 3: Private Jet Tarmac Transfer */}
                  <button
                    type="button"
                    onClick={() => setSelectedLogistics('tarmac')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedLogistics === 'tarmac'
                        ? 'bg-gold-surface border-gold text-foreground shadow-sm ring-2 ring-gold/40'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-gold-border'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Plane className={`w-4 h-4 ${selectedLogistics === 'tarmac' ? 'text-gold' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-label uppercase font-bold text-gold">{getLogisticsPriceFormatted('tarmac')}</span>
                      </div>
                      <h5 className="text-xs font-serif font-bold text-foreground">Tarmac Transfer</h5>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        Airside VIP pick-up from Linate / Malpensa.
                      </p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Step 5: Guest Details */}
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="text-xs uppercase font-label tracking-widest text-muted-foreground block">
                  5. Guest Information &amp; Preferences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Full Name (e.g. Conte Alessandro Rossi)"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Mobile (+39 / +1 / +44 / +971)"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Special Concierge & Logistics Notes (e.g. flight number, beverage, suite preferences)"
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                />
              </div>

              {/* Frictionless Dark VIP CTA with Live Total Price */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-luxury-dark w-full py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Confirm VIP Reservation • {getTotalPriceFormatted()}</span>
                </button>
                <p className="text-[11px] text-center text-muted-foreground mt-2">
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
