'use client';

import React from 'react';
import { Terminal, Shield, Code, Cpu } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { CLUB_LEADERSHIP } from '../../data/orionData';

export const MissionCommandSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-slate-900 border border-white/10 text-xs font-mono-hud text-cyan-400 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>ORGANIZING BODY // MICROSOFT CLUB SIST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white">
            MISSION <span className="text-cyan-400">COMMAND</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-sans">
            Engineered, organized, and executed by Microsoft Club SIST — empowering next-generation technical pioneers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
          {CLUB_LEADERSHIP.map((lead, idx) => (
            <GlassCard
              key={idx}
              glowColor="cyan"
              className="p-6 border border-white/10 bg-[#070C1B] rounded-none flex flex-col justify-between"
              withHudCorners={true}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-none bg-[#050914] border border-slate-700 flex items-center justify-center font-display font-bold text-sm text-cyan-300 shrink-0">
                    {idx === 0 ? <Shield className="w-5 h-5" /> : idx === 1 ? <Code className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-white">
                      {lead.name}
                    </h4>
                    <div className="text-xs font-mono-hud text-cyan-400 font-medium">
                      {lead.title}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono-hud text-slate-400 mb-3 pb-3 border-b border-slate-800">
                  {lead.organization}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {lead.bio}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono-hud text-cyan-300 flex items-center justify-between">
                <span>OPERATIONAL CORE</span>
                <span className="w-1.5 h-1.5 bg-emerald-400" />
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};
