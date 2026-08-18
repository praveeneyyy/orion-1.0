'use client';

import React from 'react';
import { 
  Coffee, 
  Utensils, 
  Moon, 
  Shirt, 
  Zap, 
  Home, 
  Flame, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { HOSPITALITY_SYSTEMS } from '../../data/orionData';

export const HospitalitySection: React.FC = () => {
  const perkIcons: Record<string, React.FC<{ className?: string }>> = {
    Coffee,
    Utensils,
    Moon,
    Shirt,
    Zap,
    Home,
    Flame
  };

  return (
    <section id="hospitality" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <Coffee className="w-3.5 h-3.5" />
            <span>MISSION HOSPITALITY & LOGISTICS // FULLY CATERED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            FINALIST <span className="text-gradient-frost-azure">HOSPITALITY</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            The ₹200 per-head finalist confirmation fee ensures top-tier comfort, 5 nutritious meals, swag armor, and on-campus accommodation.
          </p>
        </div>

        {/* 7 Hospitality Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto mb-12 text-left">
          {HOSPITALITY_SYSTEMS.map((sys, idx) => {
            const Icon = perkIcons[sys.icon] || Sparkles;

            return (
              <GlassCard
                key={idx}
                glowColor="cyan"
                className="p-6 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none flex flex-col justify-between"
                withHudCorners={true}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono-hud text-[#7DD3FC]">
                      SYSTEM 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-black text-white mb-1">
                    {sys.title}
                  </h3>
                  <div className="text-xs font-mono-hud text-[#38BDF8] mb-3 font-semibold">
                    {sys.subtitle}
                  </div>

                  <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed font-normal">
                    {sys.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(212,233,255,0.1)] text-[10px] font-mono-hud text-[#7DD3FC]">
                  INCLUDED IN ROUND 2 CONFIRMATION
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="max-w-4xl mx-auto p-4 rounded-none bg-[#07193D] border border-[#38BDF8]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-hud text-[#BAE6FD]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>24/7 Security, On-Campus Medical Bay, & Dedicated High-Speed LAN Stations.</span>
          </div>
          <span className="text-[#38BDF8] font-bold">SATHYABAMA INSTITUTE, CHENNAI</span>
        </div>

      </div>
    </section>
  );
};
