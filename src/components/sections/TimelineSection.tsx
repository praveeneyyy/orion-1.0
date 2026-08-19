'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Rocket, 
  CheckCircle2, 
  AlertCircle, 
  Flag,
  Sparkles,
  MapPin
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { TIMELINE_PHASES } from '../../data/orionData';

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3 shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>MISSION SCHEDULE // FLIGHT TRAJECTORY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            TRAJECTORY <span className="text-gradient-frost-azure">TIMELINE</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Key operational milestones from squad intake to the offline grand finale at SIST Chennai.
          </p>
        </ScrollReveal>

        {/* Timeline Path */}
        <div className="max-w-4xl mx-auto relative text-left">
          
          {/* Vertical Trajectory Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#103374] -translate-x-1/2 hidden sm:block shadow-[0_0_8px_rgba(56,189,248,0.4)]" />

          <div className="space-y-8 relative">
            {TIMELINE_PHASES.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const isCurrent = item.status === 'active';

              return (
                <ScrollReveal
                  key={idx}
                  direction={isEven ? "left" : "right"}
                  delay={idx * 100}
                  duration={650}
                  className={`flex flex-col sm:flex-row items-center gap-6 ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Content Card */}
                  <div className="w-full sm:w-[calc(50%-2rem)]">
                    <GlassCard
                      glowColor={isCurrent ? 'cyan' : 'violet'}
                      className={`p-6 border bg-[#07193D]/90 rounded-none transition-all duration-300 hover:-translate-y-1 ${
                        isCurrent 
                          ? 'border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.25)]' 
                          : 'border-[rgba(212,233,255,0.14)] hover:border-[#38BDF8]/40 shadow-xl'
                      }`}
                      withHudCorners={true}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(212,233,255,0.1)]">
                        <span className="text-xs font-mono-hud text-[#38BDF8] font-bold">
                          PHASE {item.number}
                        </span>
                        <span className={`text-[10px] font-mono-hud px-2.5 py-0.5 rounded-none font-bold ${
                          isCurrent
                            ? 'bg-[#38BDF8] text-[#040E24] shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                            : 'bg-[#0B2556] text-[#7DD3FC] border border-[rgba(212,233,255,0.1)]'
                        }`}>
                          {item.date}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-display font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      <div className="text-xs font-mono-hud text-[#38BDF8] mb-3">
                        {item.subtitle}
                      </div>

                      <ul className="space-y-1.5 text-xs text-[#BAE6FD] font-sans">
                        {item.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <span className="text-[#38BDF8] font-mono-hud text-xs">›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </div>

                  {/* Central Node Badge */}
                  <div className="z-20 shrink-0 w-8 h-8 rounded-none bg-[#07193D] border border-[#38BDF8] flex items-center justify-center text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.4)] hidden sm:flex">
                    {isCurrent ? (
                      <span className="w-2.5 h-2.5 bg-[#38BDF8] animate-ping" />
                    ) : (
                      <span className="w-2 h-2 bg-[#38BDF8]" />
                    )}
                  </div>

                  {/* Empty Spacer Column for layout symmetry */}
                  <div className="w-full sm:w-[calc(50%-2rem)] hidden sm:block" />

                </ScrollReveal>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
