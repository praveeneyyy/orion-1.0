'use client';

import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { GooeyNav } from './GooeyNav';
import { sound } from '../../audio/soundEffects';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister, onOpenStatus }) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { label: "CHALLENGES", href: "#challenges" },
    { label: "ECOSYSTEM", href: "#ecosystem" },
    { label: "PHASES", href: "#phases" },
    { label: "BLUEPRINT", href: "#blueprint" },
    { label: "JUDGING", href: "#judging" },
    { label: "BOUNTIES", href: "#prizes" },
    { label: "TIMELINE", href: "#timeline" },
    { label: "LEADERSHIP", href: "#leadership" },
    { label: "VENUE", href: "#venue" },
    { label: "INTEL", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 bg-[#0B1220]/95 backdrop-blur-xl border-b border-[rgba(0,188,242,0.25)] shadow-[0_8px_32px_rgba(0,0,0,0.85)]' 
          : 'py-3.5 bg-[#020617]/85 backdrop-blur-md border-b border-[rgba(0,188,242,0.1)]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Lockup with Official Logo & Microsoft 4-Color Accents */}
          <a 
            href="#"
            className="flex items-center gap-3 group cursor-pointer shrink-0"
            onClick={() => sound.playHover()}
          >
            <div className="relative w-10 h-10 flex items-center justify-center p-0.5 bg-[#071426] border border-[#00BCF2]/40 group-hover:border-[#00BCF2] group-hover:shadow-[0_0_20px_rgba(0,188,242,0.5)] transition-all shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="ORION 1.0 Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,188,242,0.8)] group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm sm:text-base tracking-wider text-white group-hover:text-[#BAE6FD] transition-colors">
                  ORION 1.0
                </span>
                <div className="grid grid-cols-2 gap-0.5 w-2 h-2 shrink-0 opacity-90" title="Microsoft Club">
                  <span className="bg-[#F25022] w-0.8 h-0.8" />
                  <span className="bg-[#7FBA00] w-0.8 h-0.8" />
                  <span className="bg-[#00A4EF] w-0.8 h-0.8" />
                  <span className="bg-[#FFB900] w-0.8 h-0.8" />
                </div>
                <span className="text-[9px] font-mono-hud text-[#020617] bg-[#22D3EE] px-1.5 py-0.2 font-bold shadow-sm">
                  SIST
                </span>
              </div>
              <div className="text-[9px] font-mono-hud text-[#94A3B8] tracking-wider hidden sm:block">
                MICROSOFT CLUB SIST
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center">
            <GooeyNav 
              items={navItems}
              particleCount={6}
              particleDistances={[50, 8]}
              particleR={60}
              animationTime={350}
              colors={[1, 2, 3, 4]}
            />
          </div>

          {/* Action Controls (Desktop / Tablet) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            
            {/* Audio Switcher */}
            <button
              onClick={toggleAudio}
              className={`p-2 border text-xs font-mono-hud transition-all flex items-center gap-1.5 cursor-pointer ${
                soundEnabled 
                  ? 'bg-[#071426] border-[#00BCF2] text-[#22D3EE] shadow-[0_0_12px_rgba(0,188,242,0.3)]' 
                  : 'bg-[#0B1220] border-[rgba(0,188,242,0.15)] text-[#94A3B8] hover:text-white hover:border-[#00BCF2]/50'
              }`}
              title={soundEnabled ? "Disable SFX" : "Enable SFX Audio"}
              aria-label="Toggle SFX Audio"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#22D3EE]" /> : <VolumeX className="w-3.5 h-3.5 text-[#94A3B8]" />}
              <span className="text-[10px] hidden xl:inline">{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
            </button>

            {/* Team Status Lookup */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenStatus();
              }}
              className="px-3.5 py-2 border border-[rgba(0,188,242,0.18)] bg-[#0B1220] hover:bg-[#071426] hover:border-[#00BCF2]/60 text-xs font-mono-hud text-[#94A3B8] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>SQUAD STATUS</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="btn-sheen btn-glow-cyan px-4.5 py-2 font-display font-bold text-xs tracking-wider text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-[#020617]" />
              <span>REGISTER — ₹100</span>
            </button>
          </div>

          {/* Mobile Action Buttons & Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="btn-sheen px-3.5 py-1.5 font-display font-bold text-[11px] text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] active:scale-95 transition-transform shadow-md"
            >
              REGISTER ₹100
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#0B1220] border border-[rgba(0,188,242,0.2)] text-[#94A3B8] hover:text-white hover:border-[#00BCF2]/50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B1220]/98 backdrop-blur-2xl border-b border-[#00BCF2]/30 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
            <div className="text-[10px] font-mono-hud text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
              <span>MISSION SECTORS</span>
              <span className="w-1.5 h-1.5 bg-[#00BCF2] animate-ping" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => {
                      sound.playClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 border text-xs font-mono-hud transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-[#071426] border-[#00BCF2] text-[#22D3EE] font-bold shadow-[0_0_10px_rgba(0,188,242,0.2)]'
                        : 'bg-[#020617] border-[rgba(0,188,242,0.12)] text-[#94A3B8] hover:text-white hover:border-[#00BCF2]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 text-[#22D3EE]" />
                  </a>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2 border-t border-[rgba(0,188,242,0.12)]">
              <button
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                  onOpenStatus();
                }}
                className="flex-1 py-2.5 bg-[#071426] border border-[rgba(0,188,242,0.2)] text-xs font-mono-hud text-[#94A3B8] hover:text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Search className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>SQUAD STATUS LOOKUP</span>
              </button>
              <button
                onClick={toggleAudio}
                className="p-2.5 bg-[#071426] border border-[rgba(0,188,242,0.2)] text-xs font-mono-hud text-[#94A3B8]"
                title="Toggle Audio"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#22D3EE]" /> : <VolumeX className="w-4 h-4 text-[#94A3B8]" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Quick Action Bar */}
      <nav 
        aria-label="Mobile quick actions"
        className="fixed bottom-3 inset-x-3 z-40 lg:hidden pointer-events-auto"
      >
        <div className="p-1.5 bg-[#0B1220]/95 backdrop-blur-xl border border-[#00BCF2]/40 shadow-[0_8px_32px_rgba(0,0,0,0.9)] flex items-center gap-2">
          <button
            onClick={() => {
              sound.playLaunchWarp();
              onOpenRegister();
            }}
            className="btn-sheen flex-1 py-2.5 px-3 font-display font-bold text-xs tracking-wider text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5 text-[#020617]" />
            <span>REGISTER SQUAD — ₹100</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenStatus();
            }}
            className="py-2.5 px-3 bg-[#071426] border border-[rgba(0,188,242,0.2)] text-[#94A3B8] text-xs font-mono-hud flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="hidden xs:inline">STATUS</span>
          </button>
        </div>
      </nav>
    </>
  );
};
