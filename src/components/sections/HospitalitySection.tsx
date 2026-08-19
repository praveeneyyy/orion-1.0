'use client';

import React from 'react';
import { 
  Coffee, 
  Utensils, 
  Moon, 
  Shirt, 
  Building, 
  Wifi, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Zap,
  Home,
  Flame
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { HOSPITALITY_SYSTEMS, EVENT_METRICS } from '../../data/orionData';

export const HospitalitySection: React.FC = () => {
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Coffee,
    Utensils,
    Moon,
    Shirt,
    Building,
    Wifi,
    Zap,
    Home,
    Flame,
    ShieldCheck
  };

  return (
    <section id="hospitality" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3 shadow-sm">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>FINALIST WELFARE // ALL-INCLUSIVE HOSPITALITY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            FINALIST <span className="text-gradient-frost-azure">HOSPITALITY</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Shortlisted Top 70 squads experience first-class accommodation, continuous catering, high-speed connectivity, and official swags at SIST Chennai.
          </p>
        </ScrollReveal>

        {/* 7 Amenities Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto mb-12 text-left">
          {HOSPITALITY_SYSTEMS.map((amenity, idx) => {
            const Icon = iconMap[amenity.icon] || CheckCircle2;

            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 80}
                duration={600}
                className="h-full"
              >
                <GlassCard
                  glowColor="cyan"
                  className="p-5 border border-[rgba(212,233,255,0.12)] hover:border-[#38BDF8]/50 bg-[#07193D]/90 rounded-none h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  withHudCorners={true}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono-hud bg-[#040E24] text-[#7DD3FC] px-2 py-0.5 border border-[rgba(212,233,255,0.1)] rounded-none font-semibold">
                        SYS-0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-sm font-display font-bold text-white mb-2">
                      {amenity.title}
                    </h3>

                    <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed mb-4 font-normal">
                      {amenity.detail}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[rgba(212,233,255,0.1)] text-[10px] font-mono-hud text-[#38BDF8] flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-[#38BDF8]" />
                    <span>{amenity.subtitle}</span>
                  </div>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Security & Reassurance Banner */}
        <ScrollReveal direction="up" delay={200} duration={600} className="max-w-5xl mx-auto">
          <div className="p-6 rounded-none bg-[#040E24] border border-[#38BDF8]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8] shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white">
                  24/7 CAMPUS PROTOCOL & MEDICAL SUPPORT
                </h4>
                <p className="text-xs text-[#BAE6FD] font-sans font-normal">
                  Sathyabama Institute ensures round-the-clock campus security, dedicated women's hostel wings, high-voltage power backup, and on-campus medical response.
                </p>
              </div>
            </div>
            <div className="text-xs font-mono-hud text-[#38BDF8] bg-[#0B2556] px-3.5 py-1.5 border border-[#38BDF8]/40 rounded-none shrink-0 font-bold shadow-sm">
              SIST APPROVED
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
