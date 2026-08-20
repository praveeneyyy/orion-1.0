'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  Rocket, 
  ChevronRight, 
  CheckCircle2, 
  Compass,
  Radio
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { EVENT_METRICS } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

// Dynamically import 3D Orion Constellation Viewport
const OrionConstellation3D = dynamic(
  () => import('../3d/OrionConstellation3D').then((mod) => mod.OrionConstellation3D),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full min-h-[340px] flex items-center justify-center font-mono-hud text-xs text-[#94A3B8]">
        INITIALIZING ORION CONSTELLATION TELEMETRY 3D...
      </div>
    ) 
  }
);

interface FinalLaunchSectionProps {
  onOpenRegister: () => void;
  onOpenStatus?: () => void;
}

export const FinalLaunchSection: React.FC<FinalLaunchSectionProps> = ({ onOpenRegister }) => {
  const readinessSteps = [
    { num: "01", text: "Assemble your squad (2 to 6 members)", done: true },
    { num: "02", text: "Select 1 of 4 Flagship or Open challenges", done: true },
    { num: "03", text: "Download standardized 5-slide PPT template", done: true },
    { num: "04", text: "Lock in Round 1 Online entry for flat ₹100", done: true }
  ];

  return (
    <section id="launchpad" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-sans font-semibold text-blue-400 mb-4 shadow-sm">
            <Radio className="w-4 h-4 text-blue-400" />
            <span>Interactive 3D Constellation & Registration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight">
            Orion <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Interactive Console</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            <strong className="text-white">Empowering student developers across India.</strong> <br className="hidden sm:inline" />
            Interact with the 3D Orion constellation star map and register your team for Round 1.
          </p>
        </ScrollReveal>

        {/* Two-Column Interactive Mission Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-stretch text-left">
          
          {/* Left Column: 3D Orion Constellation Interactive Map */}
          <ScrollReveal direction="left" delay={150} duration={650} className="lg:col-span-7 h-full">
            <GlassCard
              glowColor="cyan"
              className="p-6 sm:p-7 border border-[rgba(0,188,242,0.25)] bg-[#0B1220]/95 rounded-none h-full flex flex-col justify-between shadow-2xl"
              withHudCorners={true}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(0,188,242,0.12)]">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#00BCF2]" />
                    <span className="text-xs font-mono-hud text-white font-bold">
                      ORION CONSTELLATION 3D // SPATIAL RADAR
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-hud text-[#22D3EE] bg-[#071426] px-2 py-0.5 border border-[#00BCF2]/40 font-semibold">
                    INTERACTIVE 3D
                  </span>
                </div>

                <div className="w-full h-72 sm:h-80 md:h-[340px] relative overflow-hidden bg-[#020617] border border-[rgba(0,188,242,0.15)] mb-4">
                  <OrionConstellation3D />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono-hud text-[#94A3B8] pt-2 border-t border-[rgba(0,188,242,0.1)]">
                <span>CONSTELLATION: ORION (THE HUNTER)</span>
                <span className="text-[#22D3EE] font-semibold">COORDINATES: RA 05h 35m • DEC −05° 23′</span>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Right Column: Mission Dispatch & Readiness Checklist */}
          <ScrollReveal direction="right" delay={200} duration={650} className="lg:col-span-5 h-full">
            <GlassCard
              glowColor="violet"
              className="p-6 sm:p-8 border border-[rgba(0,188,242,0.22)] bg-[#0B1220]/95 rounded-none h-full flex flex-col justify-between shadow-2xl"
              withHudCorners={true}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-[rgba(0,188,242,0.12)]">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-[#00BCF2]" />
                    <span className="text-xs font-mono-hud text-white font-bold">
                      SQUADRON LAUNCH PROTOCOL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-hud text-emerald-400 bg-[#071426] px-2 py-0.5 border border-emerald-400/40 font-bold">
                    ROUND 1 OPEN
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-black text-white mb-2">
                  MISSION READINESS CHECKLIST
                </h3>

                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed mb-5 font-normal">
                  Verify your squadron parameters before launching into Round 1 of ORION 1.0:
                </p>

                {/* Readiness Step Items */}
                <div className="space-y-2.5 mb-6">
                  {readinessSteps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-[#071426] border border-[rgba(0,188,242,0.12)] hover:border-[#00BCF2]/50 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono-hud text-[#22D3EE] font-bold">
                          {step.num}
                        </span>
                        <span className="text-xs font-sans text-[#F8FAFC]">
                          {step.text}
                        </span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Metric Summary Pill */}
                <div className="grid grid-cols-2 gap-2 mb-6 text-center">
                  <div className="p-2.5 bg-[#020617] border border-[rgba(0,188,242,0.15)]">
                    <span className="text-[9px] font-mono-hud text-[#94A3B8] block">PRIZE POOL</span>
                    <span className="text-xs font-mono-hud font-bold text-[#22D3EE]">{EVENT_METRICS.prizePool}</span>
                  </div>
                  <div className="p-2.5 bg-[#020617] border border-[rgba(0,188,242,0.15)]">
                    <span className="text-[9px] font-mono-hud text-[#94A3B8] block">ONLINE DEADLINE</span>
                    <span className="text-xs font-mono-hud font-bold text-[#00BCF2]">SEP 08, 2026</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[rgba(0,188,242,0.12)]">
                <button
                  onClick={() => {
                    sound.playLaunchWarp();
                    onOpenRegister();
                  }}
                  className="btn-sheen btn-glow-cyan w-full py-4 px-4 font-display font-bold text-xs tracking-wider text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                >
                  <Rocket className="w-4 h-4 text-[#020617]" />
                  <span>REGISTER YOUR TEAM — ₹100</span>
                  <ChevronRight className="w-4 h-4 text-[#020617] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </GlassCard>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
