'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Rocket, 
  Search, 
  Sparkles, 
  MapPin, 
  Layers, 
  Compass, 
  Globe, 
  Award,
  ChevronRight
} from 'lucide-react';
import { CountdownTimer } from '../common/CountdownTimer';
import { SplitFlapText } from '../common/SplitFlapText';
import { ElectricBorder } from '../common/ElectricBorder';
import { sound } from '../../audio/soundEffects';
import { EVENT_METRICS } from '../../data/orionData';

// Dynamic 3D Scene Imports
const OrionConstellation3D = dynamic(
  () => import('../3d/OrionConstellation3D').then((mod) => mod.OrionConstellation3D),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center font-mono-hud text-xs text-[#7DD3FC]">ALIGNING CONSTELLATION MESH...</div> }
);

const OrionShip3D = dynamic(
  () => import('../3d/OrionShip3D').then((mod) => mod.OrionShip3D),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center font-mono-hud text-xs text-[#7DD3FC]">INITIALIZING PROBE TELEMETRY...</div> }
);

interface HeroSectionProps {
  onOpenRegister: () => void;
  onOpenStatus?: () => void;
  onExplorePrizes?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRegister, onOpenStatus, onExplorePrizes }) => {
  const [active3DMode, setActive3DMode] = useState<'constellation' | 'ship'>('constellation');

  const handleStatusClick = () => {
    sound.playClick();
    if (onOpenStatus) {
      onOpenStatus();
    } else if (onExplorePrizes) {
      onExplorePrizes();
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-16 px-4 flex flex-col justify-center items-center z-10 overflow-hidden">
      
      {/* Top Meta Beacon */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[#07193D] border border-[rgba(212,233,255,0.16)] text-xs font-mono-hud text-[#38BDF8] shadow-lg">
          <span className="w-2 h-2 bg-[#38BDF8]" />
          <span className="font-semibold tracking-wider">MICROSOFT CLUB SIST // ORION 1.0</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1 text-[#BAE6FD]">
            <MapPin className="w-3 h-3 text-[#38BDF8]" />
            SIST CHENNAI
          </span>
        </div>
      </div>

      {/* Main Monumental Headline */}
      <div className="max-w-5xl mx-auto text-center mb-6">
        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight leading-[0.92] text-white">
          BUILD BEYOND <br />
          <span className="text-gradient-frost-azure">
            THE STARS
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-[#BAE6FD] max-w-2xl mx-auto font-sans leading-relaxed font-normal">
          The premier nationwide 24-hour hackathon by <strong className="text-white font-semibold">Microsoft Club SIST</strong>. 
          Pioneering next-generation intelligence across oceanography, cryptography, forestry, and open innovation.
        </p>
      </div>

      {/* Split-Flap Departure Board from React Bits */}
      <div className="mb-10 flex flex-col items-center">
        <div className="text-[10px] font-mono-hud text-[#7DD3FC] mb-2 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-[#38BDF8]" />
          <span>MISSION TELEMETRY DISPATCH</span>
        </div>
        <div className="p-3 rounded-none bg-[#040E24]/90 border border-[rgba(212,233,255,0.16)] shadow-xl">
          <SplitFlapText
            words={[
              'ORION 1.0 READY',
              'POOL ₹1,00,000',
              'TEAM FEE ₹100',
              'TOP 70 TO SIST',
              'AUGUST 28 2026',
              'SIST CHENNAI'
            ]}
            flipDuration={0.1}
            stagger={0.04}
            cycleDelay={2200}
            charset="alphanumeric"
            flipsPerChar={6}
            tileColor="#07193D"
            textColor="#F8FAFC"
            tileRadius={0}
            gap={4}
            fontSize={22}
            loop={true}
            padTo={16}
          />
        </div>
      </div>

      {/* 3D WebGL Interactive Mission Hologram */}
      <div className="w-full max-w-5xl mb-10">
        <ElectricBorder
          color="#38BDF8"
          speed={0.8}
          chaos={0.08}
          thickness={1.5}
          className="w-full"
        >
          <div className="w-full h-[320px] sm:h-[400px] md:h-[460px] bg-[#040E24]/95 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between p-4 sm:p-6">
            
            {/* 3D Scene Controls & HUD Meta */}
            <div className="flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#0B2556] border border-[#38BDF8]/40 text-[#38BDF8]">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono-hud text-white font-bold">
                    {active3DMode === 'constellation' ? 'ORION INTERACTIVE STELLAR MAP' : 'ORION DEEP-SPACE EXPLORER PROBE'}
                  </div>
                  <div className="text-[10px] font-mono-hud text-[#7DD3FC]">
                    INTERACTIVE THREE.JS WEBGL RENDERER // DRAG TO ROTATE
                  </div>
                </div>
              </div>

              {/* 3D Scene Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-[#07193D] p-1 border border-[rgba(212,233,255,0.14)] rounded-none">
                <button
                  onClick={() => {
                    sound.playHover();
                    setActive3DMode('constellation');
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono-hud transition-all cursor-pointer ${
                    active3DMode === 'constellation'
                      ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-sm'
                      : 'text-[#BAE6FD] hover:text-white'
                  }`}
                >
                  CONSTELLATION
                </button>
                <button
                  onClick={() => {
                    sound.playHover();
                    setActive3DMode('ship');
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono-hud transition-all cursor-pointer ${
                    active3DMode === 'ship'
                      ? 'bg-[#38BDF8] text-[#040E24] font-bold shadow-sm'
                      : 'text-[#BAE6FD] hover:text-white'
                  }`}
                >
                  EXPLORER PROBE
                </button>
              </div>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="absolute inset-0 z-10">
              {active3DMode === 'constellation' ? <OrionConstellation3D /> : <OrionShip3D />}
            </div>

            {/* Bottom 3D Viewport Telemetry */}
            <div className="flex items-center justify-between text-[10px] font-mono-hud text-[#7DD3FC] z-20 border-t border-[rgba(212,233,255,0.1)] pt-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#38BDF8]">
                  <Globe className="w-3 h-3" />
                  ORBIT: SIST_GEO_01
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">COORDINATES: 12.8718° N, 80.2206° E</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400" />
                <span className="text-slate-300">TELEMETRY NOMINAL</span>
              </div>
            </div>

          </div>
        </ElectricBorder>
      </div>

      {/* Action Buttons & Launch Links */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mb-12">
        <button
          onClick={() => {
            sound.playLaunchWarp();
            onOpenRegister();
          }}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-none font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
        >
          <Rocket className="w-4 h-4 text-[#040E24]" />
          <span>LAUNCH REGISTRATION — ₹100</span>
          <ChevronRight className="w-4 h-4 text-[#040E24] group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={handleStatusClick}
          className="w-full sm:w-auto py-3.5 px-5 rounded-none font-mono-hud text-xs text-[#BAE6FD] hover:text-white border border-[rgba(212,233,255,0.16)] bg-[#07193D] hover:bg-[#0B2556] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>SQUAD LOOKUP</span>
        </button>
      </div>

      {/* Countdown Timer Module */}
      <div className="w-full max-w-3xl">
        <CountdownTimer />
      </div>

    </section>
  );
};
