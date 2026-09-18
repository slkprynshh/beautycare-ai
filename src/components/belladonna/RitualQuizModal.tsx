'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Flame,
  Snowflake,
  Flower2,
  RefreshCw,
  Clock,
  Sparkle,
  Crown,
} from 'lucide-react';
import { Treatment, TREATMENTS, LuxuryCurrency } from '@/components/parisian/TreatmentMenu';

interface QuizFocusOption {
  id: 'rejuvenation' | 'relaxation' | 'event' | 'sculpting';
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  gradient: string;
}

const FOCUS_OPTIONS: QuizFocusOption[] = [
  {
    id: 'rejuvenation',
    title: 'Cellular Rejuvenation',
    subtitle: 'Cellular Renewal & Glow',
    description: 'Deep antioxidant infusion, 24k gold peptides, and bio-fermented cellular renewal.',
    icon: Sparkles,
    badge: 'Longevity Ritual',
    gradient: 'from-amber-100/50 via-stone-50 to-amber-50/30',
  },
  {
    id: 'relaxation',
    title: 'Deep Relaxation',
    subtitle: 'Profound Relaxation & Warmth',
    description: 'Release profound tension with warm volcanic basalt stones and hand-pressed botanical oils.',
    icon: Flame,
    badge: 'Holistic Calm',
    gradient: 'from-rose-100/40 via-stone-50 to-orange-50/30',
  },
  {
    id: 'event',
    title: 'Event Preparation',
    subtitle: 'Red Carpet Radiance',
    description: 'Instant glass-skin luminosity, diamond micro-exfoliation, and flawless high-definition radiance.',
    icon: Crown,
    badge: 'Red Carpet Glow',
    gradient: 'from-stone-100/60 via-amber-50/30 to-stone-50',
  },
  {
    id: 'sculpting',
    title: 'Contour Sculpting',
    subtitle: 'Sculpt & Lymphatic Lifting',
    description: 'Sub-zero cryogenic lifting, muscle release, and precision lymphatic contouring.',
    icon: Snowflake,
    badge: 'Cryo-Architecture',
    gradient: 'from-sky-100/40 via-stone-50 to-stone-100/40',
  },
];

interface QuizSensoryOption {
  id: 'warm' | 'cooling' | 'floral';
  title: string;
  subtitle: string;
  notes: string;
  icon: React.ElementType;
  palette: string;
  tag: string;
}

const SENSORY_OPTIONS: QuizSensoryOption[] = [
  {
    id: 'warm',
    title: 'Warm & Earthy',
    subtitle: 'Warmth & Heated Volcanic Stones',
    notes: 'Warm amber, golden cedarwood, organic vanilla, and heated volcanic stones.',
    icon: Flame,
    palette: 'border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20',
    tag: 'Sensory Warmth',
  },
  {
    id: 'cooling',
    title: 'Cooling & Clinical',
    subtitle: 'Sub-Zero Cryo & Oxygen',
    notes: 'Sub-zero cryo-peptide mists, refreshing marine botanicals, and cooling jade globes.',
    icon: Snowflake,
    palette: 'border-cyan-200/80 bg-cyan-50/40 dark:bg-cyan-950/20',
    tag: 'Cryo Freshness',
  },
  {
    id: 'floral',
    title: 'Aromatic & Floral',
    subtitle: 'Neroli & Mediterranean Citrus',
    notes: 'Cold-pressed citrus bergamot, orange blossom, and delicate Damask rose.',
    icon: Flower2,
    palette: 'border-rose-200/80 bg-rose-50/40 dark:bg-rose-950/20',
    tag: 'Botanical Alchemy',
  },
];

interface RecommendedMatch {
  treatment: Treatment;
  matchScore: number;
  personalRationale: string;
  aestheticianAdvice: string;
  sensoryProfile: string;
}

interface RitualQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTreatment: (treatment: Treatment) => void;
  currency: LuxuryCurrency;
}

export function RitualQuizModal({
  isOpen,
  onClose,
  onBookTreatment,
  currency,
}: RitualQuizModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFocus, setSelectedFocus] = useState<QuizFocusOption['id'] | null>(null);
  const [selectedSensory, setSelectedSensory] = useState<QuizSensoryOption['id'] | null>(null);

  const getRecommendation = (): RecommendedMatch => {
    // Dynamic matching based on selected focus + sensory combination
    if (selectedFocus === 'relaxation' || selectedSensory === 'warm') {
      const match = TREATMENTS.find((t) => t.id === 'aromatherapy-massage') || TREATMENTS[1];
      return {
        treatment: match,
        matchScore: 98,
        personalRationale:
          'Based on your desire for deep restoration and warm, earthy sensations, our Sicilian hot basalt stones and hand-pressed Neroli oils will release neuromuscular tension and align your circadian calm.',
        aestheticianAdvice:
          '“We recommend beginning with 10 minutes in the private eucalyptus steam boudoir prior to volcanic stone placement for optimal tension dissolution.”',
        sensoryProfile: 'Warm Sicilian botanical oils • Volcanic basalt heat • Acupressure',
      };
    }

    if (selectedFocus === 'sculpting' || selectedSensory === 'cooling') {
      const match = TREATMENTS.find((t) => t.id === 'signature-facial') || TREATMENTS[0];
      return {
        treatment: match,
        matchScore: 99,
        personalRationale:
          'Your focus on facial architecture and clinical precision pairs impeccably with our signature cryogenic sculpting and 24k gold peptide micro-infusion.',
        aestheticianAdvice:
          '“This ritual combines Roman lymphatic drainage with -5°C cryogenic globes to instantly define cheekbones and jawline.”',
        sensoryProfile: 'Diamond micro-peel • 24k Gold bio-peptides • Sub-zero cryo mist',
      };
    }

    if (selectedFocus === 'event') {
      const match = TREATMENTS.find((t) => t.id === 'spa-day-package') || TREATMENTS[5] || TREATMENTS[0];
      return {
        treatment: match,
        matchScore: 97,
        personalRationale:
          'For your upcoming special occasion, this comprehensive half-day suite ritual provides an unhurried, all-encompassing metamorphosis with glass-skin radiance and bespoke hair styling.',
        aestheticianAdvice:
          '“Includes chilled Franciacorta sparkling wine service and a personalized take-home 24k peptide ampoule for day-of radiance.”',
        sensoryProfile: 'Private Carrara marble suite • Signature facial & massage • Franciacorta reception',
      };
    }

    // Default: The Signature Villa Belladonna Facial
    const match = TREATMENTS[0];
    return {
      treatment: match,
      matchScore: 96,
      personalRationale:
        'A harmoniously balanced ritual designed to revitalize cellular vitality through 24k gold leaf infusion, diamond exfoliation, and gentle lymphatic awakening.',
      aestheticianAdvice:
        '“Our most celebrated Villa Belladonna favorite, customized during consultation to your skin’s unique circadian cycle.”',
      sensoryProfile: 'Diamond micro-exfoliation • 24k Gold leaf • Tuscan Neroli',
    };
  };

  const handleFocusSelect = (focusId: QuizFocusOption['id']) => {
    setSelectedFocus(focusId);
    setStep(2);
  };

  const handleSensorySelect = (sensoryId: QuizSensoryOption['id']) => {
    setSelectedSensory(sensoryId);
    setStep(3);
  };

  const handleReset = () => {
    setSelectedFocus(null);
    setSelectedSensory(null);
    setStep(1);
  };

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

  if (!isOpen) return null;

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl rounded-[32px] sm:rounded-[40px] bg-surface border border-border/80 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Top Header & Progress Indicator */}
        <div className="px-6 sm:px-10 py-5 border-b border-border/80 flex items-center justify-between bg-surface-muted/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-gold-surface border border-gold-border text-gold shadow-subtle">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base sm:text-lg font-medium text-foreground block">
                Discover Your Bespoke Ritual
              </span>
              <span className="text-[10px] font-label uppercase tracking-widest text-muted-foreground font-semibold">
                Villa Belladonna Milan • VIP Concierge
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Counter Badge */}
            <span className="text-xs font-label uppercase tracking-wider font-semibold text-gold px-3 py-1 rounded-full bg-gold-surface border border-gold-border/70">
              {step === 3 ? 'Recommended Ritual' : `Step ${step} of 2`}
            </span>

            <button
              onClick={onClose}
              aria-label="Close Quiz"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface transition-colors border border-border/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-surface-muted h-1 relative overflow-hidden">
          <motion.div
            initial={{ width: '33%' }}
            animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-gold to-[#A88659]"
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              /* STEP 1: Focus Selection */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[11px] font-label uppercase tracking-widest text-gold font-bold">
                    Question 01
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-foreground">
                    What is your <span className="italic font-serif font-light text-gold">primary focus</span> today?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                    Select the transformation you wish to achieve during your private suite session.
                  </p>
                </div>

                {/* 4 Large Elegant Clickable Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                  {FOCUS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleFocusSelect(opt.id)}
                        className={`group text-left p-6 sm:p-7 rounded-[26px] bg-surface border border-border hover:border-gold-border hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
                          selectedFocus === opt.id ? 'border-gold ring-2 ring-gold/30 bg-gold-surface/20' : ''
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="p-3 rounded-2xl bg-gold-surface border border-gold-border text-gold group-hover:scale-110 transition-transform duration-300 shadow-subtle">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-label uppercase tracking-widest text-gold font-semibold">
                              {opt.badge}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] uppercase tracking-widest text-gold font-label font-bold block">
                              {opt.subtitle}
                            </span>
                            <h3 className="text-xl font-serif text-foreground font-medium group-hover:text-gold transition-colors">
                              {opt.title}
                            </h3>
                          </div>

                          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                            {opt.description}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between text-xs font-label uppercase tracking-wider font-semibold text-gold">
                          <span>Select Focus</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              /* STEP 2: Sensory Experience Selection */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[11px] font-label uppercase tracking-widest text-gold font-bold">
                    Question 02
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-foreground">
                    Select your preferred <span className="italic font-serif font-light text-gold">sensory experience</span>.
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                    Choose the olfactory notes and temperature profile that soothe your senses.
                  </p>
                </div>

                {/* 3 Large Elegant Clickable Sensory Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
                  {SENSORY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSensorySelect(opt.id)}
                        className={`group text-left p-6 sm:p-7 rounded-[26px] bg-surface border border-border hover:border-gold-border hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between min-h-[220px] ${
                          selectedSensory === opt.id ? 'border-gold ring-2 ring-gold/30 bg-gold-surface/20' : ''
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="p-3.5 rounded-2xl bg-surface-muted border border-border text-gold group-hover:scale-110 transition-transform duration-300 shadow-subtle">
                              <Icon className="w-5 h-5 text-gold" />
                            </div>
                            <span className="text-[10px] font-label uppercase tracking-widest text-gold font-semibold">
                              {opt.tag}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] uppercase tracking-widest text-gold font-label font-bold block">
                              {opt.subtitle}
                            </span>
                            <h3 className="text-xl font-serif text-foreground font-medium group-hover:text-gold transition-colors">
                              {opt.title}
                            </h3>
                          </div>

                          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                            {opt.notes}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between text-xs font-label uppercase tracking-wider font-semibold text-gold border-t border-border/60">
                          <span>Select Experience</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Back Button */}
                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-xs font-label uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Focus</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              /* RESULT STATE: Dynamic Recommended Treatment & Direct Booking */
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Result Top Badge */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
                    <Sparkle className="w-3.5 h-3.5 text-gold animate-spin" />
                    <span>{recommendation.matchScore}% Bespoke Match Curated</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-foreground tracking-tight">
                    Your Tailored Ritual: <span className="italic font-serif font-light text-gold">{recommendation.treatment.title}</span>
                  </h2>
                </div>

                {/* Hero Recommendation Card */}
                <div className="rounded-[30px] bg-surface border border-gold-border/80 shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                  {/* Treatment Image */}
                  <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-surface-muted">
                    <Image
                      src={recommendation.treatment.image}
                      alt={recommendation.treatment.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/90 glass-surface border border-border text-[10px] font-label font-bold uppercase tracking-wider text-gold">
                      {recommendation.treatment.tag || 'Maison Selection'}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-md">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>{recommendation.treatment.durationMinutes} Minutes</span>
                      </div>
                      <div className="px-3.5 py-1 rounded-full bg-white text-charcoal font-serif font-semibold text-sm">
                        {formatPrice(recommendation.treatment)}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-gold font-label font-bold">
                          {recommendation.treatment.subtitle || recommendation.treatment.italianTitle || recommendation.treatment.title}
                        </span>
                        <h3 className="text-2xl font-serif text-foreground font-medium mt-0.5">
                          {recommendation.treatment.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-foreground/80 font-sans leading-relaxed">
                        {recommendation.personalRationale}
                      </p>

                      {/* Aesthetician Quote Box */}
                      <div className="p-4 rounded-2xl bg-gold-surface/50 border border-gold-border/60 text-xs text-foreground/90 font-sans space-y-1">
                        <div className="flex items-center gap-1.5 text-gold font-semibold text-[11px] uppercase tracking-wider font-label">
                          <Crown className="w-3.5 h-3.5" />
                          <span>Lead Aesthetician Note</span>
                        </div>
                        <p className="italic font-serif text-xs text-foreground">
                          {recommendation.aestheticianAdvice}
                        </p>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5 pt-2 border-t border-border/70">
                        {recommendation.treatment.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-foreground/85">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct Booking CTA */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => {
                          onBookTreatment(recommendation.treatment);
                          onClose();
                        }}
                        className="btn-luxury-dark w-full sm:flex-1 py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-gold" />
                        <span>Book This Bespoke Ritual</span>
                      </button>

                      <button
                        onClick={handleReset}
                        className="w-full sm:w-auto px-5 py-4 rounded-full bg-surface border border-border hover:border-gold-border text-xs font-label uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
