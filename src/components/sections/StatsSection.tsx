'use client';

import React from 'react';
import { Trophy, CreditCard, Users, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { EVENT_METRICS } from '../../data/orionData';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Trophy,
      value: EVENT_METRICS.prizePool,
      label: "TOTAL CASH PRIZE POOL",
      subtext: "1st: ₹25k • 2nd: ₹15k • 3rd: ₹10k + Bounties",
      glowColor: "cyan" as const,
      accentText: "text-[#38BDF8]",
      badge: "REWARD ORBIT"
    },
    {
      icon: CreditCard,
      value: EVENT_METRICS.round1Fee,
      label: "ROUND 1 FLAT TEAM FEE",
      subtext: "Flat fee for 2 to 6 member squads",
      glowColor: "cyan" as const,
      accentText: "text-emerald-400",
      badge: "ROUND 1 ACCESS"
    },
    {
      icon: ShieldCheck,
      value: EVENT_METRICS.finalistCount,
      label: "FINALIST SQUADS TO SIST",
      subtext: "Shortlisted for 24-hour offline mission arena",
      glowColor: "violet" as const,
      accentText: "text-[#60A5FA]",
      badge: "OFFLINE FINALE"
    },
    {
      icon: Users,
      value: EVENT_METRICS.teamSize,
      label: "MEMBERS PER SQUAD",
      subtext: "Cross-institutional & multidisciplinary squads",
      glowColor: "amber" as const,
      accentText: "text-[#BAE6FD]",
      badge: "CREW SIZE"
    }
  ];

  return (
    <section id="stats" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delay={idx * 100}
              duration={600}
              className="h-full"
            >
              <GlassCard
                glowColor={stat.glowColor}
                className="p-6 sm:p-7 border border-[rgba(212,233,255,0.14)] hover:border-[#38BDF8]/60 flex flex-col justify-between h-full group bg-[#07193D]/90 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(4,14,36,0.8)]"
                withHudCorners={true}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[rgba(212,233,255,0.1)]">
                    <div className={`p-2.5 bg-[#0B2556] border border-[#38BDF8]/40 ${stat.accentText} group-hover:scale-110 group-hover:border-[#38BDF8] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all shadow-sm`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono-hud text-[#38BDF8] bg-[#040E24] px-2 py-0.5 border border-[#38BDF8]/30 font-bold tracking-wider">
                      {stat.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl md:text-5xl font-mono-hud font-black tracking-tight text-white mb-2 group-hover:text-[#BAE6FD] transition-colors">
                    <AnimatedCounter value={stat.value} duration={1500} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-display font-bold tracking-wider text-[#F8FAFC] uppercase mb-1.5">
                    {stat.label}
                  </h3>
                  <p className="text-xs font-sans text-[#7DD3FC] leading-relaxed font-normal mb-4">
                    {stat.subtext}
                  </p>

                  <div className="w-full h-1 bg-[#040E24] border border-[rgba(212,233,255,0.1)] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] group-hover:w-full transition-all duration-500"
                      style={{ width: `${(idx + 1) * 25}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
