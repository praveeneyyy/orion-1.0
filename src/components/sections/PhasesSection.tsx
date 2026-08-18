'use client';

import React from 'react';
import { 
  Layers, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { EVENT_METRICS } from '../../data/orionData';

export const PhasesSection: React.FC = () => {
  return (
    <section id="phases" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>TWO-TIER SELECTION PROTOCOL // TRANSPARENT FEES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            MISSION <span className="text-gradient-frost-azure">PHASES</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            A low-barrier qualifier designed to discover top engineering minds across India, followed by a fully-catered 24-hour sprint at SIST Chennai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
          
          {/* Phase 1 Card */}
          <GlassCard
            glowColor="cyan"
            className="p-6 sm:p-8 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none flex flex-col justify-between"
            withHudCorners={true}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(212,233,255,0.12)]">
                <span className="text-xs font-mono-hud text-[#7DD3FC]">PHASE 01 // QUALIFIER</span>
                <span className="text-xs font-mono-hud bg-[#0B2556] text-[#38BDF8] px-2.5 py-1 rounded-none border border-[#38BDF8]/40 font-bold">
                  ACTIVE NOW
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
                ROUND 1: ONLINE LAUNCHPAD
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-mono-hud font-black text-white">{EVENT_METRICS.round1Fee}</span>
                <span className="text-xs font-mono-hud text-[#38BDF8]">FLAT PER TEAM (2–6 MEMBERS)</span>
              </div>

              <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed mb-6 font-normal">
                Submit your problem statement choice, system architecture, and solution proposal using the mandatory standardized 5-slide PPT template.
              </p>

              <div className="space-y-2.5 mb-6">
                <span className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase block font-semibold">
                  ROUND 1 INCLUDES:
                </span>
                <ul className="space-y-2 text-xs text-[#BAE6FD]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Flat ₹100 registration fee regardless of team size (2 to 6 builders)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Choose from 3 Flagship Problem Statements OR Open Innovation tracks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Expert jury screening and pan-India ranking</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#7DD3FC] flex items-center justify-between">
              <span>DEADLINE: {EVENT_METRICS.deadlineDate.toUpperCase()}</span>
              <span className="text-white">ONLINE SUBMISSION</span>
            </div>
          </GlassCard>

          {/* Phase 2 Card */}
          <GlassCard
            glowColor="violet"
            className="p-6 sm:p-8 border border-[#38BDF8]/50 bg-gradient-to-b from-[#0B2556] to-[#07193D] rounded-none flex flex-col justify-between shadow-2xl"
            withHudCorners={true}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(212,233,255,0.12)]">
                <span className="text-xs font-mono-hud text-[#7DD3FC]">PHASE 02 // GRAND FINALE</span>
                <span className="text-xs font-mono-hud bg-[#38BDF8] text-[#040E24] px-2.5 py-1 rounded-none font-bold">
                  TOP 70 SQUADS ONLY
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
                ROUND 2: 24H OFFLINE SPRINT
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-mono-hud font-black text-white">{EVENT_METRICS.finalistFee}</span>
                <span className="text-xs font-mono-hud text-[#38BDF8]">PER HEAD (FINALISTS ONLY)</span>
              </div>

              <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed mb-6 font-normal">
                Only shortlisted Top 70 teams confirm slots for the 24-hour sprint at SIST Chennai. Fee directly covers comprehensive meals, lodging, and swags.
              </p>

              <div className="space-y-2.5 mb-6">
                <span className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase block font-semibold">
                  ALL-INCLUSIVE FINALIST PERKS:
                </span>
                <ul className="space-y-2 text-xs text-[#BAE6FD]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>2 Breakfasts, 2 Lunches, 1 Grand Dinner & midnight snacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Free on-campus hostel accommodation for out-of-Chennai teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Official ORION 1.0 Swag Kits, tees, stickers, badges & LAN stations</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#7DD3FC] flex items-center justify-between">
              <span>VENUE: SATHYABAMA CAMPUS</span>
              <span className="text-[#38BDF8] font-bold">₹1,00,000 PRIZES</span>
            </div>
          </GlassCard>

        </div>

      </div>
    </section>
  );
};
