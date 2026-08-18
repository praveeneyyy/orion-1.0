'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layout, 
  HardDrive, 
  Presentation,
  ShieldAlert
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ElectricBorder } from '../common/ElectricBorder';
import { PRIZE_TIERS, SPECIAL_TRACK_BOUNTIES, EVENT_METRICS } from '../../data/orionData';

// Dynamic 3D Trophy Showcase
const Trophy3D = dynamic(
  () => import('../3d/Trophy3D').then((mod) => mod.Trophy3D),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center font-mono-hud text-xs text-[#7DD3FC]">LOADING TROPHY HOLOGRAPHICS...</div> }
);

export const PrizeSection: React.FC = () => {
  const bountyIcons = [Cpu, Layout, HardDrive, Presentation];

  return (
    <section id="prizes" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>MISSION REWARDS & BOUNTIES // CASH POOL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            ₹1,00,000 <span className="text-gradient-frost-azure">PRIZE ORBIT</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Honoring elite technical execution, architectural robustness, and disruptive engineering across student and developer squads.
          </p>
        </div>

        {/* 3D Trophy Showcase Hologram */}
        <div className="max-w-2xl mx-auto mb-16">
          <ElectricBorder
            color="#38BDF8"
            speed={0.6}
            chaos={0.06}
            thickness={1.5}
            className="w-full"
          >
            <div className="p-4 sm:p-6 bg-[#07193D]/95 backdrop-blur-xl border border-[rgba(212,233,255,0.16)] flex flex-col items-center text-center">
              <div className="text-xs font-mono-hud text-[#38BDF8] font-bold mb-1 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#38BDF8]" />
                ORION 1.0 GRAND CHAMPION AEROSPACE TROPHY // 3D HOLOGRAPHIC SCAN
              </div>
              <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                <Trophy3D />
              </div>
              <div className="text-[10px] font-mono-hud text-[#7DD3FC]">
                INTERACTIVE 3D TROPHY // DRAG TO ROTATE & INSPECT GOLD AEROSPACE FINISH
              </div>
            </div>
          </ElectricBorder>
        </div>

        {/* 3 Podium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16 items-stretch text-left">
          {PRIZE_TIERS.map((tier, idx) => {
            const isFirst = idx === 0;

            return (
              <GlassCard
                key={idx}
                glowColor={isFirst ? 'cyan' : 'violet'}
                className={`p-6 sm:p-8 flex flex-col justify-between border bg-[#07193D]/90 rounded-none ${
                  isFirst 
                    ? 'border-[#38BDF8]/60 bg-gradient-to-b from-[#0B2556] to-[#07193D] shadow-2xl' 
                    : 'border-[rgba(212,233,255,0.14)]'
                }`}
                withHudCorners={true}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(212,233,255,0.12)]">
                    <span className="text-xs font-mono-hud text-[#7DD3FC]">
                      ORION-TIER-0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono-hud px-2 py-0.5 rounded-none font-bold ${
                      isFirst 
                        ? 'bg-[#38BDF8] text-[#040E24]' 
                        : 'bg-[#0B2556] text-[#BAE6FD] border border-[rgba(212,233,255,0.14)]'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>

                  <div className="text-xs font-mono-hud text-[#38BDF8] font-bold mb-1">
                    {tier.label}
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-mono-hud font-black text-white tracking-tight mb-4">
                    {tier.amount}
                  </h3>

                  <div className="space-y-2.5 mb-6">
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase block font-semibold">
                      INCLUDED MISSION GRANTS & PERKS:
                    </span>
                    <ul className="space-y-2">
                      {tier.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="text-xs font-sans text-[#BAE6FD] flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#7DD3FC] flex items-center justify-between">
                  <span>DISBURSED AT VALEDICTORY</span>
                  <span className="text-white font-bold">{tier.rank}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Special Track Bounties & Badges Grid */}
        <div className="max-w-6xl mx-auto text-left">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs sm:text-sm font-mono-hud text-[#F8FAFC] font-bold tracking-widest uppercase">
              SPECIAL TRACK MERIT BOUNTIES & BADGES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SPECIAL_TRACK_BOUNTIES.map((bounty, idx) => {
              const Icon = bountyIcons[idx] || Sparkles;

              return (
                <GlassCard
                  key={idx}
                  glowColor="cyan"
                  className="p-5 border border-[rgba(212,233,255,0.12)] bg-[#07193D]/90 rounded-none flex flex-col justify-between"
                  withHudCorners={true}
                >
                  <div>
                    <div className="p-2 w-fit rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] mb-3">
                      <Icon className="w-4 h-4" />
                    </div>

                    <h4 className="text-sm font-display font-bold text-white mb-1.5">
                      {bounty.title}
                    </h4>

                    <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed mb-3">
                      {bounty.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[rgba(212,233,255,0.1)] text-[10px] font-mono-hud text-[#38BDF8] font-semibold">
                    {bounty.reward}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
