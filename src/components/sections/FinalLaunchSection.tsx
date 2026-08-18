'use client';

import React from 'react';
import { Rocket, ShieldCheck, Zap, Trophy, Search } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Lightfall } from '../common/Lightfall';
import { EVENT_METRICS } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

interface FinalLaunchSectionProps {
  onOpenRegister: () => void;
  onOpenStatus: () => void;
}

export const FinalLaunchSection: React.FC<FinalLaunchSectionProps> = ({ onOpenRegister, onOpenStatus }) => {
  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        
        {/* React Bits Lightfall Hyperspace Background Layer */}
        <div className="absolute -inset-4 z-0 pointer-events-none opacity-45 overflow-hidden">
          <Lightfall
            colors={['#FFFFFF', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0284C7']}
            backgroundColor="#040E24"
            speed={0.4}
            streakCount={4}
            streakWidth={1.2}
            streakLength={1.3}
            glow={0.8}
            density={0.45}
            twinkle={0.8}
            zoom={2.2}
            backgroundGlow={0.35}
            opacity={0.5}
            mouseInteraction={true}
            mouseStrength={0.7}
            mouseRadius={0.9}
            mixBlendMode="screen"
          />
        </div>

        <GlassCard
          glowColor="cyan"
          className="p-8 sm:p-12 md:p-16 border border-[rgba(212,233,255,0.16)] bg-[#07193D]/95 relative z-10 overflow-hidden text-center shadow-2xl rounded-none"
          withHudCorners={true}
        >
          <div className="absolute inset-0 hud-grid-pattern opacity-15 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-xs font-mono-hud text-[#38BDF8] mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#38BDF8]" />
              <span>LAUNCH SEQUENCE // ROUND 1 REGISTRATIONS ACTIVE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight mb-4">
              ENTER THE <span className="text-gradient-frost-azure">ORION 1.0</span> MISSION
            </h2>

            <p className="text-sm md:text-base text-[#BAE6FD] font-sans leading-relaxed mb-8 max-w-xl font-normal">
              Join visionary builders across India. Secure your squadron slot for Round 1 today and launch towards the ₹1,00,000 prize orbit.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-8 text-left">
              <div className="p-3.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)]">
                <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">PRIZE POOL</span>
                <span className="text-sm font-mono-hud font-bold text-[#38BDF8]">{EVENT_METRICS.prizePool}</span>
              </div>
              <div className="p-3.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)]">
                <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">ROUND 1 FEE</span>
                <span className="text-sm font-mono-hud font-bold text-emerald-400">{EVENT_METRICS.round1Fee} FLAT</span>
              </div>
              <div className="p-3.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)]">
                <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">FINALE ARENA</span>
                <span className="text-sm font-mono-hud font-bold text-white">TOP 70 SQUADS</span>
              </div>
              <div className="p-3.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)]">
                <span className="text-[10px] font-mono-hud text-[#7DD3FC] block">CREW CAPACITY</span>
                <span className="text-sm font-mono-hud font-bold text-white">2–6 MEMBERS</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
              <button
                onClick={() => {
                  sound.playLaunchWarp();
                  onOpenRegister();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-[#040E24]" />
                <span>INITIATE ROUND 1 LAUNCH — ₹100</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenStatus();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-none font-mono-hud text-xs text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.16)] bg-[#07193D] hover:bg-[#0B2556] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>CHECK TEAM STATUS</span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono-hud text-[#7DD3FC]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                OFFICIAL SATHYABAMA CERTIFICATION
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
                MICROSOFT CLUB SIST GOVERNANCE
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#38BDF8]" />
                ₹1,00,000 TOTAL REWARDS
              </span>
            </div>

          </div>
        </GlassCard>
      </div>
    </section>
  );
};
