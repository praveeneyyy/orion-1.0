'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { FAQ_DATA } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

type FAQCategory = 'all' | 'eligibility' | 'submission' | 'finale' | 'accommodation';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [categoryFilter, setCategoryFilter] = useState<FAQCategory>('all');

  const categories: { id: FAQCategory; label: string }[] = [
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
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-12 select-none">
          <div className="inline-flex items-center gap-2.5 px-4 py-1 bg-gradient-to-r from-transparent via-[#00BCF2]/10 to-transparent border-y border-[#00BCF2]/25 text-xs font-mono font-bold tracking-[0.18em] text-[#BAE6FD] uppercase mb-4 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-[#00BCF2]" />
            <span>KNOWLEDGE BASE • FREQUENTLY ASKED QUESTIONS</span>
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
                setCategoryFilter(cat.id);
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
              <div 
                key={idx}
                className={`border transition-all duration-300 ${
                  isOpen 
                    ? 'bg-[#0B1220]/95 border-[#00BCF2]/50 shadow-[0_0_25px_rgba(0,188,242,0.12)]' 
                    : 'bg-[#0B1220]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#00BCF2] font-bold">
                      0{idx + 1}.
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`p-1.5 rounded-full border transition-transform duration-300 shrink-0 ${
                    isOpen 
                      ? 'bg-[#00BCF2]/20 border-[#00BCF2] text-[#00BCF2] rotate-180' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5 text-sm text-slate-300 font-sans leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
