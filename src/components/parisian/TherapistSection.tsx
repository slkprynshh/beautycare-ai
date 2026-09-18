'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Star, Calendar, ArrowRight } from 'lucide-react';

interface SpecialistCard {
  name: string;
  title: string;
  role: string;
  experience: string;
  bio: string;
  specialties: string[];
  initials: string;
  image: string;
  bgGradient: string;
}

const SPECIALISTS_DETAILED: SpecialistCard[] = [
  {
    name: 'Elena Russo',
    title: 'Master Aesthetician',
    role: 'Lead Skincare Biologist & Aesthetician',
    experience: '12+ Years Luxury Beauty Experience',
    bio: 'Trained at the prestigious Accademia di Estetica in Milan. Renowned for Tuscan botanical layering, 24k gold micro-peptide infusion, and signature cryogenic contour sculpting.',
    specialties: ['Tuscan Botanical Layering', '24k Gold Infusion', 'Cryo Sculpting'],
    initials: 'ER',
    image: '/images/belladonna_artisan_alessia.jpg',
    bgGradient: 'from-amber-100/60 to-stone-100',
  },
  {
    name: 'Chiara Belladonna',
    title: 'Senior Facialist & Co-Founder',
    role: 'Master Facialist & Lymphatic Specialist',
    experience: '10+ Years Luxury Spa Practice',
    bio: 'Master of Roman lymphatic drainage techniques and volcanic clay rituals formulated to detoxify, release tension, and sculpt cheekbone architecture.',
    specialties: ['Roman Lymphatic Drainage', 'Volcanic Clay Rituals', 'Buccal Massage'],
    initials: 'CB',
    image: '/images/belladonna_artisan_chiara.jpg',
    bgGradient: 'from-rose-100/60 to-stone-100',
  },
  {
    name: 'Matteo Romano',
    title: 'Wellness & Body Specialist',
    role: 'Wellness & Body Recovery Specialist',
    experience: '10+ Years 5-Star Amalfi Coast Spas',
    bio: 'Extensive background in five-star Amalfi Coast resort spas. Specializing in volcanic basalt hot stone recovery, postural alignment, and botanical body silk.',
    specialties: ['Volcanic Hot Stone Recovery', 'Citrus Body Silk', 'Deep Neuromuscular Alchemy'],
    initials: 'MR',
    image: '/images/belladonna_artisan_matteo.jpg',
    bgGradient: 'from-stone-200/60 to-stone-100',
  },
];

interface TherapistSectionProps {
  onBookSpecialist: () => void;
}

export function TherapistSection({ onBookSpecialist }: TherapistSectionProps) {
  return (
    <section className="py-14 sm:py-20 space-y-10 sm:space-y-12">
      {/* Section Header with Elevated Typography */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
          <Award className="w-3.5 h-3.5 text-gold" />
          <span>Master Beauty Artisans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground tracking-tight">
          Meet Our <span className="italic font-serif font-light text-gold">Milanese Master Artisans</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed font-normal">
          Every practitioner holds master certifications from premier Italian aesthetics academies, blending bespoke clinical precision with discrete personal care.
        </p>
      </div>

      {/* Grid of Specialists with 1.05x Zoom and Soft Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        {SPECIALISTS_DETAILED.map((specialist, idx) => (
          <motion.div
            key={specialist.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            className="rounded-[28px] bg-surface border border-border p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-luxury hover:shadow-luxury-hover hover:border-gold-border hover:-translate-y-1.5 transition-all duration-500 group"
          >
            <div className="space-y-5">
              {/* Photo Avatar & Badges */}
              <div className="flex items-center justify-between">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold-border/60 shadow-subtle group-hover:scale-105 transition-transform duration-700">
                  <Image
                    src={specialist.image}
                    alt={specialist.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-sans font-medium">
                    {specialist.experience}
                  </span>
                </div>
              </div>

              {/* Names & Titles */}
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-widest text-gold font-label font-bold">
                  {specialist.title}
                </p>
                <h3 className="text-2xl font-serif text-foreground font-medium group-hover:text-gold-hover transition-colors">
                  {specialist.name}
                </h3>
                <p className="text-xs font-semibold text-foreground/80 font-sans">
                  {specialist.role}
                </p>
              </div>

              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                {specialist.bio}
              </p>

              {/* Specialties Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {specialist.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-surface-muted text-foreground/80 text-[11px] font-medium border border-border/80"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Request Button with Slow Fill */}
            <button
              onClick={onBookSpecialist}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-surface-muted hover:bg-gold-surface border border-border hover:border-gold-border group-hover:bg-champagne-gold group-hover:text-charcoal group-hover:border-transparent text-foreground font-label text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-subtle active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-gold group-hover:text-charcoal transition-colors" />
              <span>Book with {specialist.name.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


