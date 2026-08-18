'use client';

import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Search, 
  Menu, 
  X,
  Compass,
  Layers,
  ChevronRight
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  const navItems = [
    { label: "CHALLENGES", href: "#challenges" },
    { label: "BOUNTIES", href: "#prizes" },
    { label: "PHASES", href: "#phases" },
    { label: "BLUEPRINT", href: "#blueprint" },
    { label: "LOGISTICS", href: "#hospitality" },
    { label: "TIMELINE", href: "#timeline" },
    { label: "LEADERSHIP", href: "#leadership" },
    { label: "INTEL", href: "#faq" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-[#07193D]/95 backdrop-blur-xl border-b border-[rgba(212,233,255,0.16)] shadow-xl' 
          : 'py-2.5 bg-[#040E24]/85 backdrop-blur-md border-b border-[rgba(212,233,255,0.08)]'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">
          
          {/* Brand Lockup */}
          <a 
            href="#"
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            onClick={() => sound.playHover()}
          >
            <div className="w-7 h-7 rounded-none bg-[#0B2556] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform shadow-md">
              <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xs sm:text-sm tracking-wider text-white group-hover:text-[#BAE6FD] transition-colors">
                  ORION 1.0
                </span>
                <span className="text-[9px] font-mono-hud text-[#040E24] bg-[#38BDF8] px-1 py-0.2 rounded-none font-bold">
                  SIST
                </span>
              </div>
              <div className="text-[8px] font-mono-hud text-[#7DD3FC] tracking-wider hidden sm:block">
                MICROSOFT CLUB CHENNAI
              </div>
            </div>
          </a>

          {/* Desktop Gooey Navigation from React Bits (Sleek Horizontal Bar) */}
          <div className="hidden xl:flex items-center justify-center">
            <GooeyNav 
              items={navItems}
              particleCount={8}
              particleDistances={[50, 8]}
              particleR={60}
              animationTime={350}
              colors={[1, 2, 3, 4]}
            />
          </div>

          {/* Action Controls (Desktop / Tablet) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            
            {/* Audio Switcher */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 rounded-none border text-xs font-mono-hud transition-all flex items-center gap-1.5 cursor-pointer ${
                soundEnabled 
                  ? 'bg-[#0B2556] border-[#38BDF8] text-[#38BDF8] shadow-sm' 
                  : 'bg-[#07193D] border-[rgba(212,233,255,0.12)] text-[#BAE6FD] hover:text-white'
              }`}
              title={soundEnabled ? "Disable SFX" : "Enable SFX Audio"}
              aria-label="Toggle SFX Audio"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" /> : <VolumeX className="w-3.5 h-3.5 text-[#BAE6FD]" />}
              <span className="text-[10px] hidden xl:inline">{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
            </button>

            {/* Team Status Lookup */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenStatus();
              }}
              className="px-3 py-1.5 rounded-none border border-[rgba(212,233,255,0.16)] bg-[#07193D] hover:bg-[#0B2556] text-xs font-mono-hud text-[#BAE6FD] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3 h-3 text-[#38BDF8]" />
              <span>SQUAD STATUS</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="px-3.5 py-1.5 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-[#040E24]" />
              <span>REGISTER — ₹100</span>
            </button>
          </div>

          {/* Mobile Quick Action Buttons & Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                sound.playLaunchWarp();
                onOpenRegister();
              }}
              className="px-3 py-1.5 rounded-none font-display font-bold text-[11px] text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] active:scale-95 transition-transform"
            >
              REGISTER ₹100
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.16)] text-[#BAE6FD]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#07193D]/98 backdrop-blur-2xl border-b border-[rgba(212,233,255,0.16)] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="text-[10px] font-mono-hud text-[#7DD3FC] uppercase tracking-wider">
              MISSION TELEMETRY SECTORS
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => {
                    sound.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.12)] text-xs font-mono-hud text-[#BAE6FD] hover:text-white hover:border-[#38BDF8] flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3 h-3 text-[#38BDF8]" />
                </a>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-[rgba(212,233,255,0.1)]">
              <button
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                  onOpenStatus();
                }}
                className="flex-1 py-2.5 rounded-none bg-[#0B2556] border border-[rgba(212,233,255,0.16)] text-xs font-mono-hud text-[#BAE6FD] flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>SQUAD STATUS LOOKUP</span>
              </button>
              <button
                onClick={toggleAudio}
                className="p-2.5 rounded-none bg-[#0B2556] border border-[rgba(212,233,255,0.16)] text-xs font-mono-hud text-[#BAE6FD]"
                title="Toggle Audio"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#38BDF8]" /> : <VolumeX className="w-4 h-4 text-[#BAE6FD]" />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Quick Action Bar for Mobile & Tablet Touch Devices */}
      <nav 
        aria-label="Mobile quick actions"
        className="fixed bottom-3 inset-x-3 z-40 lg:hidden pointer-events-auto"
      >
        <div className="p-1.5 rounded-none bg-[#07193D]/95 backdrop-blur-xl border border-[rgba(212,233,255,0.2)] shadow-2xl flex items-center gap-2">
          <button
            onClick={() => {
              sound.playLaunchWarp();
              onOpenRegister();
            }}
            className="flex-1 py-2.5 px-3 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5 text-[#040E24]" />
            <span>REGISTER SQUAD — ₹100</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenStatus();
            }}
            className="py-2.5 px-3 rounded-none bg-[#0B2556] border border-[rgba(212,233,255,0.16)] text-[#BAE6FD] text-xs font-mono-hud flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden xs:inline">STATUS</span>
          </button>
        </div>
      </nav>
    </>
  );
};
