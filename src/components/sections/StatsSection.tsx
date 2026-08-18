'use client';

import React from 'react';
import { Trophy, CreditCard, Users, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { EVENT_METRICS } from '../../data/orionData';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Trophy,
      value: EVENT_METRICS.prizePool,
      label: "TOTAL CASH PRIZE POOL",
      subtext: "1st: ₹25k • 2nd: ₹15k • 3rd: ₹10k + Bounties",
      glowColor: "cyan" as const,
      accentText: "text-[#38BDF8]"
    },
    {
      icon: CreditCard,
      value: EVENT_METRICS.round1Fee,
      label: "ROUND 1 FLAT TEAM FEE",
      subtext: "Flat fee for 2 to 6 member squads",
      glowColor: "cyan" as const,
      accentText: "text-emerald-400"
    },
    {
      icon: ShieldCheck,
      value: EVENT_METRICS.finalistCount,
      label: "FINALIST SQUADS TO SIST",
      subtext: "Shortlisted for 24-hour offline mission arena",
      glowColor: "violet" as const,
      accentText: "text-[#60A5FA]"
    },
    {
      icon: Users,
      value: EVENT_METRICS.teamSize,
      label: "MEMBERS PER SQUAD",
      subtext: "Cross-institutional & multidisciplinary squads",
      glowColor: "amber" as const,
      accentText: "text-[#BAE6FD]"
    }
  ];

  return (
    <section id="stats" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, idx) => (
            <GlassCard
              key={idx}
              glowColor={stat.glowColor}
              className="p-6 border border-[rgba(212,233,255,0.14)] flex flex-col justify-between h-full group bg-[#07193D]/90 rounded-none"
              withHudCorners={true}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 ${stat.accentText} group-hover:scale-105 transition-transform shadow-sm`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono-hud text-[#7DD3FC] tracking-wider">
                    SYS-0{idx + 1}
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl md:text-5xl font-mono-hud font-black tracking-tight text-white mb-2 group-hover:text-[#BAE6FD] transition-colors">
                  {stat.value}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-display font-bold tracking-wider text-[#F8FAFC] uppercase mb-1">
                  {stat.label}
                </h3>
                <p className="text-xs font-sans text-[#7DD3FC] leading-relaxed font-normal">
                  {stat.subtext}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
