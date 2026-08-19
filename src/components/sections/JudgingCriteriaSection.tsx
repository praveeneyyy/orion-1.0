'use client';

import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Layers,
  Award
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { JUDGING_CRITERIA } from '../../data/orionData';

export const JudgingCriteriaSection: React.FC = () => {
  return (
    <section id="judging" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#0B1220] border border-[#00BCF2]/30 text-xs font-mono-hud text-[#22D3EE] mb-3 shadow-[0_0_15px_rgba(0,188,242,0.2)]">
            <Scale className="w-3.5 h-3.5" />
            <span>TRANSPARENT SCORING MATRIX // JURY PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            JUDGING <span className="text-gradient-frost-azure">CRITERIA</span>
          </h2>
          <p className="text-xs md:text-sm text-[#94A3B8] mt-2.5 font-sans leading-relaxed">
            Every submission is screened across four rigorous technical dimensions by expert academic and industry evaluators.
          </p>
        </ScrollReveal>

        {/* 4 Criteria Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto text-left">
          {JUDGING_CRITERIA.map((crit, idx) => (
            <ScrollReveal
              key={crit.number}
              direction="up"
              delay={idx * 90}
              duration={600}
              className="h-full"
            >
              <GlassCard
                glowColor="cyan"
                className="p-6 border border-[rgba(0,188,242,0.18)] hover:border-[#00BCF2]/60 bg-[#0B1220]/90 rounded-none h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group"
                withHudCorners={true}
              >
                <div>
                  {/* Top Number & Percentage Pill */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(0,188,242,0.12)]">
                    <span className="text-xs font-mono-hud text-[#94A3B8] font-bold">
                      DIMENSION {crit.number}
                    </span>
                    <span 
                      className="text-xs font-mono-hud font-black px-2.5 py-0.5 border shadow-sm"
                      style={{ 
                        borderColor: `${crit.color}50`, 
                        backgroundColor: '#020617', 
                        color: crit.color 
                      }}
                    >
                      {crit.weightLabel} WEIGHT
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-display font-bold text-white mb-2 group-hover:text-[#BAE6FD] transition-colors">
                    {crit.name}
                  </h3>

                  <p className="text-xs text-[#94A3B8] font-sans leading-relaxed mb-4 font-normal">
                    {crit.description}
                  </p>

                  {/* Key Factors Checklist */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-mono-hud text-[#22D3EE] uppercase tracking-wider block font-semibold">
                      SCORING INDICATORS:
                    </span>
                    <ul className="space-y-1.5">
                      {crit.keyFactors.map((fact, i) => (
                        <li key={i} className="text-[11px] font-sans text-[#F8FAFC] flex items-start gap-2">
                          <span className="text-[#00BCF2] font-mono-hud font-bold">›</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Weighted Metric Bar */}
                <div className="pt-3.5 border-t border-[rgba(0,188,242,0.12)]">
                  <div className="flex items-center justify-between text-[10px] font-mono-hud text-[#94A3B8] mb-1.5">
                    <span>EVALUATION WEIGHT</span>
                    <span className="text-white font-bold">{crit.weight}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#020617] border border-[rgba(0,188,242,0.15)] overflow-hidden">
                    <div 
                      className="h-full transition-all duration-700"
                      style={{ 
                        width: `${crit.weight * 3.33}%`,
                        backgroundColor: crit.color 
                      }}
                    />
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Evaluation Governance Note */}
        <ScrollReveal direction="up" delay={200} duration={600} className="mt-12 max-w-4xl mx-auto">
          <div className="p-4 bg-[#071426] border border-[rgba(0,188,242,0.2)] flex items-center justify-between gap-4 text-xs font-mono-hud text-[#94A3B8] text-center sm:text-left">
            <span className="flex items-center gap-2 text-[#22D3EE] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00BCF2]" />
              BLIND EVALUATION PROTOCOL // JURY DECISIONS ARE FINAL
            </span>
            <span className="text-slate-400 hidden sm:inline">
              STANDARDIZED 5-SLIDE MATRIX
            </span>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
