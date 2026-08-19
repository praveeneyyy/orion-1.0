'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Code2, 
  Cloud, 
  Terminal, 
  Layers, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { MICROSOFT_ECOSYSTEM_TECHNOLOGIES } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

export const MicrosoftEcosystemSection: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    Cpu,
    Code2,
    Cloud,
    Terminal,
    Layers,
    Activity
  };

  return (
    <section id="ecosystem" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Microsoft 4-Color Accents */}
        <ScrollReveal direction="up" delay={50} duration={600} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0B1220] border border-[#00BCF2]/30 text-xs font-mono-hud text-[#22D3EE] mb-4 shadow-[0_0_20px_rgba(0,188,242,0.2)]">
            <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5 shrink-0" title="Microsoft Club">
              <span className="bg-[#F25022] w-1 h-1" />
              <span className="bg-[#7FBA00] w-1 h-1" />
              <span className="bg-[#00A4EF] w-1 h-1" />
              <span className="bg-[#FFB900] w-1 h-1" />
            </div>
            <span>POWERED BY THE MICROSOFT ECOSYSTEM</span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight">
            DEVELOPER <span className="text-gradient-frost-azure">INTELLIGENCE</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] mt-3 font-sans leading-relaxed">
            <strong className="text-white font-semibold">Microsoft provides the technology. ORION provides the mission. Participants build the future.</strong> <br className="hidden sm:inline" />
            Architect production-ready solutions using cutting-edge enterprise cloud, AI, and developer tools.
          </p>
        </ScrollReveal>

        {/* 6 Technology Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto text-left">
          {MICROSOFT_ECOSYSTEM_TECHNOLOGIES.map((tech, idx) => {
            const Icon = iconMap[tech.icon] || Cpu;
            const isHovered = hoveredTech === tech.id;

            return (
              <ScrollReveal
                key={tech.id}
                direction="up"
                delay={idx * 80}
                duration={600}
                className="h-full"
              >
                <div
                  onMouseEnter={() => {
                    sound.playHover();
                    setHoveredTech(tech.id);
                  }}
                  onMouseLeave={() => setHoveredTech(null)}
                  className="h-full"
                >
                  <GlassCard
                    glowColor="cyan"
                    className="p-6 sm:p-7 border border-[rgba(0,188,242,0.18)] hover:border-[#00BCF2]/70 bg-[#0B1220]/90 rounded-none h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group relative overflow-hidden"
                    withHudCorners={true}
                  >
                    {/* Top Ambient Glow */}
                    <div 
                      className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                      style={{ backgroundColor: tech.accent }}
                    />

                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[rgba(0,188,242,0.12)]">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="p-2.5 bg-[#020617] border border-[#00BCF2]/40 text-[#22D3EE] shadow-sm transition-transform duration-300 group-hover:scale-110"
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono-hud text-[#94A3B8] block uppercase">
                              {tech.category}
                            </span>
                            <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-[#BAE6FD] transition-colors">
                              {tech.name}
                            </h3>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono-hud px-2 py-0.5 bg-[#071426] text-[#22D3EE] border border-[#00BCF2]/30 font-bold shrink-0">
                          {tech.badge}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#94A3B8] font-sans leading-relaxed mb-5 font-normal">
                        {tech.description}
                      </p>

                      {/* Capabilities Checklist */}
                      <div className="space-y-2 mb-6">
                        <span className="text-[10px] font-mono-hud text-[#22D3EE] uppercase tracking-wider block font-semibold">
                          KEY CAPABILITIES:
                        </span>
                        <ul className="space-y-1.5">
                          {tech.capabilities.map((cap, i) => (
                            <li key={i} className="text-xs font-sans text-[#F8FAFC] flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#00BCF2] shrink-0 mt-0.5" />
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Footer Accent */}
                    <div className="pt-3.5 border-t border-[rgba(0,188,242,0.12)] flex items-center justify-between text-[10px] font-mono-hud text-[#94A3B8]">
                      <span className="flex items-center gap-1 text-[#22D3EE] font-semibold">
                        <ShieldCheck className="w-3 h-3 text-[#00BCF2]" />
                        MICROSOFT CLUB APPROVED
                      </span>
                      <span className="text-slate-400 group-hover:text-white transition-colors">
                        READY FOR HACK
                      </span>
                    </div>

                  </GlassCard>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Ecosystem Governance Banner */}
        <ScrollReveal direction="up" delay={200} duration={600} className="mt-12 max-w-4xl mx-auto">
          <div className="p-4 sm:p-5 bg-[#071426] border border-[rgba(0,188,242,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0B1220] border border-[#00BCF2]/40 text-[#22D3EE] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-display font-bold text-white">
                  Cross-Platform & Open Source Innovation
                </h4>
                <p className="text-[11px] text-[#94A3B8] font-sans">
                  Teams are empowered to leverage any preferred language, framework, or cloud API alongside Microsoft services.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono-hud text-[#22D3EE] bg-[#020617] px-3 py-1.5 border border-[#00BCF2]/40 shrink-0 font-bold">
              OPEN ECOSYSTEM PROTOCOL
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
