'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { FAQ_DATA } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'eligibility' | 'submission' | 'finale' | 'accommodation'>('all');

  const categories = [
    { id: 'all', label: 'ALL QUESTIONS' },
    { id: 'eligibility', label: 'ELIGIBILITY & SQUADS' },
    { id: 'submission', label: 'ROUND 1 & PPT TEMPLATE' },
    { id: 'finale', label: 'FINALE & FEES' },
    { id: 'accommodation', label: 'HOSPITALITY & VENUE' }
  ];

  const filteredFaqs = FAQ_DATA.filter(faq => {
    if (categoryFilter === 'all') return true;
    return faq.category.toLowerCase().includes(categoryFilter);
  });

  const toggleAccordion = (index: number) => {
    sound.playHover();
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-left">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-sans font-semibold text-blue-400 mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans leading-relaxed">
            Everything you need to know about team eligibility, submission rules, finalist fees, and venue hospitality.
          </p>
        </ScrollReveal>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setCategoryFilter(cat.id as any);
              }}
              className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 60}
                duration={500}
              >
                <GlassCard
                  glowColor="cyan"
                  className={`transition-all duration-200 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none shadow-md ${
                    isOpen ? 'border-[#38BDF8]/70 bg-[#0B2556] shadow-[0_0_20px_rgba(56,189,248,0.15)]' : 'hover:border-[#38BDF8]/40'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono-hud text-[#38BDF8] font-bold">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-display font-bold text-white">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`p-1.5 rounded-none bg-[#040E24] border border-[#38BDF8]/30 text-[#38BDF8] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-white border-[#38BDF8]' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-xs sm:text-sm text-[#BAE6FD] font-sans leading-relaxed border-t border-[rgba(212,233,255,0.1)] mt-1 animate-in fade-in duration-200 font-normal">
                      {faq.answer}
                    </div>
                  )}
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Support Help Banner */}
        <ScrollReveal direction="up" delay={200} duration={500} className="mt-8">
          <div className="p-4 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] hover:border-[#38BDF8]/40 transition-colors flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-hud text-[#BAE6FD] shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Have additional queries? Contact Microsoft Club SIST coordinators.</span>
            </div>
            <a
              href="mailto:microsoftclub@sathyabama.ac.in"
              className="text-[#38BDF8] hover:text-white hover:underline shrink-0 font-bold"
            >
              microsoftclub@sathyabama.ac.in
            </a>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
