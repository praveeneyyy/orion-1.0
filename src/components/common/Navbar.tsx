'use client';

import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { GooeyNav } from './GooeyNav';
import { sound } from '../../audio/soundEffects';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenStatus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { label: "CHALLENGES", href: "#challenges" },
    { label: "PRIZES", href: "#prizes" },
    { label: "GUIDELINES", href: "#guidelines" },
    { label: "TIMELINE", href: "#timeline" },
    { label: "VENUE & PERKS", href: "#venue" },
    { label: "ORGANIZERS", href: "#organizers" },
    { label: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 220;

      let currentSection = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          currentSection = sections[i];
          break;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIndex = activeSection 
    ? navItems.findIndex(item => item.href === `#${activeSection}`) 
    : -1;

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
          ? 'py-3 bg-[#0B1220]/85 backdrop-blur-2xl border-b border-white/15 shadow-xl' 
          : 'py-4 bg-[#0B1220]/65 backdrop-blur-xl border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Lockup */}
          <a 
            href="#"
            className="flex items-center gap-3 group cursor-pointer shrink-0"
            onClick={() => sound.playHover()}
          >
            <div className="relative w-10 h-10 rounded-none flex items-center justify-center p-1 bg-[#071426] border border-white/10 group-hover:border-[#00BCF2]/50 transition-all shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="ORION 1.0 Logo" 
                className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-[#00BCF2] transition-colors">
                  ORION 1.0
                </span>
                <span className="text-[10px] font-sans text-[#00BCF2] bg-[#00BCF2]/10 px-2 py-0.5 rounded-none font-semibold border border-[#00BCF2]/20">
                  SIST
                </span>
              </div>
              <div className="text-[10px] font-sans text-[#94A3B8] font-medium hidden sm:block">
                Microsoft Club SIST
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center">
            <GooeyNav 
              items={navItems}
              activeIndex={activeIndex}
              particleCount={6}
              particleDistances={[50, 8]}
              particleR={60}
              animationTime={350}
              colors={[1, 2, 3, 4]}
            />
          </div>

          {/* Desktop Action Controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            
            {/* Audio Switcher */}
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-none border text-xs font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                soundEnabled 
                  ? 'bg-[#071426] border-[#00BCF2]/50 text-[#00BCF2] shadow-sm' 
                  : 'bg-[#0B1220]/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
              title={soundEnabled ? "Disable Sound Effects" : "Enable Sound Effects"}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00BCF2]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="btn-glow-cyan px-5 py-2.5 rounded-none font-sans font-bold text-xs tracking-wide text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md flex items-center gap-2 active:scale-98 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-[#020617]" />
              <span>Register Team — ₹100</span>
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="px-3.5 py-2 rounded-none font-sans font-bold text-xs text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] active:scale-95 transition-transform shadow-sm"
            >
              Register ₹100
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-none bg-[#071426] border border-white/10 text-slate-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B1220]/95 backdrop-blur-2xl border-b border-white/15 px-4 py-4 space-y-3 shadow-2xl">
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
                    className={`p-3 rounded-none border text-xs font-sans font-medium transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-[#00BCF2]/10 border-[#00BCF2]/40 text-[#00BCF2] font-bold'
                        : 'bg-[#071426]/60 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#00BCF2]" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Quick Action Bar for Mobile */}
      <nav 
        aria-label="Mobile quick actions"
        className="fixed bottom-3 inset-x-3 z-40 lg:hidden pointer-events-auto"
      >
        <div className="p-2 bg-[#0B1220]/95 backdrop-blur-2xl border border-white/15 rounded-none shadow-2xl flex items-center">
          <button
            onClick={() => {
              sound.playLaunchWarp();
              onOpenRegister();
            }}
            className="w-full py-3 px-4 rounded-none font-sans font-bold text-xs text-[#020617] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-[#020617]" />
            <span>Register Your Team — ₹100</span>
          </button>
        </div>
      </nav>
    </>
  );
};
