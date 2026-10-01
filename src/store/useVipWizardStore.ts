import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TreatmentAddon {
  id: string;
  name: string;
  category: 'bio_peptide' | 'gold_infusion' | 'hyperbaric' | 'botanical';
  dosage: string;
  priceEUR: number;
}

export interface VipBookingState {
  // Step 0: Principal Delegation
  principal: {
    pseudonym: string;
    accountCode: string;
    discretionLevel: 'STANDARD' | 'STRICT_NDA' | 'SOVEREIGN';
  };
  setPrincipal: (p: VipBookingState['principal']) => void;

  // Step 1: Core Ceremony
  selectedTreatmentId: string | null;
  selectedTreatmentTitle: string | null;
  basePriceEUR: number;
  durationMinutes: number;
  setTreatment: (id: string, title: string, price: number, duration: number) => void;

  // Step 2: Bespoke Add-ons
  selectedAddons: TreatmentAddon[];
  toggleAddon: (addon: TreatmentAddon) => void;

  // Step 3: Master Artisan & Suite Timing
  selectedArtisanId: string | null;
  selectedArtisanName: string | null;
  assignedSuite: string;
  bookingDate: string | null; // ISO YYYY-MM-DD
  bookingSlot: string | null; // "14:00 - 15:30"
  setSchedule: (artisanId: string, artisanName: string, suite: string, date: string, slot: string) => void;

  // Step 4: Tarmac & Ground Logistics
  logistics: {
    requiresTarmacChauffeur: boolean;
    airportCode: 'LIN' | 'MXP' | null;
    flightTailNumber: string;
    suiteTemperatureCelsius: number;
    lightingPreset: 'candlelight_1800k' | 'palazzo_warm_2700k';
  };
  updateLogistics: (patch: Partial<VipBookingState['logistics']>) => void;

  // Computed Totals & Reset
  getTotalPriceEUR: () => number;
  resetWizard: () => void;
}

export const useVipWizardStore = create<VipBookingState>()(
  persist(
    (set, get) => ({
      principal: {
        pseudonym: 'AURUM-09',
        accountCode: 'FO-MIL-8841',
        discretionLevel: 'STRICT_NDA',
      },
      setPrincipal: (principal) => set({ principal }),

      selectedTreatmentId: 'signature-24k-facial',
      selectedTreatmentTitle: 'The Signature 24k Gold Bio-Peptide Facial',
      basePriceEUR: 280,
      durationMinutes: 90,
      setTreatment: (id, title, price, duration) =>
        set({
          selectedTreatmentId: id,
          selectedTreatmentTitle: title,
          basePriceEUR: price,
          durationMinutes: duration,
        }),

      selectedAddons: [
        {
          id: 'addon-peptide-32',
          name: 'Colloidal Bio-Peptide 32 Matrix',
          category: 'bio_peptide',
          dosage: '1.5ml Compounded',
          priceEUR: 85,
        },
      ],
      toggleAddon: (addon) =>
        set((state) => {
          const exists = state.selectedAddons.some((a) => a.id === addon.id);
          return {
            selectedAddons: exists
              ? state.selectedAddons.filter((a) => a.id !== addon.id)
              : [...state.selectedAddons, addon],
          };
        }),

      selectedArtisanId: 'artisan-elena-russo',
      selectedArtisanName: 'Elena Russo (Master Biologist)',
      assignedSuite: 'Carrara Marble Suite I',
      bookingDate: '2026-10-15',
      bookingSlot: '14:00 - 15:30',
      setSchedule: (artisanId, artisanName, suite, date, slot) =>
        set({
          selectedArtisanId: artisanId,
          selectedArtisanName: artisanName,
          assignedSuite: suite,
          bookingDate: date,
          bookingSlot: slot,
        }),

      logistics: {
        requiresTarmacChauffeur: true,
        airportCode: 'LIN',
        flightTailNumber: 'N784V',
        suiteTemperatureCelsius: 21.5,
        lightingPreset: 'candlelight_1800k',
      },
      updateLogistics: (patch) =>
        set((state) => ({ logistics: { ...state.logistics, ...patch } })),

      getTotalPriceEUR: () => {
        const state = get();
        const addonsTotal = state.selectedAddons.reduce((sum, a) => sum + a.priceEUR, 0);
        return state.basePriceEUR + addonsTotal;
      },

      resetWizard: () =>
        set({
          selectedTreatmentId: null,
          selectedTreatmentTitle: null,
          basePriceEUR: 0,
          durationMinutes: 0,
          selectedAddons: [],
          bookingDate: null,
          bookingSlot: null,
        }),
    }),
    {
      name: 'aura_vip_wizard_vault',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
