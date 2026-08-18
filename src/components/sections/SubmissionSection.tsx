'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  FileMinus, 
  FileX, 
  ArrowUpDown, 
  CheckSquare, 
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { PPT_TEMPLATE_RULES } from '../../data/orionData';
import { sound } from '../../audio/soundEffects';

export const SubmissionSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(1);

  const ruleIcons: Record<string, React.FC<{ className?: string }>> = {
    FileMinus,
    FileX,
    ArrowUpDown,
    CheckSquare,
    ShieldAlert,
    FileCode
  };

  const slideBlueprints = [
    {
      num: 1,
      title: "Slide 01 // Mission Title & Squad Dossier",
      type: "MANDATORY HEADER FRAME",
      fields: ["Team Name & Unique Team ID", "Problem Statement Track Selection", "Leader & Member Details with Institute Names", "QR / Github Prototype Link Placeholder"],
      instruction: "Do not alter the official ORION 1.0 banner. Fill all participant roster metadata accurately."
    },
    {
      num: 2,
      title: "Slide 02 // Problem Deconstruction & Novelty",
      type: "ANALYSIS & VALUE PROP",
      fields: ["Root Problem Statement Analysis", "Target End-User / Industry Friction", "Existing Solutions vs ORION Solution Novelty", "Key Value Drivers"],
      instruction: "Clearly articulate why existing solutions fail and what makes your architectural approach distinctive."
    },
    {
      num: 3,
      title: "Slide 03 // Technical System Architecture",
      type: "CORE SYSTEM BLUEPRINT",
      fields: ["End-to-End Block Diagram / Data Pipeline", "Frontend, Backend & Microservices Stack", "Algorithms, ML Models, Smart Contracts or AI RAG", "Latency, Security & Scalability Guarantees"],
      instruction: "Embed your system block diagram here. Technical depth will be strictly evaluated by jury."
    },
    {
      num: 4,
      title: "Slide 04 // Implementation Roadmap & Deliverables",
      type: "EXECUTION BLUEPRINT",
      fields: ["Core Modules Completed for Round 1", "Round 2 24-Hour Offline Sprint Plan", "Tech Stack Justification & APIs", "Prototype Video / Repo Links (Optional)"],
      instruction: "Detail how your team will expand this system within the 24-hour offline mission arena at SIST."
    },
    {
      num: 5,
      title: "Slide 05 // Impact, Feasibility & Commercial Viability",
      type: "IMPACT MATRIX",
      fields: ["Societal, Environmental or Commercial Impact", "Deployment Feasibility & Cost Model", "Potential Obstacles & Threat Model", "Concluding Summary"],
      instruction: "Quantify real-world utility and feasibility metrics. Maintain original template footer lockup."
    }
  ];

  const handleDownloadTemplate = () => {
    sound.playClick();
    const pptxContent = `ORION 1.0 - Official Hackathon Presentation Template
Sathyabama Institute of Science and Technology, Chennai
Organized by Microsoft Club SIST
=====================================================

MANDATORY RULES:
1. Exactly 5 Slides. No slides may be added, removed, or reordered.
2. File naming protocol: TeamName_ORION1.0 (PPTX or PDF)
3. Upload via the official ORION 1.0 submission portal before August 28, 2026.

SLIDE STRUCTURE:
- Slide 01: Team Name, Team ID, Problem Statement Code, Member Roster
- Slide 02: Problem Analysis, Existing Limitations & Solution Novelty
- Slide 03: System Architecture Diagram, Tech Stack & Data Flow
- Slide 04: Implementation Status, APIs & 24-Hour Offline Sprint Roadmap
- Slide 05: Real-World Impact, Commercial Feasibility & Threat Model

Good luck Builders! Reach for the stars.`;

    const blob = new Blob([pptxContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TeamName_ORION1.0_Template.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="blueprint" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-xs font-mono-hud text-[#38BDF8] mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>ROUND 1 STANDARDIZED PROTOCOL // PPT BLUEPRINT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white">
            SUBMISSION <span className="text-gradient-frost-azure">BLUEPRINT</span>
          </h2>
          <p className="text-xs md:text-sm text-[#BAE6FD] mt-2.5 font-sans leading-relaxed">
            All Round 1 entries must strictly adhere to the mandatory 5-slide blueprint for standardized jury screening.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto mb-16 text-left">
          
          {/* Left Column: Interactive Slide Inspector */}
          <div className="lg:col-span-7">
            <GlassCard glowColor="cyan" className="p-6 sm:p-7 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none h-full flex flex-col justify-between" withHudCorners={true}>
              <div>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-[rgba(212,233,255,0.12)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-hud text-[#38BDF8] font-bold">SLIDE STRUCTURE (5 FIXED SLIDES)</span>
                  </div>
                  <span className="text-[10px] font-mono-hud text-[#7DD3FC]">STRICT EVALUATION</span>
                </div>

                {/* Slide Tab Buttons */}
                <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-2">
                  {slideBlueprints.map((s) => (
                    <button
                      key={s.num}
                      onClick={() => {
                        sound.playHover();
                        setActiveSlide(s.num);
                      }}
                      className={`px-3 py-1.5 rounded-none text-xs font-mono-hud transition-all cursor-pointer whitespace-nowrap ${
                        activeSlide === s.num
                          ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-md'
                          : 'bg-[#0B2556] text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.12)]'
                      }`}
                    >
                      SLIDE 0{s.num}
                    </button>
                  ))}
                </div>

                {/* Active Slide Display */}
                {(() => {
                  const current = slideBlueprints[activeSlide - 1];
                  return (
                    <div className="p-5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-display font-bold text-white">
                          {current.title}
                        </h4>
                        <span className="text-[10px] font-mono-hud text-[#38BDF8] bg-[#0B2556] px-2 py-0.5 border border-[#38BDF8]/40 rounded-none">
                          {current.type}
                        </span>
                      </div>

                      <p className="text-xs text-[#7DD3FC] font-sans mb-4">
                        {current.instruction}
                      </p>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono-hud text-[#BAE6FD] uppercase block font-semibold">
                          MANDATORY SECTIONS:
                        </span>
                        <ul className="space-y-1.5">
                          {current.fields.map((f, idx) => (
                            <li key={idx} className="text-xs font-sans text-[#BAE6FD] flex items-center gap-2">
                              <span className="text-[#38BDF8] font-mono-hud text-xs">›</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Download CTA Box */}
              <div className="pt-4 border-t border-[rgba(212,233,255,0.12)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-mono-hud text-[#7DD3FC]">
                  Official PPTX Template (Standardized Layout)
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#040E24]" />
                  <span>DOWNLOAD PPT TEMPLATE</span>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Template Rules Matrix */}
          <div className="lg:col-span-5">
            <GlassCard glowColor="violet" className="p-6 sm:p-7 border border-[rgba(212,233,255,0.14)] bg-[#07193D]/90 rounded-none h-full flex flex-col justify-between" withHudCorners={true}>
              <div>
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[rgba(212,233,255,0.12)]">
                  <ShieldAlert className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-mono-hud text-[#F8FAFC] font-bold">MANDATORY PROTOCOL RULES</span>
                </div>

                <div className="space-y-3">
                  {PPT_TEMPLATE_RULES.map((r, idx) => {
                    const Icon = ruleIcons[r.icon] || CheckCircle2;
                    return (
                      <div key={idx} className="p-3 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.1)] flex items-start gap-3">
                        <div className="p-1 rounded-none bg-[#0B2556] text-[#38BDF8] shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-display font-bold text-white">
                            {r.rule}
                          </div>
                          <div className="text-[11px] font-sans text-[#7DD3FC] leading-relaxed">
                            {r.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(212,233,255,0.12)] text-[10px] font-mono-hud text-[#38BDF8]">
                NAMING FORMAT: TeamName_ORION1.0 (PPTX / PDF)
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  );
};
