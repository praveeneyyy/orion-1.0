'use client';

import React from 'react';
import { 
  Rocket, 
  Search, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';
import { ScrollReveal } from '../common/ScrollReveal';
import { sound } from '../../audio/soundEffects';
import { EVENT_METRICS } from '../../data/orionData';

interface HeroSectionProps {
  onOpenRegister: () => void;
  onOpenStatus?: () => void;
  onExplorePrizes?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRegister, onOpenStatus, onExplorePrizes }) => {
  const handleStatusClick = () => {
    sound.playClick();
    if (onOpenStatus) {
      onOpenStatus();
    } else if (onExplorePrizes) {
      onExplorePrizes();
    }
  };

  const highlightPills = [
    { label: "PRIZE POOL", value: EVENT_METRICS.prizePool, color: "text-[#22D3EE]" },
    { label: "ROUND 1 FLAT FEE", value: `${EVENT_METRICS.round1Fee} / SQUAD`, color: "text-emerald-400" },
    { label: "ONLINE DEADLINE", value: "SEP 08, 2026", color: "text-[#00BCF2]" },
    { label: "OFFLINE FINALE", value: "SEP 18, 2026", color: "text-white" }
  ];

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-4 flex flex-col justify-center items-center z-10 overflow-hidden">
      
      {/* Top Microsoft Club Governance Beacon */}
      <ScrollReveal direction="down" delay={50} duration={600} className="max-w-4xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#0B1220] border border-[#00BCF2]/40 text-xs font-mono-hud text-[#22D3EE] shadow-[0_0_25px_rgba(0,188,242,0.25)] backdrop-blur-md">
          <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5" title="Microsoft Club">
            <span className="bg-[#F25022] w-1 h-1" />
            <span className="bg-[#7FBA00] w-1 h-1" />
            <span className="bg-[#00A4EF] w-1 h-1" />
            <span className="bg-[#FFB900] w-1 h-1" />
          </div>
          <span className="font-bold tracking-wider">MICROSOFT STUDENT HACKATHON // MICROSOFT CLUB SIST</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1 text-[#BAE6FD]">
            <MapPin className="w-3 h-3 text-[#00BCF2]" />
            SIST CHENNAI
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-[10px] text-emerald-400 font-bold bg-[#020617] px-2 py-0.5 border border-emerald-400/40">
            24H OFFLINE SPRINT
          </span>
        </div>
      </ScrollReveal>

      {/* Official Emblem & Main Keynote Headline */}
      <ScrollReveal direction="up" delay={150} duration={700} className="max-w-5xl mx-auto text-center mb-8">
        
        {/* Glowing Official Emblem */}
        <div className="mb-4 relative inline-block group">
          <div className="absolute -inset-6 bg-gradient-to-r from-[#0078D4]/25 via-[#00BCF2]/35 to-[#22D3EE]/25 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.png" 
            alt="ORION 1.0 - Microsoft Club SIST" 
            className="relative w-36 sm:w-48 md:w-56 h-auto object-contain mx-auto filter drop-shadow-[0_0_35px_rgba(0,188,242,0.85)] hover:scale-105 transition-transform duration-500"
          />
        </div>

        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight leading-[0.92] text-white">
          BUILD BEYOND <br />
          <span className="text-gradient-frost-azure">
            THE STARS
          </span>
        </h1>

        <div className="mt-4 text-xs sm:text-sm md:text-base font-mono-hud text-[#22D3EE] tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-2">
          <span className="text-[#0078D4]">◆</span>
          <span>IGNITE THE GENESIS OF INNOVATION</span>
          <span className="text-[#0078D4]">◆</span>
        </div>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-[#BAE6FD] max-w-2xl mx-auto font-sans leading-relaxed font-normal">
          <strong className="text-white font-semibold">Microsoft provides the technology. ORION provides the mission. Participants build the future.</strong> <br />
          The premier nationwide 24-hour hackathon by <strong className="text-white font-semibold">Microsoft Club SIST</strong>.
        </p>
      </ScrollReveal>

      {/* Modern Key Metrics Ribbon */}
      <ScrollReveal direction="up" delay={250} duration={650} className="w-full max-w-4xl mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {highlightPills.map((pill, idx) => (
            <div 
              key={idx}
              className="p-3 bg-[#0B1220]/90 border border-[rgba(0,188,242,0.18)] hover:border-[#00BCF2]/70 transition-all text-center shadow-lg hover:-translate-y-0.5"
            >
              <div className="text-[10px] font-mono-hud text-[#94A3B8] tracking-wider mb-0.5 font-semibold">
                {pill.label}
              </div>
              <div className={`text-base sm:text-lg font-mono-hud font-black ${pill.color}`}>
                {pill.value}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Action Buttons */}
      <ScrollReveal direction="up" delay={300} duration={600} className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md mb-12">
        <button
          onClick={() => {
            sound.playLaunchWarp();
            onOpenRegister();
          }}
          className="btn-sheen btn-glow-cyan w-full sm:w-auto flex-1 py-4 px-7 font-display font-bold text-xs tracking-wider text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
        >
          <Rocket className="w-4 h-4 text-[#020617]" />
          <span>ENTER THE MISSION — ₹100</span>
          <ChevronRight className="w-4 h-4 text-[#020617] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleStatusClick}
          className="w-full sm:w-auto py-4 px-6 font-mono-hud text-xs text-[#94A3B8] hover:text-white border border-[rgba(0,188,242,0.2)] bg-[#0B1220] hover:bg-[#071426] hover:border-[#00BCF2]/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
        >
          <Search className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>SQUAD LOOKUP</span>
        </button>
      </ScrollReveal>

      {/* Countdown Timer Module */}
      <ScrollReveal direction="up" delay={400} duration={650} className="w-full max-w-3xl">
        <CountdownTimer />
      </ScrollReveal>

    </section>
  );
};
