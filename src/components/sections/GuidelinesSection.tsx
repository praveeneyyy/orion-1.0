'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Scale, 
  FileText,
  Sparkles,
  Target,
  Mic,
  Cpu
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { EVENT_METRICS, JUDGING_CRITERIA } from '../../data/orionData';

export const GuidelinesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phases' | 'submission' | 'judging'>('phases');

  return (
    <section id="guidelines" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-3xl mx-auto mb-10 select-none">
          <div className="inline-flex items-center gap-2.5 px-4 py-1 bg-gradient-to-r from-transparent via-[#00BCF2]/10 to-transparent border-y border-[#00BCF2]/25 text-xs font-mono font-bold tracking-[0.18em] text-[#BAE6FD] uppercase mb-4 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#00BCF2]" />
            <span>MISSION PROTOCOLS // GUIDELINES & CRITERIA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Guidelines</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Everything you need to know about selection phases, submission guidelines, and evaluation criteria.
          </p>
        </ScrollReveal>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-lg">
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'phases'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Event Phases</span>
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'submission'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Submission Rules</span>
            </button>
            <button
              onClick={() => setActiveTab('judging')}
              className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'judging'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>3. Judging Criteria</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Phases */}
        {activeTab === 'phases' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto text-left animate-in fade-in duration-300">
            {/* Phase 1 Card */}
            <GlassCard
              glowColor="cyan"
              className="p-8 border border-slate-800 bg-slate-900/60 rounded-2xl flex flex-col justify-between h-full shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <span className="text-xs font-sans text-blue-400 font-bold">PHASE 01 // QUALIFIER</span>
                  <span className="text-xs font-sans bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold">
                    ACTIVE NOW
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-black text-white mb-2">
                  Round 1: Online Qualifier
                </h3>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-display font-black text-white">
                    <AnimatedCounter value={EVENT_METRICS.round1Fee} duration={1500} />
                  </span>
                  <span className="text-xs font-sans text-slate-400 font-semibold">Flat per Team (2–6 Members)</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-5">
                  Submit your problem statement choice, system architecture, and solution proposal using the standardized PPT template.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6 font-sans">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Flat ₹100 registration fee regardless of team size (2 to 6 builders)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Choose from 3 Flagship Problem Statements OR Open Innovation tracks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Expert jury screening and pan-India ranking</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs font-sans text-slate-400 flex items-center justify-between">
                <span>Deadline: {EVENT_METRICS.deadlineDate}</span>
                <span className="text-white font-semibold">Online Submission</span>
              </div>
            </GlassCard>

            {/* Phase 2 Card */}
            <GlassCard
              glowColor="violet"
              className="p-8 border border-blue-500/30 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl flex flex-col justify-between h-full shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <span className="text-xs font-sans text-blue-400 font-bold">PHASE 02 // GRAND FINALE</span>
                  <span className="text-xs font-sans bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                    TOP 70 TEAMS ONLY
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-black text-white mb-2">
                  Round 2: 24H Offline Sprint
                </h3>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-display font-black text-white">
                    <AnimatedCounter value={EVENT_METRICS.finalistFee} duration={1500} />
                  </span>
                  <span className="text-xs font-sans text-slate-400 font-semibold">Per Head (Finalists Only)</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-5">
                  Only shortlisted Top 70 teams confirm slots for the 24-hour sprint at SIST Chennai. Fee covers meals, lodging, and swags.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6 font-sans">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>2 Breakfasts, 2 Lunches & midnight snacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Free on-campus hostel accommodation for outstation teams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Official ORION 1.0 Swag Kits, tees, stickers & badges</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs font-sans text-slate-400 flex items-center justify-between">
                <span>Venue: SIST Chennai</span>
                <span className="text-blue-400 font-bold">₹1,00,000 Prizes</span>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab 2: Submission */}
        {activeTab === 'submission' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
            <GlassCard glowColor="cyan" className="p-8 border border-slate-800 bg-slate-900/60 rounded-2xl shadow-xl">
              <h3 className="text-xl font-display font-bold text-white mb-4 border-b border-slate-800 pb-3">
                Round 1 Submission Instructions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-sans">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold text-sm">Standardized PPT Template</strong>
                      All teams must use the official 5-slide template detailing Problem Statement, Solution Architecture, Tech Stack, Feasibility, and Impact.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold text-sm">Team Size & Fee</strong>
                      2 to 6 members per team. Flat ₹100 per team registration fee payable during Round 1 registration.
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-sans">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold text-sm">GitHub / Video Demo (Optional)</strong>
                      Including a public GitHub prototype link or a 2-minute video explanation awards bonus evaluation points.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold text-sm">Shortlist Notification</strong>
                      Top 70 finalist squads will receive official invitation letters & instructions for the Round 2 offline sprint at SIST Chennai.
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab 3: Judging Criteria */}
        {activeTab === 'judging' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto text-left animate-in fade-in duration-300">
            {JUDGING_CRITERIA.map((crit, idx) => {
              const icons = [Sparkles, Layers, Target, Mic];
              const Icon = icons[idx] || Sparkles;
              const shortSummaries = [
                "Algorithmic ingenuity, creative novelty & distinct value proposition.",
                "System robustness, code modularity & architectural design depth.",
                "Real-world market viability, cost model & operational impact.",
                "5-slide blueprint defense, demo clarity & live technical jury Q&A."
              ];

              return (
                <div
                  key={crit.number}
                  className="group relative p-6 bg-[#0B1220]/85 border border-white/10 hover:border-[#00BCF2]/60 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(0,188,242,0.12)] flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#00BCF2]/10 border border-[#00BCF2]/25 text-[#00BCF2] group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          CRITERION {crit.number}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#00BCF2]/15 text-[#BAE6FD] border border-[#00BCF2]/30">
                        {crit.weightLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-display font-bold text-white group-hover:text-[#00BCF2] transition-colors mb-2 tracking-tight">
                      {crit.name}
                    </h3>

                    {/* Crisp Tagline */}
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {shortSummaries[idx]}
                    </p>
                  </div>

                  {/* Telemetry Progress Bar */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                      WEIGHTAGE
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 sm:w-20 h-1.5 bg-slate-950 overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-gradient-to-r from-[#BAE6FD] to-[#00BCF2]"
                          style={{ width: `${crit.weight * 3.33}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{crit.weight}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
