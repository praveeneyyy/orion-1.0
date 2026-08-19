'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const telemetryLogs = [
    "INITIALIZING SPATIAL CONSTELLATION MESH...",
    "CONNECTING MICROSOFT CLUB SIST TELEMETRY RELAY...",
    "SYNCHRONIZING AZURE AI & 3D STELLAR VIEWPORT...",
    "CALIBRATING MISSION VECTORS // SIST CHENNAI...",
    "ALL MISSION SYSTEMS SYNCHRONIZED // READY"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              window.scrollTo(0, 0);
              onComplete();
            }, 350);
          }, 150);
          return 100;
        }

        const increment = Math.floor(Math.random() * 16 + 10);
        const next = Math.min(prev + increment, 100);

        if (next < 25) setStageIndex(0);
        else if (next < 50) setStageIndex(1);
        else if (next < 75) setStageIndex(2);
        else if (next < 95) setStageIndex(3);
        else setStageIndex(4);

        return next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] text-slate-100 overflow-hidden transition-all duration-400 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Azure Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(0, 120, 212, 0.25) 0%, rgba(7, 20, 38, 0.7) 45%, #020617 85%)'
        }}
      />

      {/* Main Mission Loading Console */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        
        {/* Animated Gyroscopic HUD Orbital Ring */}
        <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
          
          {/* Outer Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#00BCF2]/30 animate-[spin_10s_linear_infinite]" />
          
          {/* Middle Counter-Rotating Ring */}
          <div className="absolute inset-2.5 rounded-full border border-[rgba(0,188,242,0.2)] border-t-[#00BCF2] border-r-transparent animate-[spin_5s_linear_infinite_reverse]" />
          
          {/* Central Official Logo Lockup */}
          <div className="relative z-10 w-20 h-20 bg-[#0B1220] border border-[#00BCF2]/60 flex items-center justify-center p-1.5 shadow-[0_0_30px_rgba(0,188,242,0.6)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="ORION 1.0" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,188,242,0.9)] animate-pulse"
            />
          </div>
        </div>

        {/* Mission Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B1220] border border-[#00BCF2]/30 text-[10px] font-mono-hud text-[#22D3EE] mb-2.5 shadow-sm">
            <div className="grid grid-cols-2 gap-0.5 w-2 h-2" title="Microsoft Club">
              <span className="bg-[#F25022] w-0.8 h-0.8" />
              <span className="bg-[#7FBA00] w-0.8 h-0.8" />
              <span className="bg-[#00A4EF] w-0.8 h-0.8" />
              <span className="bg-[#FFB900] w-0.8 h-0.8" />
            </div>
            <span>MICROSOFT CLUB SIST // CHENNAI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            ORION <span className="text-gradient-frost-azure">1.0</span>
          </h2>
          <p className="text-[10px] font-mono-hud font-bold tracking-[0.25em] text-[#22D3EE] uppercase mt-1">
            IGNITE THE GENESIS OF INNOVATION
          </p>
        </div>

        {/* Progress Bar & Number Readout */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between text-xs font-mono-hud text-[#94A3B8] mb-2 font-bold">
            <span className="flex items-center gap-1.5 text-[#22D3EE]">
              <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
              TELEMETRY BUS
            </span>
            <span className="text-white text-sm font-black tabular-nums">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>

          {/* Technical Progress Track */}
          <div className="w-full h-1.5 bg-[#071426] border border-[rgba(0,188,242,0.2)] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#0078D4] via-[#00BCF2] to-[#22D3EE] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(0,188,242,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Diagnostics Log Feed */}
        <div className="w-full p-2.5 bg-[#0B1220]/90 border border-[rgba(0,188,242,0.15)] text-left min-h-[42px] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#22D3EE] font-mono-hud text-xs shrink-0">›</span>
            <span className="text-[11px] font-mono-hud text-[#94A3B8] truncate">
              {telemetryLogs[stageIndex]}
            </span>
          </div>
          <span className="text-[9px] font-mono-hud text-[#22D3EE] shrink-0 uppercase ml-2 bg-[#020617] px-1.5 py-0.5 border border-[rgba(0,188,242,0.2)]">
            SYS 0{stageIndex + 1}
          </span>
        </div>

        {/* Bottom Metadata Lockup */}
        <div className="mt-5 flex items-center justify-between w-full text-[9px] font-mono-hud text-[#94A3B8] border-t border-[rgba(0,188,242,0.1)] pt-3">
          <span className="flex items-center gap-1 text-[#22D3EE]">
            <Globe className="w-3 h-3 text-[#00BCF2]" />
            GEO: 12.8718° N, 80.2206° E
          </span>
          <span className="text-white font-semibold">
            PRIZE POOL: ₹1,00,000
          </span>
        </div>

      </div>
    </div>
  );
};
