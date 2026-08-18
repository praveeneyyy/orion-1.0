'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  ArrowUpRight, 
  Waves, 
  ShieldCheck, 
  TreePine, 
  Cpu, 
  Layers
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { PROBLEM_STATEMENTS } from '../../data/orionData';
import type { ProblemStatement } from '../../types/orion';
import { sound } from '../../audio/soundEffects';

interface ChallengeArenaProps {
  onOpenProblemModal: (problem: ProblemStatement) => void;
}

export const ChallengeArena: React.FC<ChallengeArenaProps> = ({ onOpenProblemModal }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'flagship' | 'open'>('all');

  const domainIcons: Record<string, React.FC<{ className?: string }>> = {
    floatchat: Waves,
    lexvault: ShieldCheck,
    sylvasense: TreePine,
  };

  const openInnovationTracks = [
    { title: "Generative & Agentic AI", desc: "Autonomous multi-agent systems, multimodal RAG, and edge inference pipelines." },
    { title: "Web3 & Decentralized Systems", desc: "Zero-Knowledge proofs, verifiable computation, DeFi protocols, and decentralized ID." },
    { title: "Cybersecurity & Cryptography", desc: "Automated vulnerability mitigation, post-quantum crypto, and hardware security modules." },
    { title: "IoT, Robotics & Hardware", desc: "Embedded telemetry controllers, autonomous rovers, drones, and edge robotics." },
    { title: "Healthcare & BioInformatics", desc: "Clinical diagnostic vision, genomics pipelines, EHR zero-leakage, and telemetry." },
    { title: "Space Tech & Geospatial", desc: "Orbital flight mechanics, multi-spectral satellite processing, and telemetry mapping." }
  ];

  return (
    <section id="challenges" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>ENGINEERING DOSSIERS // PROBLEM STATEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            CHALLENGE <span className="text-gradient-frost-azure">ARENA</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            Tackle deep-tech flagship engineering challenges or build breakthrough solutions across open-innovation tracks.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => {
                sound.playHover();
                setActiveFilter('all');
              }}
              className={`px-3.5 py-1.5 rounded-none text-xs font-mono-hud transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-md' 
                  : 'bg-[#0B2556] text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.12)]'
              }`}
            >
              ALL MISSIONS (04)
            </button>
            <button
              onClick={() => {
                sound.playHover();
                setActiveFilter('flagship');
              }}
              className={`px-3.5 py-1.5 rounded-none text-xs font-mono-hud transition-all cursor-pointer ${
                activeFilter === 'flagship' 
                  ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-md' 
                  : 'bg-[#0B2556] text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.12)]'
              }`}
            >
              FLAGSHIP DOSSIERS (03)
            </button>
            <button
              onClick={() => {
                sound.playHover();
                setActiveFilter('open');
              }}
              className={`px-3.5 py-1.5 rounded-none text-xs font-mono-hud transition-all cursor-pointer ${
                activeFilter === 'open' 
                  ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-md' 
                  : 'bg-[#0B2556] text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.12)]'
              }`}
            >
              OPEN TRACKS (06)
            </button>
          </div>
        </div>

        {/* 3 Flagship Problem Statements */}
        {(activeFilter === 'all' || activeFilter === 'flagship') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12 items-stretch text-left">
            {PROBLEM_STATEMENTS.map((prob) => {
              const Icon = domainIcons[prob.id] || Terminal;

              return (
                <GlassCard
                  key={prob.id}
                  glowColor={prob.accentColor}
                  className="p-6 sm:p-7 flex flex-col justify-between border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none"
                  withHudCorners={true}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(212,233,255,0.12)]">
                      <span className="text-xs font-mono-hud text-[#7DD3FC] flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#38BDF8]" />
                        {prob.code}
                      </span>
                      <span className="text-[10px] font-mono-hud px-2.5 py-0.5 rounded-none border border-[#38BDF8]/40 bg-[#0B2556] text-[#38BDF8] font-semibold">
                        FLAGSHIP
                      </span>
                    </div>

                    <h3 className="text-2xl font-display font-black text-white tracking-tight mb-1">
                      {prob.title}
                    </h3>
                    <div className="text-xs font-mono-hud font-semibold text-[#38BDF8] mb-3">
                      {prob.domain}
                    </div>

                    <p className="text-xs text-[#BAE6FD] font-sans leading-relaxed line-clamp-4 mb-4 font-normal">
                      {prob.overview}
                    </p>

                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase block font-semibold">
                        DELIVERABLE FOCUS:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#BAE6FD]">
                        {prob.keyFeatures.slice(0, 2).map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#38BDF8] font-mono-hud text-xs">›</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {prob.techStack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[10px] font-mono-hud bg-[#040E24] text-[#BAE6FD] px-2 py-0.5 rounded-none border border-[rgba(212,233,255,0.1)]">
                          {tech.split('/')[0].trim()}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        sound.playModalOpen();
                        onOpenProblemModal(prob);
                      }}
                      className="w-full py-2.5 px-4 rounded-none text-xs font-mono-hud font-bold transition-all flex items-center justify-center gap-2 border border-[rgba(212,233,255,0.2)] hover:border-[#38BDF8] bg-[#0B2556] hover:bg-[#103374] text-[#BAE6FD] hover:text-white cursor-pointer"
                    >
                      <span>INSPECT FULL DOSSIER</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Open Innovation Track */}
        {(activeFilter === 'all' || activeFilter === 'open') && (
          <div className="max-w-7xl mx-auto text-left">
            <GlassCard glowColor="violet" className="p-7 sm:p-8 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none" withHudCorners={true}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 mb-6 border-b border-[rgba(212,233,255,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-hud text-[#38BDF8]">ORION-PS-04 // OPEN TRACK</span>
                    <h3 className="text-xl sm:text-2xl font-display font-black text-white">
                      OPEN INNOVATION ARENA
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-hud bg-[#0B2556] text-[#38BDF8] px-3 py-1 rounded-none border border-[#38BDF8]/40">
                  ALL DOMAINS ACCEPTED
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#BAE6FD] font-sans leading-relaxed mb-6 font-normal">
                Have a novel solution outside the 3 flagship problem statements? Builders are welcome to submit high-impact prototypes across emerging technology domains.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {openInnovationTracks.map((track, i) => (
                  <div key={i} className="p-4 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-display font-bold text-white mb-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span>{track.title}</span>
                      </div>
                      <p className="text-xs font-sans text-[#7DD3FC] leading-relaxed font-normal">
                        {track.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(212,233,255,0.12)] flex items-center justify-between text-xs font-mono-hud text-[#7DD3FC]">
                <span className="flex items-center gap-1.5 text-[#38BDF8]">
                  <Layers className="w-3.5 h-3.5" />
                  ELIGIBLE FOR FULL ₹1,00,000 PRIZE POOL & MERIT BADGES
                </span>
                <span className="text-[#BAE6FD] hidden sm:inline">
                  USE MANDATORY PPT TEMPLATE
                </span>
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </section>
  );
};
