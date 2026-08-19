'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Waves, 
  ShieldCheck, 
  TreePine, 
  Cpu, 
  Layers,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { PROBLEM_STATEMENTS } from '../../data/orionData';
import type { ProblemStatement } from '../../types/orion';
import { sound } from '../../audio/soundEffects';

interface ChallengeArenaProps {
  onOpenProblemModal: (problem: ProblemStatement) => void;
}

export const ChallengeArena: React.FC<ChallengeArenaProps> = ({ onOpenProblemModal }) => {
  const [selectedId, setSelectedId] = useState<string>(PROBLEM_STATEMENTS[0].id);

  const selectedProblem = PROBLEM_STATEMENTS.find((p) => p.id === selectedId) || PROBLEM_STATEMENTS[0];

  const domainIcons: Record<string, React.FC<{ className?: string }>> = {
    floatchat: Waves,
    lexvault: ShieldCheck,
    sylvasense: TreePine,
    'open-innovation': Cpu
  };

  const Icon = domainIcons[selectedProblem.id] || Cpu;

  return (
    <section id="challenges" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0B1220] border border-[#00BCF2]/30 text-xs font-mono-hud text-[#22D3EE] mb-3 shadow-[0_0_15px_rgba(0,188,242,0.2)]">
            <Cpu className="w-3.5 h-3.5" />
            <span>MISSION SPECIFICATIONS // PROBLEM STATEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight">
            CHALLENGE <span className="text-gradient-frost-azure">ARENA</span>
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-2.5 font-sans leading-relaxed">
            Select an engineering challenge below to inspect mission objectives, technical architecture, and submission deliverables.
          </p>
        </ScrollReveal>

        {/* Futuristic Mission Selector Container */}
        <div className="max-w-5xl mx-auto">
          
          {/* Mobile & Tablet Dropdown Selector */}
          <div className="lg:hidden mb-6">
            <label className="text-[11px] font-mono-hud text-[#22D3EE] uppercase tracking-wider block mb-2 font-bold">
              SELECT PROBLEM STATEMENT
            </label>
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedId(e.target.value);
                }}
                className="w-full appearance-none p-3.5 bg-[#0B1220] border border-[#00BCF2]/50 text-white text-xs font-mono-hud focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] pr-10 shadow-lg cursor-pointer"
              >
                {PROBLEM_STATEMENTS.map((prob) => (
                  <option key={prob.id} value={prob.id} className="bg-[#071426] text-white py-2">
                    {prob.code}: {prob.title} — {prob.domain}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#22D3EE] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Interactive List / Selector Bar */}
          <div className="hidden lg:grid grid-cols-4 gap-2.5 mb-8">
            {PROBLEM_STATEMENTS.map((prob) => {
              const isSelected = selectedId === prob.id;
              const TabIcon = domainIcons[prob.id] || Cpu;

              return (
                <button
                  key={prob.id}
                  onClick={() => {
                    sound.playHover();
                    setSelectedId(prob.id);
                  }}
                  className={`text-left p-3.5 border transition-all duration-200 cursor-pointer relative group ${
                    isSelected
                      ? 'bg-[#0B2556] border-[#00BCF2] text-white shadow-[0_0_20px_rgba(0,188,242,0.3)] ring-1 ring-[#00BCF2]'
                      : 'bg-[#0B1220]/90 border-[rgba(0,188,242,0.15)] hover:border-[#00BCF2]/60 hover:bg-[#071426] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {/* Top Active Indicator */}
                  {isSelected && (
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#0078D4] via-[#00BCF2] to-[#22D3EE]" />
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono-hud font-bold tracking-wider ${
                      isSelected ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-[#BAE6FD]'
                    }`}>
                      {prob.code}
                    </span>
                    <TabIcon className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-[#00BCF2]' : 'text-[#64748B] group-hover:text-[#94A3B8]'
                    }`} />
                  </div>

                  <h3 className="text-xs font-display font-black text-white truncate mb-1">
                    {prob.title}
                  </h3>

                  <p className="text-[10px] font-sans text-[#94A3B8] leading-tight line-clamp-2">
                    {prob.domain}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Problem Statement Detail Area */}
          <ScrollReveal direction="up" delay={100} duration={500} className="w-full text-left">
            <GlassCard
              glowColor={selectedProblem.accentColor}
              className="p-6 sm:p-8 md:p-10 border border-[#00BCF2]/40 bg-[#0B1220]/95 shadow-[0_16px_48px_rgba(2,8,24,0.85)] rounded-none relative overflow-hidden"
              withHudCorners={true}
            >
              {/* Top Accent Gradient Glow */}
              <div 
                className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: selectedProblem.accentColor === 'cyan' ? '#00BCF2' : selectedProblem.accentColor === 'emerald' ? '#10B981' : '#8B5CF6' }}
              />

              {/* Main Heading Lockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[rgba(0,188,242,0.15)]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-[#071426] border border-[#00BCF2]/40 text-xs font-mono-hud text-[#22D3EE] font-bold">
                      {selectedProblem.code}
                    </span>
                    <span className="text-[10px] font-mono-hud text-[#94A3B8] uppercase">
                      {selectedProblem.classificationLevel}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                    {selectedProblem.code}: {selectedProblem.title}
                  </h3>
                  
                  <div className="text-xs sm:text-sm font-mono-hud text-[#22D3EE] font-semibold mt-1">
                    {selectedProblem.domain}
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playModalOpen();
                    onOpenProblemModal(selectedProblem);
                  }}
                  className="btn-sheen btn-glow-cyan self-start sm:self-auto py-2.5 px-5 font-display font-bold text-xs tracking-wider text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <span>INSPECT FULL DOSSIER</span>
                  <ArrowUpRight className="w-4 h-4 text-[#020617]" />
                </button>
              </div>

              {/* Problem Statement Overview */}
              <div className="mb-8">
                <span className="text-[11px] font-mono-hud text-[#22D3EE] uppercase tracking-wider block mb-2 font-bold">
                  MISSION BRIEF & PROBLEM DECONSTRUCTION
                </span>
                <p className="text-xs sm:text-sm text-[#F8FAFC] font-sans leading-relaxed font-normal bg-[#071426]/70 p-4 border border-[rgba(0,188,242,0.15)]">
                  {selectedProblem.overview}
                </p>
              </div>

              {/* Two Column Feature & Criteria Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Key Deliverables & Features */}
                <div className="p-5 bg-[#071426] border border-[rgba(0,188,242,0.15)]">
                  <div className="flex items-center gap-2 text-xs font-mono-hud text-[#22D3EE] uppercase font-bold mb-3 pb-2 border-b border-[rgba(0,188,242,0.12)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BCF2]" />
                    <span>KEY DELIVERABLES & FEATURES</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedProblem.keyFeatures.map((feat, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] font-sans flex items-start gap-2">
                        <span className="text-[#00BCF2] font-mono-hud font-bold text-xs">›</span>
                        <span className="text-[#F8FAFC]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evaluation Focus */}
                <div className="p-5 bg-[#071426] border border-[rgba(0,188,242,0.15)]">
                  <div className="flex items-center gap-2 text-xs font-mono-hud text-[#22D3EE] uppercase font-bold mb-3 pb-2 border-b border-[rgba(0,188,242,0.12)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00BCF2]" />
                    <span>EVALUATION BENCHMARKS</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedProblem.evaluationFocus.map((focus, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] font-sans flex items-start gap-2">
                        <span className="text-[#00BCF2] font-mono-hud font-bold text-xs">›</span>
                        <span className="text-[#F8FAFC]">{focus}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Recommended Tech Stack Chips */}
              <div className="pt-4 border-t border-[rgba(0,188,242,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono-hud text-[#94A3B8] uppercase block mb-1.5 font-bold">
                    RECOMMENDED STACK:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProblem.techStack.map((tech, i) => (
                      <span key={i} className="text-[11px] font-mono-hud bg-[#020617] text-[#BAE6FD] px-2.5 py-1 border border-[rgba(0,188,242,0.2)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] font-mono-hud text-[#94A3B8] self-start sm:self-auto shrink-0 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ELIGIBLE FOR ₹1,00,000 PRIZE POOL</span>
                </div>
              </div>

            </GlassCard>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
