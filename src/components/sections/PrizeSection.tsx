'use client';

import React from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layout, 
  HardDrive, 
  Presentation,
  ShieldAlert,
  Award
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { PRIZE_TIERS, SPECIAL_TRACK_BOUNTIES, EVENT_METRICS } from '../../data/orionData';

export const PrizeSection: React.FC = () => {
  const bountyIcons = [Cpu, Layout, HardDrive, Presentation];

  return (
    <section id="prizes" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0B1220] border border-[#00BCF2]/30 text-xs font-mono-hud text-[#22D3EE] mb-3 shadow-[0_0_15px_rgba(0,188,242,0.2)]">
            <Trophy className="w-3.5 h-3.5" />
            <span>MISSION REWARDS & BOUNTIES // CASH POOL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            <AnimatedCounter value="₹1,00,000" duration={1800} /> <span className="text-gradient-frost-azure">PRIZE ORBIT</span>
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-2.5 font-sans leading-relaxed">
            Honoring elite technical execution, architectural robustness, and disruptive engineering across student and developer squads.
          </p>
        </ScrollReveal>

        {/* 3 Podium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16 items-stretch text-left">
          {PRIZE_TIERS.map((tier, idx) => {
            const isFirst = idx === 0;

            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 120}
                duration={650}
                className={`h-full ${isFirst ? 'lg:-translate-y-4' : ''}`}
              >
                <GlassCard
                  glowColor={isFirst ? "cyan" : idx === 1 ? "violet" : "amber"}
                  className={`p-7 sm:p-8 flex flex-col justify-between border ${
                    isFirst 
                      ? 'border-[#00BCF2] bg-[#0B1220]/95 shadow-[0_0_35px_rgba(0,188,242,0.25)]' 
                      : 'border-[rgba(0,188,242,0.18)] hover:border-[#00BCF2]/60 bg-[#0B1220]/90 shadow-xl'
                  } rounded-none h-full transition-all duration-300 hover:-translate-y-2`}
                  withHudCorners={true}
                >
                  <div>
                    {/* Rank Badge & Label */}
                    <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[rgba(0,188,242,0.12)]">
                      <span className="text-xs font-mono-hud text-[#22D3EE] flex items-center gap-1.5 font-bold">
                        {isFirst && <Crown className="w-3.5 h-3.5 text-[#00BCF2]" />}
                        {tier.rank.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-mono-hud px-2.5 py-0.5 border ${
                        isFirst 
                          ? 'border-[#00BCF2] bg-[#071426] text-[#22D3EE] font-black' 
                          : 'border-[rgba(0,188,242,0.3)] bg-[#020617] text-[#94A3B8] font-semibold'
                      }`}>
                        {tier.badge}
                      </span>
                    </div>

                    {/* Prize Amount */}
                    <div className="mb-4">
                      <div className="text-4xl sm:text-5xl font-mono-hud font-black text-white tracking-tight">
                        <AnimatedCounter value={tier.amount} duration={1500} />
                      </div>
                      <div className="text-xs font-mono-hud text-[#94A3B8] mt-1 font-semibold">
                        {tier.label}
                      </div>
                    </div>

                    {/* Perks List */}
                    <div className="space-y-2.5 my-6">
                      <span className="text-[10px] font-mono-hud text-[#22D3EE] uppercase tracking-wider block font-semibold">
                        ALLOCATED REWARDS:
                      </span>
                      <ul className="space-y-2">
                        {tier.perks.map((perk, i) => (
                          <li key={i} className="text-xs font-sans text-[#F8FAFC] flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00BCF2] shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3.5 border-t border-[rgba(0,188,242,0.12)] flex items-center justify-between text-[10px] font-mono-hud text-[#94A3B8]">
                    <span>STATUS: ALLOCATED</span>
                    <span className="text-white font-bold">{tier.amount} CASH GRANT</span>
                  </div>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Special Track Bounties Grid */}
        <ScrollReveal direction="up" delay={200} duration={600} className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#00BCF2]" />
            <h3 className="text-xs sm:text-sm font-mono-hud text-[#F8FAFC] font-bold tracking-widest uppercase">
              SPECIAL TRACK REWARD BOUNTIES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {SPECIAL_TRACK_BOUNTIES.map((bounty, idx) => {
              const Icon = bountyIcons[idx] || Cpu;

              return (
                <div
                  key={idx}
                  className="p-5 bg-[#0B1220] border border-[rgba(0,188,242,0.15)] hover:border-[#00BCF2]/60 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-[#020617] border border-[#00BCF2]/30 text-[#22D3EE] shadow-sm group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono-hud text-[#22D3EE] bg-[#071426] px-2 py-0.5 border border-[#00BCF2]/30 font-bold">
                        BOUNTY
                      </span>
                    </div>

                    <h4 className="text-sm font-display font-bold text-white mb-1.5 group-hover:text-[#BAE6FD] transition-colors">
                      {bounty.title}
                    </h4>

                    <p className="text-xs text-[#94A3B8] font-sans leading-relaxed font-normal">
                      {bounty.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(0,188,242,0.12)] text-[10px] font-mono-hud text-[#22D3EE] font-semibold">
                    {bounty.reward}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
