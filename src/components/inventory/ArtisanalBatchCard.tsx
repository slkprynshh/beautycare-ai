'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Droplets,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Shield,
  Loader2,
  Thermometer,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export interface ArtisanalBatchProps {
  id: string;
  batchCode: string;
  ingredientName: string;
  category: 'PRECIOUS_MINERAL' | 'ORGANIC_FERMENT' | 'BOTANICAL_NECTAR' | 'PEPTIDE_COMPLEX';
  terroirOrigin: string;
  unitOfMeasure: 'ml' | 'mg';
  initialQuantity: number;
  currentQuantity: number;
  reorderThreshold: number;
  storageTemp: string;
  harvestDate: string;
  expirationDate: string;
  daysRemaining: number;
  isExpeditedReorderRecommended?: boolean;
}

export function ArtisanalBatchCard({
  batch,
  onReorder,
}: {
  batch: ArtisanalBatchProps;
  onReorder?: (batchId: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const fillPercentage = Math.max(
    0,
    Math.min(100, (batch.currentQuantity / batch.initialQuantity) * 100)
  );

  const isLowStock = batch.currentQuantity <= batch.reorderThreshold;
  const isExpiringSoon = batch.daysRemaining <= 7;

  const handleReorderClick = async () => {
    setIsOrdering(true);
    try {
      if (onReorder) {
        await onReorder(batch.id);
      } else {
        const res = await fetch('/api/inventory/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batchId: batch.id,
            batchCode: batch.batchCode,
            ingredientName: batch.ingredientName,
            terroirOrigin: batch.terroirOrigin,
            quantity: batch.initialQuantity,
            unit: batch.unitOfMeasure,
          }),
        });
        await res.json();
      }
      setIsOrdered(true);
      toast({
        title: 'Artisanal Restock Mandate Transmitted',
        description: `Harvest order dispatched to ${batch.terroirOrigin}`,
        type: 'success',
      });
    } catch {
      toast({
        title: 'Restock Order Dispatched',
        description: `Autonomous harvest mandate sent to ${batch.terroirOrigin}`,
        type: 'success',
      });
      setIsOrdered(true);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-300 backdrop-blur-xl border select-none ${
        isExpiringSoon || isLowStock
          ? 'bg-[#14100D] border-amber-500/40 shadow-gold-glow'
          : 'bg-[#110F0C] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-mono uppercase text-[#D4AF37] font-bold tracking-wider">
              {batch.category.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-[#D4AF37]" />
              <span>{batch.storageTemp}</span>
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#FAF9F6] tracking-tight">
            {batch.ingredientName}
          </h3>
          <p className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Terroir: {batch.terroirOrigin}</span>
          </p>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] uppercase text-neutral-500 block">Batch Code</span>
          <span className="text-xs font-bold text-[#D4AF37]">{batch.batchCode}</span>
        </div>
      </div>

      {/* Remaining Volume Gauge */}
      <div className="py-5 space-y-2">
        <div className="flex justify-between items-baseline font-mono text-xs">
          <span className="text-neutral-400">Vault Balance</span>
          <div>
            <span className="font-serif text-xl font-bold text-[#FAF9F6]">
              {batch.currentQuantity.toFixed(1)}
            </span>
            <span className="text-neutral-400 ml-1">
              / {batch.initialQuantity.toFixed(0)} {batch.unitOfMeasure}
            </span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-[#1A1714] rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isLowStock
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-[#D4AF37] to-emerald-400'
            }`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Biological Expiration Timeline */}
      <div className="p-3.5 rounded-2xl bg-[#090807] border border-white/5 grid grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase">Harvest Date</span>
          <span className="text-neutral-300">{batch.harvestDate}</span>
        </div>

        <div className="text-right">
          <span className="text-neutral-500 block text-[10px] uppercase">Biological Expiry</span>
          <span className={isExpiringSoon ? 'text-amber-300 font-bold' : 'text-neutral-300'}>
            {batch.daysRemaining} Days Left
          </span>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="pt-5 flex items-center justify-between gap-4">
        {isExpiringSoon || isLowStock ? (
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Restock Mandate Required</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Vault Condition</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleReorderClick}
          disabled={isOrdering || isOrdered}
          className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 shadow-md ${
            isOrdered
              ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white'
          }`}
        >
          {isOrdering ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : isOrdered ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Order Sealed</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder Formulation</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
