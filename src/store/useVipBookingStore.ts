// ============================================================================
// File: src/store/useVipBookingStore.ts
// Purpose: Atomic, Multi-Step State for Executive Assistant Booking Funnel
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PrincipalProfile {
  id: string;
  pseudonym: string;
  legalNameAlias: string;
  billingCode: string;
  discretionLevel: 'STANDARD' | 'STRICT_NDA' | 'SOVEREIGN';
}

export interface VipBookingState {
  // Step 0: Active Principal Delegation
  selectedPrincipal: PrincipalProfile;
  setSelectedPrincipal: (principal: PrincipalProfile) => void;

  // Step 1: Ceremony Selection
  selectedTreatmentId: string | null;
  setSelectedTreatmentId: (id: string | null) => void;

  // Step 2: Artisan & Schedule
  selectedArtisanId: string | null;
  setSelectedArtisanId: (id: string | null) => void;
  bookingDate: string | null; // ISO Date YYYY-MM-DD
  bookingTimeSlot: string | null; // e.g. "14:00 - 15:30"
  setSchedule: (date: string, slot: string) => void;

  // Step 3: Tarmac Logistics & Suite Ambience
  needsChauffeur: boolean;
  setNeedsChauffeur: (needed: boolean) => void;
  airportCode: 'LIN' | 'MXP' | 'BGY' | null;
  flightTailNumber: string;
  setLogistics: (airport: 'LIN' | 'MXP' | 'BGY' | null, tail: string) => void;
  suiteTemperature: number;
  lightingMode: 'candlelight_1800k' | 'warm_2700k' | 'clinical_4000k';
  setAmbience: (temp: number, lighting: 'candlelight_1800k' | 'warm_2700k' | 'clinical_4000k') => void;

  // Currency
  currency: 'EUR' | 'USD';
  setCurrency: (c: 'EUR' | 'USD') => void;

  // Actions
  resetBooking: () => void;
}

export const useVipBookingStore = create<VipBookingState>()(
  persist(
    (set) => ({
      selectedPrincipal: {
        id: 'p-01',
        pseudonym: 'AURUM-09',
        legalNameAlias: 'Lady H. (Sovereign)',
        billingCode: 'FO-MIL-8841',
        discretionLevel: 'STRICT_NDA',
      },
      setSelectedPrincipal: (principal) => set({ selectedPrincipal: principal }),

      selectedTreatmentId: 'signature-facial',
      setSelectedTreatmentId: (id) => set({ selectedTreatmentId: id }),

      selectedArtisanId: 'artisan-elena-russo',
      setSelectedArtisanId: (id) => set({ selectedArtisanId: id }),
      bookingDate: '2026-10-15',
      bookingTimeSlot: '14:00 - 15:30',
      setSchedule: (date, slot) => set({ bookingDate: date, bookingTimeSlot: slot }),

      needsChauffeur: true,
      setNeedsChauffeur: (needed) => set({ needsChauffeur: needed }),
      airportCode: 'LIN',
      flightTailNumber: 'N784V',
      setLogistics: (airport, tail) => set({ airportCode: airport, flightTailNumber: tail }),
      suiteTemperature: 21.5,
      lightingMode: 'candlelight_1800k',
      setAmbience: (temp, lighting) => set({ suiteTemperature: temp, lightingMode: lighting }),

      currency: 'EUR',
      setCurrency: (currency) => set({ currency }),

      resetBooking: () =>
        set({
          selectedTreatmentId: 'signature-facial',
          selectedArtisanId: 'artisan-elena-russo',
          bookingDate: null,
          bookingTimeSlot: null,
          needsChauffeur: false,
          airportCode: null,
          flightTailNumber: '',
        }),
    }),
    {
      name: 'aura_vip_booking_vault',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
