'use client';

import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Sparkles, 
  Phone 
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { 
  CHIEF_PATRONS, 
  CONVENORS, 
  MICROSOFT_OFFICE_BEARERS 
} from '../../data/orionData';

export const OrganizersSection: React.FC = () => {
  return (
    <section id="organizers" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Main Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-sans font-semibold text-blue-400 mb-4 shadow-sm">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Organizing Committee & Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Organizers</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Under the visionary patronage of Sathyabama Institute of Science and Technology and executive stewardship of Microsoft Club SIST.
          </p>
        </ScrollReveal>

        {/* Section 1: Patrons & Convenors */}
        <div className="space-y-10">
          <ScrollReveal direction="up" delay={100} duration={600}>
            
            {/* Primary Subheading */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tracking-wide">
                  Patrons & Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Convenors</span>
                </h3>
              </div>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>

            {/* Patrons Grid */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h4 className="text-xs sm:text-sm font-sans text-blue-400 font-bold tracking-widest uppercase">
                  CHIEF PATRONS
                </h4>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                {CHIEF_PATRONS.map((patron, idx) => (
                  <GlassCard
                    key={idx}
                    glowColor="cyan"
                    className="p-5 border border-slate-800 bg-slate-900/60 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-display font-black text-sm text-blue-400 mb-3 shadow-sm">
                      {patron.initials}
                    </div>
                    <h5 className="text-xs sm:text-sm font-display font-bold text-white mb-1">
                      {patron.name}
                    </h5>
                    <div className="text-xs font-sans text-blue-400 font-medium">
                      {patron.title}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Convenors Grid */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h4 className="text-xs sm:text-sm font-sans text-blue-400 font-bold tracking-widest uppercase">
                  ACADEMIC CONVENORS
                </h4>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
                {CONVENORS.map((conv, idx) => (
                  <GlassCard
                    key={idx}
                    glowColor="violet"
                    className="p-6 border border-slate-800 bg-slate-900/60 rounded-2xl shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-display font-bold text-sm text-blue-400 shrink-0">
                        {conv.initials}
                      </div>
                      <div>
                        <h5 className="text-sm font-display font-bold text-white">
                          {conv.name}
                        </h5>
                        <div className="text-xs font-sans text-blue-400 font-medium">
                          {conv.title}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {conv.bio}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Section 2: Office Bearers */}
        <div className="pt-10 border-t border-slate-800">
          <ScrollReveal direction="up" delay={150} duration={600}>
            
            {/* Primary Subheading */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tracking-wide">
                  Microsoft <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Office Bearers</span>
                </h3>
              </div>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
              {MICROSOFT_OFFICE_BEARERS.map((bearer, idx) => (
                <GlassCard
                  key={idx}
                  glowColor="cyan"
                  className="p-6 border border-slate-800 bg-slate-900/60 rounded-2xl shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-display font-bold text-sm text-blue-400 shrink-0">
                      {bearer.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        {bearer.name}
                      </h4>
                      <div className="text-xs font-sans text-blue-400 font-medium">
                        {bearer.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-sans text-slate-300">
                    <span className="text-slate-400 text-xs font-semibold">Direct Contact:</span>
                    <a
                      href={`tel:${bearer.phone}`}
                      className="flex items-center gap-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 px-3 py-1 rounded-lg border border-blue-500/20 font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{bearer.phone}</span>
                    </a>
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
