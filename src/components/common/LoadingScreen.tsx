'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

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
        return Math.min(prev + Math.floor(Math.random() * 15 + 10), 100);
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-slate-100 overflow-hidden transition-all duration-400 select-none ${
        isFadingOut ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        
        {/* Emblem & Spinner */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-blue-500/10 border border-blue-500/20 animate-pulse" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.png" 
            alt="ORION 1.0" 
            className="w-12 h-12 object-contain relative z-10 filter drop-shadow-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-display font-black text-white tracking-tight mb-1">
          ORION <span className="text-blue-400">1.0</span>
        </h1>
        <p className="text-xs font-sans text-slate-400 mb-6 font-medium">
          Microsoft Club SIST • 24H National Hackathon
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full p-1 mb-3">
          <div
            className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>Loading platform... {progress}%</span>
        </div>

      </div>
    </div>
  );
};
