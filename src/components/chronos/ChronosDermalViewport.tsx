'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Activity,
  ShieldCheck,
  Zap,
  RotateCw,
  Sliders,
  Maximize2,
  Droplets,
  Crown,
} from 'lucide-react';

interface ChronosDermalViewportProps {
  ageOffsetYears: number;
  isProtocolActive: boolean;
  selectedLayer: 'epidermis' | 'dermis' | 'vascular' | 'volumetric';
}

export function ChronosDermalViewport({
  ageOffsetYears,
  isProtocolActive,
  selectedLayer,
}: ChronosDermalViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  // Biological metrics computation
  const collagenRetention = Math.max(
    35,
    Math.round(
      94.2 -
        (ageOffsetYears * 2.8) *
        (isProtocolActive ? 0.32 : 1.0)
    )
  );

  const elastosisScore = Math.min(
    100,
    Math.round(
      12 +
        (ageOffsetYears * 4.1) *
        (isProtocolActive ? 0.28 : 1.0)
    )
  );

  const epidermalTurnoverDays = Math.round(
    28 +
      (ageOffsetYears * 1.6) *
      (isProtocolActive ? 0.25 : 1.0)
  );

  // WebGL / High-Performance 2D/3D Canvas Shader Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid Lines (Palazzo Scientific Matrix)
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Base Radial Biometric Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        width * 0.45
      );
      if (isProtocolActive) {
        glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
        glowGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
        glowGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(180, 83, 9, 0.20)');
        glowGrad.addColorStop(0.6, 'rgba(225, 29, 72, 0.08)');
        glowGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. 3D Facial Topology Simulation Mesh (Wireframe Points & Contours)
      const points = 72;
      const radius = 140;
      const currentAngle = isRotating ? time * 0.4 : rotationAngle;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw multi-layered concentric depth contours
      for (let layer = 0; layer < 4; layer++) {
        const layerScale = 1 - layer * 0.18;
        ctx.beginPath();

        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * Math.PI * 2;
          
          // Organic deformation based on age and active protocol
          const agePerturbation =
            Math.sin(theta * 6 + time) *
            (ageOffsetYears * 0.8) *
            (isProtocolActive ? 0.3 : 1.0);

          const layerOffset =
            Math.cos(theta * 4 - time * 0.5) * (layer * 4);

          const r =
            (radius * layerScale + agePerturbation + layerOffset) *
            (1 + Math.sin(theta + currentAngle) * 0.12);

          const px = Math.cos(theta + currentAngle) * r;
          const py = Math.sin(theta) * (r * 1.25); // Elliptical facial contour

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.closePath();

        if (layer === 0) {
          ctx.strokeStyle = isProtocolActive
            ? 'rgba(212, 175, 55, 0.85)'
            : 'rgba(220, 38, 38, 0.7)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.strokeStyle = isProtocolActive
            ? `rgba(212, 175, 55, ${0.4 - layer * 0.08})`
            : `rgba(244, 63, 94, ${0.35 - layer * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 4. Draw Topological Feature Nodes (Eyes, Cheekbones, Jawline landmarks)
      const landmarks = [
        { x: -45, y: -35, label: 'Orbital L' },
        { x: 45, y: -35, label: 'Orbital R' },
        { x: 0, y: -5, label: 'Nasal Apex' },
        { x: -60, y: 15, label: 'Malar L' },
        { x: 60, y: 15, label: 'Malar R' },
        { x: 0, y: 55, label: 'Mental Apex' },
      ];

      landmarks.forEach((lm) => {
        const lx = Math.cos(currentAngle) * lm.x;
        const ly = lm.y + Math.sin(time + lm.x) * 2;

        ctx.beginPath();
        ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isProtocolActive ? '#D4AF37' : '#F43F5E';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx, ly, 7 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = isProtocolActive
          ? 'rgba(212, 175, 55, 0.4)'
          : 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 5. Suspended 24k Gold Flake Micro-Infusion Particles (Protocol Active Mode)
      if (isProtocolActive) {
        const particleCount = 28;
        for (let p = 0; p < particleCount; p++) {
          const pAngle = (p / particleCount) * Math.PI * 2 + time * 0.8;
          const pDist = 60 + Math.sin(p * 3 + time) * 70;
          const px = Math.cos(pAngle) * pDist;
          const py = Math.sin(pAngle) * (pDist * 1.2);

          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 230, 150, 0.9)';
          ctx.fill();
        }
      }

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [ageOffsetYears, isProtocolActive, isRotating, rotationAngle, selectedLayer]);

  return (
    <div className="relative w-full rounded-3xl bg-[#090807] border-2 border-[#D4AF37]/40 shadow-2xl overflow-hidden">
      
      {/* Top Telemetry HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#110F0C]/90 border border-[#D4AF37]/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#D4AF37] font-bold">THE CHRONOS DERMAL TWIN™</span>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="text-neutral-400 hidden sm:inline">60 FPS WebGL Engine</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className="px-3 py-1.5 rounded-full bg-[#110F0C]/90 border border-white/10 text-neutral-300 hover:text-[#D4AF37] transition flex items-center gap-1.5 backdrop-blur-md"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isRotating ? 'Pause Orbit' : 'Resume Orbit'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="w-full flex items-center justify-center p-4 sm:p-8">
        <canvas
          ref={canvasRef}
          width={680}
          height={460}
          className="w-full max-w-[680px] h-[340px] sm:h-[420px] object-contain rounded-2xl cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Bottom Live Biological Telemetry Bar */}
      <div className="border-t border-[#D4AF37]/20 bg-[#0E0C0A]/95 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        
        <div className="p-3 rounded-2xl bg-[#141210] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-neutral-400 text-[11px]">
            <span>Collagen Density</span>
            <span className={isProtocolActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {collagenRetention}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isProtocolActive ? 'bg-gradient-to-r from-[#D4AF37] to-emerald-400' : 'bg-rose-500'
              }`}
              style={{ width: `${collagenRetention}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#141210] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-neutral-400 text-[11px]">
            <span>Photo-Elastosis Index</span>
            <span className={isProtocolActive ? 'text-[#D4AF37] font-bold' : 'text-rose-400 font-bold'}>
              {elastosisScore} / 100
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isProtocolActive ? 'bg-gradient-to-r from-teal-500 to-[#D4AF37]' : 'bg-rose-500'
              }`}
              style={{ width: `${elastosisScore}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#141210] border border-white/5 space-y-1">
          <div className="flex justify-between items-center text-neutral-400 text-[11px]">
            <span>Cell Turnover Cycle</span>
            <span className="text-amber-200 font-bold">
              {epidermalTurnoverDays} Days
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-[#D4AF37]"
              style={{ width: `${Math.min(100, (28 / epidermalTurnoverDays) * 100)}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
