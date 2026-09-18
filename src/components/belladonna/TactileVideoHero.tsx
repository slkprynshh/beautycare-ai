'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowDown,
  Droplets,
} from 'lucide-react';

interface TactileVideoHeroProps {
  onExploreProducts: () => void;
}

export function TactileVideoHero({ onExploreProducts }: TactileVideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] sm:rounded-[44px] border border-border/80 bg-[#121110] text-[#FAF8F5] shadow-2xl min-h-[460px] sm:min-h-[560px] lg:min-h-[620px] flex items-center justify-center">
      {/* Background Video Element with Slow-Motion Tactile Skincare Textures */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/images/belladonna_bottega.jpg"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.72] contrast-[1.1] saturate-[1.15]"
        >
          {/* High quality tactile slow-motion luxury skincare textures */}
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            type="video/mp4"
          />
        </video>

        {/* Ambient Film Grain & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-black/40 to-[#121110]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(18,17,16,0.7)_100%)]" />
      </div>

      {/* Top Floating Controls Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-gold">
          <Droplets className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-label uppercase tracking-widest text-[10px] font-semibold text-white/90">
            Tactile Macro Film • 120 FPS Texture Loop
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-gold transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Ambient Sound' : 'Mute Sound'}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-gold transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Storytelling Hero Overlay */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-12 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-label uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>The Skincare Boutique • Artisanal Formulations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.12]">
            The Tactile Alchemy of <span className="italic font-serif font-light text-gold">24k Bio-Peptides</span>
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-white/80 font-sans max-w-xl mx-auto leading-relaxed">
            Witness the slow-churned emulsion of cold-pressed Sicilian citrus, volcanic bio-ferments, and pure 24-karat gold flakes designed for cellular longevity.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreProducts}
              className="btn-luxury-dark group px-8 py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95 flex items-center gap-2.5"
            >
              <span>Explore Skincare Collection</span>
              <ArrowDown className="w-4 h-4 text-gold group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center justify-between text-xs text-white/60 font-sans z-10 pointer-events-none">
        <span>Artisanal Batch #084 • Cold-Pressed in Sicily &amp; Tuscany • Formulated in Milan</span>
        <span className="font-mono">100% Organic Bio-Ferment</span>
      </div>
    </section>
  );
}
