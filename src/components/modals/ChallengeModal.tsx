'use client';

import React from 'react';
import { 
  X, 
  Terminal, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Database, 
  ShieldCheck, 
  FileText,
  Rocket
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import type { ProblemStatement } from '../../types/orion';
import { sound } from '../../audio/soundEffects';

interface ChallengeModalProps {
  problem: ProblemStatement | null;
  isOpen?: boolean;
  onClose: () => void;
  onSelectTrack?: () => void;
  onSelectForRegister?: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  problem,
  isOpen,
  onClose,
  onSelectTrack,
  onSelectForRegister
}) => {
  // If problem is null, don't show
  if (!problem) return null;

  const handleSelect = () => {
    sound.playLaunchWarp();
    onClose();
    if (onSelectTrack) onSelectTrack();
    if (onSelectForRegister) onSelectForRegister();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <GlassCard
          glowColor={problem.accentColor}
          className="p-6 sm:p-8 border border-[rgba(212,233,255,0.16)] bg-[#07193D] shadow-2xl rounded-none text-left"
          withHudCorners={true}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(212,233,255,0.12)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8]">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono-hud text-[#38BDF8]">
                  {problem.code} // CLASSIFIED ENGINEERING DOSSIER
                </span>
                <h3 className="text-2xl font-display font-black text-white">
                  {problem.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playModalClose();
                onClose();
              }}
              className="p-1.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] text-[#BAE6FD] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Tagline & Domain */}
            <div className="p-4 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)]">
              <div className="text-xs font-mono-hud text-[#38BDF8] font-bold mb-1">
                {problem.domain}
              </div>
              <p className="text-xs sm:text-sm text-white font-sans font-medium">
                {problem.tagline}
              </p>
            </div>

            {/* Overview */}
            <div>
              <span className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase block mb-1.5 font-semibold">
                PROBLEM OVERVIEW & CONTEXT:
              </span>
              <p className="text-xs sm:text-sm text-[#BAE6FD] font-sans leading-relaxed">
                {problem.overview}
              </p>
            </div>

            {/* Key Features & Deliverables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)]">
                <span className="text-[10px] font-mono-hud text-[#38BDF8] uppercase block mb-2 font-bold">
                  KEY DELIVERABLE FOCUS:
                </span>
                <ul className="space-y-1.5 text-xs text-[#BAE6FD] font-sans">
                  {problem.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#38BDF8] font-mono-hud text-xs">›</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)]">
                <span className="text-[10px] font-mono-hud text-[#38BDF8] uppercase block mb-2 font-bold">
                  ROUND 1 SUBMISSION CRITERIA:
                </span>
                <ul className="space-y-1.5 text-xs text-[#BAE6FD] font-sans">
                  {problem.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div>
              <span className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase block mb-2 font-semibold">
                RECOMMENDED TECH STACK:
              </span>
              <div className="flex flex-wrap gap-2">
                {problem.techStack.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#BAE6FD]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-[rgba(212,233,255,0.12)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-mono-hud text-[#7DD3FC]">
                ELIGIBLE FOR ₹1,00,000 PRIZE ORBIT
              </div>
              <button
                onClick={handleSelect}
                className="w-full sm:w-auto px-6 py-3 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-[#040E24]" />
                <span>CHOOSE THIS TRACK & REGISTER — ₹100</span>
              </button>
            </div>

          </div>
        </GlassCard>
      </div>
    </div>
  );
};
