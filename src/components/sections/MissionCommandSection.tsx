'use client';

import React from 'react';
import { Terminal, Shield, Code, Cpu } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { CLUB_LEADERSHIP } from '../../data/orionData';

export const MissionCommandSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3 shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
            <span>ORGANIZING BODY // MICROSOFT CLUB SIST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white">
            MISSION <span className="text-gradient-frost-azure">COMMAND</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2 font-sans leading-relaxed">
            Engineered, organized, and executed by Microsoft Club SIST — empowering next-generation technical pioneers.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
          {CLUB_LEADERSHIP.map((lead, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delay={idx * 100}
              duration={600}
              className="h-full"
            >
              <GlassCard
                glowColor="cyan"
                className="p-6 border border-[rgba(212,233,255,0.14)] hover:border-[#38BDF8]/50 bg-[#07193D]/90 rounded-none flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 shadow-xl"
                withHudCorners={true}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-none bg-[#040E24] border border-[#38BDF8]/40 flex items-center justify-center font-display font-bold text-sm text-[#38BDF8] shrink-0 shadow-sm">
                      {idx === 0 ? <Shield className="w-5 h-5" /> : idx === 1 ? <Code className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        {lead.name}
                      </h4>
                      <div className="text-xs font-mono-hud text-[#38BDF8] font-medium">
                        {lead.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono-hud text-[#7DD3FC] mb-3 pb-3 border-b border-[rgba(212,233,255,0.12)]">
                    {lead.organization}
                  </div>

                  <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed font-normal">
                    {lead.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#38BDF8] flex items-center justify-between font-semibold">
                  <span>OPERATIONAL CORE</span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
