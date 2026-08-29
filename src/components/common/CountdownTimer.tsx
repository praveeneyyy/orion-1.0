'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import { EVENT_METRICS } from '../../data/orionData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const isClient = React.useSyncExternalStore(() => () => {}, () => true, () => false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(EVENT_METRICS.deadlineIso).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full bg-[#0B1220]/75 backdrop-blur-2xl border border-white/15 border-t-white/30 p-3.5 sm:p-6 rounded-none shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00BCF2]" />
          <span className="text-xs font-sans text-[#F8FAFC] font-bold uppercase tracking-wider">
            ROUND 1 LAUNCH WINDOW COUNTDOWN
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-sans text-[#22D3EE] bg-[#071426]/90 px-2.5 py-1 border border-[#00BCF2]/40 rounded-none font-semibold self-start sm:self-auto backdrop-blur-xl">
          <ShieldAlert className="w-3 h-3 text-[#22D3EE]" />
          <span>ROUND 1 CLOSES: {EVENT_METRICS.deadlineDate.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-4 text-center">
        {timeUnits.map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center bg-[#071426]/80 backdrop-blur-xl border border-white/10 p-2.5 sm:p-4 rounded-none">
            <div className="text-xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight tabular-nums">
              {isClient ? String(unit.value).padStart(2, '0') : '00'}
            </div>
            <span className="text-[8px] sm:text-[10px] font-sans text-[#22D3EE] tracking-widest mt-1 font-semibold">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[10px] font-sans text-[#94A3B8] pt-2 border-t border-white/10 gap-1">
        <span>ONLINE QUALIFIER DEADLINE: SEP 08, 2026 (23:59 IST)</span>
        <span className="text-[#22D3EE] font-bold">24H OFFLINE FINALE: SEP 18, 2026 @ SIST CHENNAI</span>
      </div>
    </div>
  );
};
