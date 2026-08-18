'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Shield, Cpu, Globe } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const telemetryLogs = [
    "INITIALIZING SPATIAL ORBITAL KERNEL...",
    "CONNECTING SIST CHENNAI TELEMETRY RELAY...",
    "CALIBRATING 3D CONSTELLATION & SHADER MESH...",
    "INITIALIZING ZK-SNARK & ARGO OCEAN DATA BUS...",
    "ALIGNING FLIGHT VECTORS: 12.8718° N, 80.2206° E...",
    "ALL MISSION SYSTEMS SYNCHRONIZED // READY"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 450);
          }, 200);
          return 100;
        }

        const increment = Math.floor(Math.random() * 12 + 6);
        const next = Math.min(prev + increment, 100);

        // Update stage based on progress percentage
        if (next < 20) setStageIndex(0);
        else if (next < 40) setStageIndex(1);
        else if (next < 60) setStageIndex(2);
        else if (next < 80) setStageIndex(3);
        else if (next < 95) setStageIndex(4);
        else setStageIndex(5);

        return next;
      });
    }, 55);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040E24] text-slate-100 overflow-hidden transition-all duration-500 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Frost-to-Cobalt Gradient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(16, 51, 116, 0.45) 0%, rgba(7, 25, 61, 0.7) 40%, #040E24 85%)'
        }}
      />

      {/* Background HUD Grid Lines */}
      <div className="absolute inset-0 hud-grid-pattern opacity-20 pointer-events-none" />

      {/* Main Mission Loading Console */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        
        {/* Animated Gyroscopic HUD Orbital Ring */}
        <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
          
          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#38BDF8]/30 animate-[spin_12s_linear_infinite]" />
          
          {/* Middle Counter-Rotating Reticle */}
          <div className="absolute inset-3 rounded-full border border-[rgba(212,233,255,0.2)] border-t-[#38BDF8] border-r-transparent animate-[spin_6s_linear_infinite_reverse]" />
          
          {/* Inner Glowing Orbit Ring */}
          <div className="absolute inset-7 rounded-full border border-[#38BDF8]/40 border-b-transparent animate-[spin_4s_linear_infinite]" />

          {/* Coordinate Crosshairs */}
          <div className="absolute w-full h-[1px] bg-[rgba(212,233,255,0.15)] pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-[rgba(212,233,255,0.15)] pointer-events-none" />

          {/* Core Radar Scanner Sweep */}
          <div 
            className="absolute inset-4 rounded-full pointer-events-none animate-[spin_2.5s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.35) 0deg, rgba(56, 189, 248, 0) 90deg, transparent 360deg)'
            }}
          />

          {/* Central Logo Lockup */}
          <div className="relative z-10 w-16 h-16 bg-[#07193D] border border-[#38BDF8]/60 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)]">
            <span className="font-display font-black text-xl text-white tracking-wider">
              O1
            </span>
            <span className="text-[7px] font-mono-hud text-[#38BDF8] tracking-widest font-bold">
              SIST
            </span>
          </div>

          {/* Cardinal Coordinate Ticks */}
          <span className="absolute top-1 text-[8px] font-mono-hud text-[#7DD3FC]">000°</span>
          <span className="absolute right-1 text-[8px] font-mono-hud text-[#7DD3FC]">090°</span>
          <span className="absolute bottom-1 text-[8px] font-mono-hud text-[#7DD3FC]">180°</span>
          <span className="absolute left-1 text-[8px] font-mono-hud text-[#7DD3FC]">270°</span>
        </div>

        {/* Mission Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#07193D] border border-[rgba(212,233,255,0.14)] text-[10px] font-mono-hud text-[#38BDF8] mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#38BDF8]" />
            <span>MICROSOFT CLUB SIST // CHENNAI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            ORION <span className="text-gradient-frost-azure">1.0</span>
          </h2>
          <p className="text-[10px] font-space font-bold tracking-[0.3em] text-[#BAE6FD] uppercase mt-1">
            BUILD BEYOND THE STARS
          </p>
        </div>

        {/* Progress Bar & Number Readout */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs font-mono-hud text-[#BAE6FD] mb-2 font-bold">
            <span className="flex items-center gap-1.5 text-[#38BDF8]">
              <span className="w-1.5 h-1.5 bg-emerald-400" />
              TELEMETRY BUS
            </span>
            <span className="text-white text-sm font-black tabular-nums">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>

          {/* Technical Progress Track */}
          <div className="w-full h-2 bg-[#07193D] border border-[rgba(212,233,255,0.16)] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(56,189,248,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Diagnostics Log Feed */}
        <div className="w-full p-2.5 bg-[#07193D]/90 border border-[rgba(212,233,255,0.12)] text-left min-h-[46px] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#38BDF8] font-mono-hud text-xs shrink-0">›</span>
            <span className="text-[11px] font-mono-hud text-[#BAE6FD] truncate">
              {telemetryLogs[stageIndex]}
            </span>
          </div>
          <span className="text-[9px] font-mono-hud text-[#7DD3FC] shrink-0 uppercase ml-2 bg-[#040E24] px-1.5 py-0.5 border border-[rgba(212,233,255,0.1)]">
            SYS 0{stageIndex + 1}
          </span>
        </div>

        {/* Bottom Metadata Lockup */}
        <div className="mt-6 flex items-center justify-between w-full text-[9px] font-mono-hud text-[#7DD3FC] border-t border-[rgba(212,233,255,0.1)] pt-3">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#38BDF8]" />
            GEO: 12.8718° N, 80.2206° E
          </span>
          <span className="text-white">
            PRIZE POOL: ₹1,00,000
          </span>
        </div>

      </div>
    </div>
  );
};
