'use client';

import React from 'react';
import { 
  Users, 
  Phone 
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { 
  CHIEF_PATRONS, 
  ACADEMIC_PATRONS, 
  EVENT_ORGANIZERS 
} from '../../data/orionData';

export const OrganizersSection: React.FC = () => {
  return (
    <section id="organizers" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Main Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto select-none">
          <div className="inline-flex items-center gap-2.5 px-4 py-1 bg-gradient-to-r from-transparent via-[#00BCF2]/10 to-transparent border-y border-[#00BCF2]/25 text-xs font-mono font-bold tracking-[0.18em] text-[#BAE6FD] uppercase mb-4 shadow-sm">
            <Users className="w-3.5 h-3.5 text-[#00BCF2]" />
            <span>ORGANIZING COMMITTEE // LEADERSHIP CORE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Patrons & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Organizers</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Under the visionary patronage of Sathyabama Institute of Science and Technology, academic guidance, and student leadership command.
          </p>
        </ScrollReveal>

        {/* Section 1: Chief Patrons */}
        <div className="space-y-8">
          <ScrollReveal direction="up" delay={100} duration={600}>
            
            {/* Chief Patrons Heading */}
            <div className="flex flex-col items-center text-center mb-8 select-none">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 mb-2 bg-[#0078D4]/10 border border-[#0078D4]/30 text-[10px] font-mono font-bold tracking-[0.2em] text-[#BAE6FD] uppercase">
                INSTITUTIONAL LEADERSHIP
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                Chief <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAE6FD] via-[#00BCF2] to-[#38BDF8]">Patrons</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-lg mt-2">
                Visionary institutional leadership guiding academic excellence at Sathyabama Institute of Science and Technology.
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#00BCF2] to-transparent mt-3" />
            </div>

            {/* Chief Patrons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {CHIEF_PATRONS.map((patron, idx) => (
                <div
                  key={idx}
                  className="p-5 border border-white/10 hover:border-[#00BCF2]/50 bg-[#0B1220]/80 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-[#071426] border border-[#00BCF2]/30 flex items-center justify-center font-mono font-bold text-sm text-[#00BCF2] mb-3 shadow-sm">
                    {patron.initials}
                  </div>
                  <h5 className="text-xs sm:text-sm font-display font-bold text-white mb-1 tracking-tight">
                    {patron.name}
                  </h5>
                  <div className="text-xs font-sans text-[#00BCF2] font-semibold mb-1">
                    {patron.title}
                  </div>
                  <div className="text-[11px] font-sans text-slate-400 leading-tight">
                    {patron.organization}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Section 2: Academic Patrons */}
        <div className="pt-12 border-t border-white/10">
          <ScrollReveal direction="up" delay={120} duration={600}>
            
            {/* Academic Patrons Heading */}
            <div className="flex flex-col items-center text-center mb-8 select-none">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 mb-2 bg-[#00BCF2]/10 border border-[#00BCF2]/30 text-[10px] font-mono font-bold tracking-[0.2em] text-[#BAE6FD] uppercase">
                ACADEMIC & RESEARCH GOVERNANCE
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAE6FD] via-[#00BCF2] to-[#38BDF8]">Patrons</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-lg mt-2">
                Distinguished deans and department heads steering computing innovation, curriculum, and hackathon mentorship.
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#00BCF2] to-transparent mt-3" />
            </div>

            {/* Academic Patrons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              {ACADEMIC_PATRONS.map((patron, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-white/10 hover:border-[#00BCF2]/50 bg-[#0B1220]/80 transition-all duration-300 shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#071426] border border-[#00BCF2]/30 flex items-center justify-center font-mono font-bold text-sm text-[#00BCF2] shrink-0">
                      {patron.initials}
                    </div>
                    <div>
                      <h5 className="text-sm font-display font-bold text-white tracking-tight">
                        {patron.name}
                      </h5>
                      <div className="text-xs font-sans text-[#00BCF2] font-semibold">
                        {patron.title}
                      </div>
                      <div className="text-[11px] font-sans text-slate-400">
                        {patron.organization}
                      </div>
                    </div>
                  </div>
                  {patron.bio && (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2 border-t border-white/10">
                      {patron.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Section 3: Event Organizers */}
        <div className="pt-12 border-t border-white/10">
          <ScrollReveal direction="up" delay={150} duration={600}>
            
            {/* Event Organizers Heading */}
            <div className="flex flex-col items-center text-center mb-8 select-none">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 mb-2 bg-[#00BCF2]/10 border border-[#00BCF2]/30 text-[10px] font-mono font-bold tracking-[0.2em] text-[#BAE6FD] uppercase">
                STUDENT CONVENERS & LEADERSHIP
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAE6FD] via-[#00BCF2] to-[#38BDF8]">Organizers</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-lg mt-2">
                Student coordinators and organizing command executing the ORION 1.0 hackathon operations.
              </p>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#00BCF2] to-transparent mt-3" />
            </div>

            {/* Event Organizers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              {EVENT_ORGANIZERS.map((organizer, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-white/10 hover:border-[#00BCF2]/50 bg-[#0B1220]/80 transition-all duration-300 shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#071426] border border-[#00BCF2]/30 flex items-center justify-center font-mono font-bold text-sm text-[#00BCF2] shrink-0">
                      {organizer.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-white tracking-tight">
                        {organizer.name}
                      </h4>
                      <div className="text-xs font-sans text-[#00BCF2] font-semibold">
                        {organizer.title}
                      </div>
                      <div className="text-[11px] font-sans text-slate-400">
                        {organizer.department}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-sans text-slate-300">
                    <span className="text-slate-400 text-xs font-semibold">Direct Contact:</span>
                    <a
                      href={`tel:${organizer.phone}`}
                      className="flex items-center gap-1.5 text-[#00BCF2] hover:text-white bg-[#00BCF2]/10 hover:bg-[#00BCF2]/30 px-3 py-1 border border-[#00BCF2]/25 font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{organizer.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
