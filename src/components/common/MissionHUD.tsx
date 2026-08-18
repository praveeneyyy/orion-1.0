'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Radio } from 'lucide-react';

export const MissionHUD: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeStage, setActiveStage] = useState('01 // INITIALIZATION');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const updateHUD = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.round((window.scrollY / total) * 100), 100) : 0;
      setScrollPercent(progress);

      if (progress < 15) setActiveStage('01 // ORION LAUNCHPAD');
      else if (progress < 30) setActiveStage('02 // PRIZE ORBIT');
      else if (progress < 45) setActiveStage('03 // TWO-PHASE VECTOR');
      else if (progress < 60) setActiveStage('04 // CHALLENGE ARENA');
      else if (progress < 75) setActiveStage('05 // SUBMISSION CONSOLE');
      else if (progress < 90) setActiveStage('06 // FLIGHT TIMELINE');
      else setActiveStage('07 // FINAL LAUNCH DOCK');
    };

    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };

    window.addEventListener('scroll', updateHUD, { passive: true });
    const interval = setInterval(updateTime, 100);

    return () => {
      window.removeEventListener('scroll', updateHUD);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <aside aria-label="Flight Telemetry" className="fixed bottom-3 left-3 z-30 hidden xl:flex flex-col gap-1.5 p-2.5 bg-[#07193D]/95 border border-[rgba(212,233,255,0.16)] text-[10px] font-mono-hud text-[#BAE6FD] select-none pointer-events-none backdrop-blur-md rounded-none shadow-xl">
        <div className="flex items-center gap-2 text-[#38BDF8]">
          <Radio className="w-3 h-3 text-[#38BDF8]" />
          <span className="font-bold tracking-wider">ORION-1 TELEMETRY HUD</span>
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 ml-auto" />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1 border-t border-[rgba(212,233,255,0.1)] text-[9px]">
          <div>
            <span className="text-[#7DD3FC]">STAGE: </span>
            <span className="text-white">{activeStage}</span>
          </div>
          <div>
            <span className="text-[#7DD3FC]">SYS TIME: </span>
            <span className="text-[#38BDF8]">{timestamp}</span>
          </div>
          <div>
            <span className="text-[#7DD3FC]">MISSION BASE: </span>
            <span className="text-white">SIST CHENNAI</span>
          </div>
          <div>
            <span className="text-[#7DD3FC]">COORDS: </span>
            <span className="text-white">12.8731° N, 80.2210° E</span>
          </div>
        </div>
      </aside>

      <aside aria-label="Mission Orbit Progress" className="fixed bottom-3 right-3 z-30 hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#07193D]/95 border border-[rgba(212,233,255,0.16)] text-[10px] font-mono-hud text-[#BAE6FD] select-none pointer-events-none rounded-none shadow-xl">
        <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>ORBIT PROGRESS:</span>
        <div className="w-16 h-1.5 bg-[#040E24] rounded-none overflow-hidden border border-[rgba(212,233,255,0.1)]">
          <div 
            className="h-full bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#38BDF8] rounded-none transition-all duration-150"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>
        <span className="text-white font-bold min-w-[28px]">{scrollPercent}%</span>
      </aside>
    </>
  );
};
