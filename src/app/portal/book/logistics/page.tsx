'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Plane, Car, Thermometer, Flame, ShieldCheck, Check } from 'lucide-react';
import { useVipWizardStore } from '@/store/useVipWizardStore';

export default function Step4LogisticsPage() {
  const { logistics, updateLogistics } = useVipWizardStore();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
          Step 04 of 05 • Tarmac &amp; Suite Staging
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF9F6]">
          Tarmac Logistics &amp; Suite Ambiance Calibration
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
          Coordinate discreet airside chauffeur pickups from Milan private aviation terminals and pre-set your suite temperature and lighting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Airside Tarmac Logistics Box */}
        <div className="p-6 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/30 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Plane className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-lg text-[#FAF9F6]">Private Aviation &amp; Chauffeur</h3>
            </div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              Discreet Protocol
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-2">
                Airside Chauffeur Service
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateLogistics({ requiresTarmacChauffeur: true })}
                  className={`p-3.5 rounded-2xl border font-mono text-xs transition ${
                    logistics.requiresTarmacChauffeur
                      ? 'bg-[#181511] border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-[#141210] border-white/10 text-neutral-400'
                  }`}
                >
                  Maybach S-Class Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => updateLogistics({ requiresTarmacChauffeur: false })}
                  className={`p-3.5 rounded-2xl border font-mono text-xs transition ${
                    !logistics.requiresTarmacChauffeur
                      ? 'bg-[#181511] border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-[#141210] border-white/10 text-neutral-400'
                  }`}
                >
                  Direct Subterranean Gate
                </button>
              </div>
            </div>

            {logistics.requiresTarmacChauffeur && (
              <>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                    Terminal Arrival Hub
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateLogistics({ airportCode: 'LIN' })}
                      className={`p-3 rounded-xl border font-mono text-xs transition ${
                        logistics.airportCode === 'LIN'
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-[#141210] border-white/10 text-neutral-300'
                      }`}
                    >
                      LIN (Milan Linate FBO)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLogistics({ airportCode: 'MXP' })}
                      className={`p-3 rounded-xl border font-mono text-xs transition ${
                        logistics.airportCode === 'MXP'
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-[#141210] border-white/10 text-neutral-300'
                      }`}
                    >
                      MXP (Malpensa Prime)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                    Flight Tail Number (For Ramp Clearance)
                  </label>
                  <input
                    type="text"
                    value={logistics.flightTailNumber}
                    onChange={(e) => updateLogistics({ flightTailNumber: e.target.value })}
                    placeholder="e.g. N784V / I-LUX8"
                    className="w-full bg-[#141210] border border-white/10 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs font-mono text-[#FAF9F6] focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Suite Environmental Calibration Box */}
        <div className="p-6 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/30 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Thermometer className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-lg text-[#FAF9F6]">Suite Ambiance Pre-Calibration</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">IoT Staging</span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-neutral-400">Target Suite Temperature</span>
                <span className="text-[#D4AF37] font-bold">{logistics.suiteTemperatureCelsius}°C</span>
              </div>
              <input
                type="range"
                min="18.0"
                max="24.0"
                step="0.5"
                value={logistics.suiteTemperatureCelsius}
                onChange={(e) =>
                  updateLogistics({ suiteTemperatureCelsius: parseFloat(e.target.value) })
                }
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>18.0°C (Crisp Cryo)</span>
                <span>21.0°C (Optimal)</span>
                <span>24.0°C (Warm Paraffin)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-2">
                Lighting Spectrum Preset
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateLogistics({ lightingPreset: 'candlelight_1800k' })}
                  className={`p-3.5 rounded-2xl border font-mono text-xs text-left transition ${
                    logistics.lightingPreset === 'candlelight_1800k'
                      ? 'bg-[#181511] border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-[#141210] border-white/10 text-neutral-400'
                  }`}
                >
                  <Flame className="w-4 h-4 mb-1 text-amber-500" />
                  <span>1800K Candlelight Amber</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateLogistics({ lightingPreset: 'palazzo_warm_2700k' })}
                  className={`p-3.5 rounded-2xl border font-mono text-xs text-left transition ${
                    logistics.lightingPreset === 'palazzo_warm_2700k'
                      ? 'bg-[#181511] border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-[#141210] border-white/10 text-neutral-400'
                  }`}
                >
                  <Thermometer className="w-4 h-4 mb-1 text-yellow-300" />
                  <span>2700K Warm Palazzo Glow</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <Link
          href="/portal/book/schedule"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#141210] border border-white/10 text-neutral-400 hover:text-white text-xs font-mono transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </Link>

        <Link
          href="/portal/book/authorization"
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition"
        >
          <span>Final Authorization</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
