'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  Rocket, 
  Search, 
  ChevronRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';
import { ScrollReveal } from '../common/ScrollReveal';
import { sound } from '../../audio/soundEffects';
import { EVENT_METRICS } from '../../data/orionData';

const InnovationCore3D = dynamic(
  () => import('../3d/InnovationCore3D').then((mod) => mod.InnovationCore3D),
  { ssr: false }
);

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
    { label: "PRIZE POOL", value: EVENT_METRICS.prizePool, color: "text-[#00BCF2]" },
    { label: "REGISTRATION FEE", value: `${EVENT_METRICS.round1Fee} / Team`, color: "text-emerald-400" },
    { label: "ONLINE DEADLINE", value: "SEP 08, 2026", color: "text-[#22D3EE]" },
    { label: "OFFLINE FINALE", value: "SEP 18, 2026", color: "text-white" }
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 flex flex-col justify-center items-center z-10 overflow-hidden">
      
      {/* Microsoft Club Governance Badge */}
      <ScrollReveal direction="down" delay={50} duration={600} className="max-w-4xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-none bg-[#0B1220]/80 border border-[rgba(0,188,242,0.25)] text-xs font-sans text-[#BAE6FD] shadow-[0_0_20px_rgba(0,188,242,0.2)] backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5" title="Microsoft Club">
            <span className="bg-[#F25022] w-1 h-1 rounded-none" />
            <span className="bg-[#7FBA00] w-1 h-1 rounded-none" />
            <span className="bg-[#00A4EF] w-1 h-1 rounded-none" />
            <span className="bg-[#FFB900] w-1 h-1 rounded-none" />
          </div>
          <span className="font-semibold tracking-wide">MICROSOFT STUDENT HACKATHON • MICROSOFT CLUB SIST</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1 text-[#00BCF2] font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#00BCF2]" />
            SIST CHENNAI
          </span>
        </div>
      </ScrollReveal>

      {/* Main Keynote & Central 3D Digital Innovation Core */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10 w-full">
        
        {/* Left Column: Hackathon Logo, Name & Headline */}
        <ScrollReveal direction="left" delay={150} duration={700} className="lg:col-span-7 text-center lg:text-left">
          
          {/* Hackathon Brand Emblem & Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 p-2 bg-[#071426]/90 border border-[#00BCF2]/40 rounded-none shadow-2xl backdrop-blur-xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-[#00BCF2]/20 blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="ORION 1.0 Official Logo" 
                className="relative w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#071426]/90 border border-[#00BCF2]/30 rounded-none text-xs font-sans font-semibold text-[#00BCF2] backdrop-blur-xl mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>OFFICIAL HACKATHON MISSION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                ORION <span className="text-[#00BCF2]">1.0</span>
              </h2>
              <p className="text-xs font-sans text-[#BAE6FD]">
                Organized by Microsoft Club SIST
              </p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[1.05] text-white">
            Code. Innovate. <br />
            <span className="text-gradient-azure">
              Build the Future.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#BAE6FD] max-w-xl font-sans leading-relaxed font-normal">
            <strong className="text-white font-semibold">Microsoft provides the technology. ORION provides the vision. Participants build the future.</strong> <br />
            The premier nationwide 24-hour hackathon organized by <strong className="text-white font-semibold">Microsoft Club SIST</strong> at Sathyabama Institute of Science and Technology, Chennai.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center w-full max-w-sm">
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="btn-sheen btn-glow-cyan w-full py-4 px-7 rounded-none font-display font-bold text-xs tracking-wider text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-[#020617]" />
              <span>REGISTER YOUR TEAM — ₹100</span>
              <ChevronRight className="w-4 h-4 text-[#020617] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </ScrollReveal>

        {/* Right Column: Central 3D Digital Innovation Core */}
        <ScrollReveal direction="right" delay={200} duration={750} className="lg:col-span-5 h-[340px] sm:h-[400px] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#00BCF2]/15 rounded-full blur-3xl pointer-events-none" />
          <InnovationCore3D className="relative z-10 cursor-grab active:cursor-grabbing" />
        </ScrollReveal>

      </div>

      {/* Modern Key Metrics Ribbon */}
      <ScrollReveal direction="up" delay={250} duration={650} className="w-full max-w-5xl mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {highlightPills.map((pill, idx) => (
            <div 
              key={idx}
              className="p-4 bg-[#0B1220]/75 backdrop-blur-2xl border border-[rgba(0,188,242,0.2)] hover:border-[#00BCF2]/70 rounded-none text-center shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-[11px] font-sans font-semibold text-[#94A3B8] tracking-wider mb-1 uppercase">
                {pill.label}
              </div>
              <div className={`text-base sm:text-xl font-display font-black ${pill.color}`}>
                {pill.value}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Countdown Timer Module */}
      <ScrollReveal direction="up" delay={350} duration={650} className="w-full max-w-3xl">
        <CountdownTimer />
      </ScrollReveal>

    </section>
  );
};
