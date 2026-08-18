'use client';

import React from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { TIMELINE_PHASES } from '../../data/orionData';

export const TimelineSection: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>MISSION FLIGHT SCHEDULE // KEY DATES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            TRAJECTORY <span className="text-gradient-frost-azure">TIMELINE</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Mark critical launch windows from Round 1 registrations to the 24-hour Grand Finale sprint in Chennai.
          </p>
        </div>

        {/* Vertical Timeline Stack */}
        <div className="space-y-6 max-w-4xl mx-auto text-left">
          {TIMELINE_PHASES.map((phase, idx) => {
            const isActive = phase.status === 'active';

            return (
              <GlassCard
                key={idx}
                glowColor={isActive ? 'cyan' : 'violet'}
                className={`p-6 sm:p-8 border rounded-none transition-all ${
                  isActive 
                    ? 'border-[#38BDF8] bg-gradient-to-b from-[#0B2556] to-[#07193D] shadow-2xl' 
                    : 'border-[rgba(212,233,255,0.14)] bg-[#07193D]/90'
                }`}
                withHudCorners={true}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[rgba(212,233,255,0.12)]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-none flex items-center justify-center font-mono-hud font-black text-sm ${
                      isActive 
                        ? 'bg-[#38BDF8] text-[#040E24]' 
                        : 'bg-[#0B2556] text-[#38BDF8] border border-[#38BDF8]/40'
                    }`}>
                      {phase.number}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                        {phase.title}
                      </h3>
                      <div className="text-xs font-mono-hud text-[#38BDF8]">
                        {phase.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-hud text-[#7DD3FC] flex items-center gap-1.5 bg-[#040E24] px-3 py-1 border border-[rgba(212,233,255,0.1)] rounded-none">
                      <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                      {phase.date}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono-hud bg-[#38BDF8] text-[#040E24] px-2 py-1 rounded-none font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {phase.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="text-xs text-[#BAE6FD] font-sans flex items-start gap-2">
                      <span className="text-[#38BDF8] font-mono-hud text-xs">›</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
