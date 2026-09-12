'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Award, Star, Scissors, Heart, Calendar } from 'lucide-react';

interface SpecialistCard {
  name: string;
  frenchTitle: string;
  role: string;
  experience: string;
  bio: string;
  specialties: string[];
  initials: string;
  bgGradient: string;
}

const SPECIALISTS_DETAILED: SpecialistCard[] = [
  {
    name: 'Elise Laurent',
    frenchTitle: 'Maître Esthéticienne',
    role: 'Lead Skincare Biologist & Aesthetician',
    experience: '12+ Years Haute Beauté Experience',
    bio: 'Trained at the prestigious Paris Aesthetic Academy. Renowned for micro-peptide layering and signature cryogenic contour sculpting.',
    specialties: ['Diamond Peeling', 'Cryo Sculpting', '24k Gold Infusion'],
    initials: 'EL',
    bgGradient: 'from-amber-100/50 to-stone-100',
  },
  {
    name: 'Charlotte Dubois',
    frenchTitle: 'Experte en Soins du Visage',
    role: 'Senior Facialist & Lymphatic Specialist',
    experience: '8 Years Luxury Spa Practice',
    bio: 'Pioneer of French lymphatic drainage techniques and buccal rejuvenation rituals designed to release facial tension naturally.',
    specialties: ['Lymphatic Drainage', 'Buccal Massage', 'Sensitive Skin Rituals'],
    initials: 'CD',
    bgGradient: 'from-rose-100/50 to-stone-100',
  },
  {
    name: 'Mathieu Moreau',
    frenchTitle: 'Thérapeute du Bien-Être',
    role: 'Wellness & Body Recovery Specialist',
    experience: '10 Years 5-Star Hotel Spas',
    bio: 'Specializing in deep aromatherapy, volcanic basalt hot stones, and customized postural recovery rituals for jet lag & stress relief.',
    specialties: ['Volcanic Hot Stone', 'Swedish Relaxation', 'Aromatherapy Alchemy'],
    initials: 'MM',
    bgGradient: 'from-stone-200/50 to-stone-100',
  },
];

interface TherapistSectionProps {
  onBookSpecialist: () => void;
}

export function TherapistSection({ onBookSpecialist }: TherapistSectionProps) {
  return (
    <section className="py-12 space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
          <Award className="w-3.5 h-3.5 text-gold" />
          <span>The Master Artisans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground tracking-tight">
          Meet Our Parisian Specialists
        </h2>
        <p className="text-sm text-muted-foreground font-sans max-w-lg mx-auto">
          Every practitioner holds master certifications from premier French beauty institutes, blending bespoke care with utmost discretion.
        </p>
      </div>

      {/* Grid of Specialists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {SPECIALISTS_DETAILED.map((specialist, idx) => (
          <motion.div
            key={specialist.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="rounded-3xl bg-surface border border-border p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-luxury hover:shadow-luxury-hover hover:border-gold-border transition-all group"
          >
            <div className="space-y-4">
              {/* Avatar & Badges */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${specialist.bgGradient} border border-gold/30 flex items-center justify-center font-serif text-xl font-bold text-foreground group-hover:scale-105 transition-transform shadow-sm`}
                >
                  {specialist.initials}
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-sans">
                    {specialist.experience}
                  </span>
                </div>
              </div>

              {/* Names & Titles */}
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-gold font-label font-medium">
                  {specialist.frenchTitle}
                </p>
                <h3 className="text-xl font-serif text-foreground font-medium">
                  {specialist.name}
                </h3>
                <p className="text-xs font-medium text-foreground/80 font-sans">
                  {specialist.role}
                </p>
              </div>

              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                {specialist.bio}
              </p>

              {/* Specialties Chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {specialist.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-surface-muted text-foreground/80 text-[10px] font-medium border border-border/80"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Request Button */}
            <button
              onClick={onBookSpecialist}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-surface border border-border group-hover:border-gold group-hover:bg-gold-surface text-foreground font-label text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>Book with {specialist.name.split(' ')[0]}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
