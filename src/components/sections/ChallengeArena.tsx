'use client';

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Waves, 
  ShieldCheck, 
  TreePine, 
  Cpu, 
  CheckCircle2,
  ChevronDown,
  Layers
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

  return (
    <section id="challenges" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-blue-500/10 border border-blue-500/20 text-xs font-sans font-semibold text-blue-400 mb-4 shadow-sm">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Flagship Hackathon Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight">
            Challenge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Arena</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Select a track below to inspect technical architecture, evaluation benchmarks, and submission deliverables.
          </p>

          {/* Microsoft Ecosystem Integration Callout */}
          <div className="mt-6 p-4 rounded-none bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-center gap-3 text-xs font-sans text-slate-300">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5 w-3 h-3" title="Microsoft">
                <span className="bg-[#F25022] w-1.2 h-1.2 rounded-none" />
                <span className="bg-[#7FBA00] w-1.2 h-1.2 rounded-none" />
                <span className="bg-[#00A4EF] w-1.2 h-1.2 rounded-none" />
                <span className="bg-[#FFB900] w-1.2 h-1.2 rounded-none" />
              </div>
              <span className="font-bold text-white">Microsoft Cloud & AI Stack</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400">Azure AI • GitHub Copilot • Azure Cosmos DB • Microsoft Sentinel</span>
          </div>
        </ScrollReveal>

        {/* Track Selector Container */}
        <div className="max-w-5xl mx-auto">
          
          {/* Mobile & Tablet Dropdown Selector */}
          <div className="lg:hidden mb-6">
            <label className="text-xs font-sans text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
              Select Problem Track
            </label>
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedId(e.target.value);
                }}
                className="w-full appearance-none p-4 rounded-none bg-slate-900 border border-slate-800 text-white text-xs font-sans font-medium focus:outline-none focus:border-blue-500 pr-10 shadow-lg cursor-pointer"
              >
                {PROBLEM_STATEMENTS.map((prob) => (
                  <option key={prob.id} value={prob.id} className="bg-slate-900 text-white py-2">
                    {prob.code}: {prob.title} — {prob.domain}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-blue-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Interactive List / Selector Bar */}
          <div className="hidden lg:grid grid-cols-4 gap-3 mb-8">
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
                  className={`text-left p-4 rounded-none border transition-all duration-200 cursor-pointer relative group ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/60 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}>
                      {prob.code}
                    </span>
                    <TabIcon className={`w-4 h-4 ${
                      isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                  </div>

                  <h3 className="text-sm font-display font-bold text-white truncate mb-1">
                    {prob.title}
                  </h3>

                  <p className="text-xs font-sans text-slate-400 leading-tight line-clamp-2">
                    {prob.domain}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Problem Detail Area */}
          <ScrollReveal direction="up" delay={100} duration={500} className="w-full text-left">
            <GlassCard
              glowColor={selectedProblem.accentColor}
              className="p-6 sm:p-8 md:p-10 border border-slate-800 bg-slate-900/70 shadow-2xl rounded-none relative overflow-hidden"
            >
              {/* Main Heading Lockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-none bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 font-bold">
                      {selectedProblem.code}
                    </span>
                    <span className="text-xs font-sans text-slate-400 font-medium">
                      {selectedProblem.classificationLevel}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    {selectedProblem.code}: {selectedProblem.title}
                  </h3>
                  
                  <div className="text-sm font-sans text-blue-400 font-semibold mt-1">
                    {selectedProblem.domain}
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playModalOpen();
                    onOpenProblemModal(selectedProblem);
                  }}
                  className="btn-glow-cyan self-start sm:self-auto py-3 px-5 rounded-none font-sans font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98 shrink-0"
                >
                  <span>Inspect Full Details</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Problem Overview */}
              <div className="mb-8">
                <span className="text-xs font-sans text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  Problem Overview & Challenge Description
                </span>
                <p className="text-sm text-slate-300 font-sans leading-relaxed font-normal bg-slate-950/60 p-5 rounded-none border border-slate-800/80">
                  {selectedProblem.overview}
                </p>
              </div>

              {/* Feature & Criteria Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Key Deliverables */}
                <div className="p-5 rounded-none bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-sans text-blue-400 uppercase font-bold mb-3 pb-2 border-b border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Key Deliverables & Features</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedProblem.keyFeatures.map((feat, i) => (
                      <li key={i} className="text-xs text-slate-300 font-sans flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evaluation Focus */}
                <div className="p-5 rounded-none bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-sans text-blue-400 uppercase font-bold mb-3 pb-2 border-b border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Evaluation Benchmarks</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedProblem.evaluationFocus.map((focus, i) => (
                      <li key={i} className="text-xs text-slate-300 font-sans flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Recommended Stack */}
              <div className="pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-sans text-slate-400 block mb-2 font-semibold">
                    RECOMMENDED STACK:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.techStack.map((tech, i) => (
                      <span key={i} className="text-xs font-sans bg-slate-950 text-slate-300 px-3 py-1 rounded-none border border-slate-800 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-sans text-slate-400 self-start sm:self-auto shrink-0 flex items-center gap-2 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Eligible for ₹1,00,000 Prize Pool</span>
                </div>
              </div>

            </GlassCard>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
