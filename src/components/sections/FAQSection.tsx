'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
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
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>MISSION DEBRIEF // FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            ORION <span className="text-gradient-frost-azure">INTEL</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Essential directives on team eligibility, standardized submission guidelines, Round 2 finalist fee, and offline hospitality.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setCategoryFilter(cat.id as typeof categoryFilter);
              }}
              className={`px-3 py-1.5 rounded-none text-xs font-mono-hud transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-sm'
                  : 'bg-[#0B2556] text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.12)]'
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
              <GlassCard
                key={idx}
                glowColor="cyan"
                className={`transition-all duration-200 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none ${
                  isOpen ? 'border-[#38BDF8]/60 bg-[#0B2556]' : ''
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
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] flex items-center justify-between gap-4 text-xs font-mono-hud text-[#BAE6FD]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>Have additional queries? Contact Microsoft Club SIST coordinators.</span>
          </div>
          <a
            href="mailto:microsoftclub@sathyabama.ac.in"
            className="text-[#38BDF8] hover:underline shrink-0 font-bold"
          >
            microsoftclub@sathyabama.ac.in
          </a>
        </div>

      </div>
    </section>
  );
};
