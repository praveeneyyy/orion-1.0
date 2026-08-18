'use client';

import React from 'react';
import { Users, GraduationCap, Phone, Sparkles } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { CHIEF_PATRONS, CONVENORS, MICROSOFT_OFFICE_BEARERS } from '../../data/orionData';

export const LeadershipSection: React.FC = () => {
  return (
    <section id="leadership" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL LEADERSHIP & STUDENT COMMAND</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            MISSION <span className="text-gradient-frost-azure">LEADERSHIP</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Under the visionary patronage of Sathyabama Institute of Science and Technology and the executive stewardship of Microsoft Club SIST.
          </p>
        </div>

        {/* Chief Patrons Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-[#38BDF8]" />
            <h3 className="text-xs sm:text-sm font-mono-hud text-[#F8FAFC] font-bold tracking-widest uppercase">
              CHIEF PATRONS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {CHIEF_PATRONS.map((patron, idx) => (
              <GlassCard
                key={idx}
                glowColor="cyan"
                className="p-5 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-none bg-[#040E24] border border-[#38BDF8]/40 flex items-center justify-center font-display font-black text-base text-white mb-3 shadow-md">
                  {patron.initials}
                </div>

                <span className="text-[10px] font-mono-hud text-[#38BDF8] bg-[#0B2556] px-2 py-0.5 border border-[#38BDF8]/40 rounded-none mb-2 font-semibold">
                  {patron.roleType.toUpperCase()}
                </span>

                <h4 className="text-sm font-display font-bold text-white mb-1">
                  {patron.name}
                </h4>
                <div className="text-xs font-mono-hud text-[#38BDF8] mb-1 font-semibold">
                  {patron.title}
                </div>
                <div className="text-[11px] font-sans text-[#7DD3FC]">
                  {patron.organization}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Academic Convenors Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs sm:text-sm font-mono-hud text-[#F8FAFC] font-bold tracking-widest uppercase">
              ACADEMIC CONVENORS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
            {CONVENORS.map((conv, idx) => (
              <GlassCard
                key={idx}
                glowColor="violet"
                className="p-6 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none flex flex-col justify-between"
                withHudCorners={true}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-none bg-[#040E24] border border-[#38BDF8]/40 flex items-center justify-center font-display font-bold text-sm text-white shrink-0">
                      {conv.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        {conv.name}
                      </h4>
                      <div className="text-xs font-mono-hud text-[#38BDF8] font-medium">
                        {conv.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono-hud text-[#BAE6FD] mb-3 pb-3 border-b border-[rgba(212,233,255,0.12)]">
                    {conv.organization}
                  </div>

                  <p className="text-xs text-[#7DD3FC] font-sans leading-relaxed">
                    {conv.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#38BDF8]">
                  Academic Steering Board • ORION 1.0
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Microsoft Office Bearers Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs sm:text-sm font-mono-hud text-[#F8FAFC] font-bold tracking-widest uppercase">
              MICROSOFT OFFICE BEARERS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto text-left">
            {MICROSOFT_OFFICE_BEARERS.map((bearer, idx) => (
              <GlassCard
                key={idx}
                glowColor="cyan"
                className="p-6 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none flex flex-col justify-between"
                withHudCorners={true}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-none bg-[#040E24] border border-[#38BDF8]/40 flex items-center justify-center font-display font-bold text-sm text-white shrink-0">
                      {bearer.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        {bearer.name}
                      </h4>
                      <div className="text-xs font-mono-hud text-[#38BDF8] font-medium">
                        {bearer.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono-hud text-[#BAE6FD] mb-3 pb-3 border-b border-[rgba(212,233,255,0.12)]">
                    {bearer.department}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono-hud text-[#BAE6FD] mb-2">
                    <span className="text-[#7DD3FC] text-[10px]">DIRECT CONTACT:</span>
                    <a
                      href={`tel:${bearer.phone}`}
                      className="flex items-center gap-1 text-[#38BDF8] hover:text-[#BAE6FD] transition-colors bg-[#040E24] px-2 py-0.5 border border-[#38BDF8]/40 rounded-none font-bold"
                    >
                      <Phone className="w-3 h-3 text-[#38BDF8]" />
                      <span>{bearer.phone}</span>
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#38BDF8] flex items-center justify-between">
                  <span>Student Executive Council</span>
                  <span className="text-[#7DD3FC]">{bearer.organization}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
