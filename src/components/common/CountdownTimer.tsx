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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    <div className="w-full bg-[#07193D]/95 border border-[rgba(212,233,255,0.16)] p-3.5 sm:p-6 rounded-none shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[rgba(212,233,255,0.12)]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="text-xs font-mono-hud text-[#F8FAFC] font-bold uppercase tracking-wider">
            ROUND 1 LAUNCH WINDOW COUNTDOWN
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono-hud text-[#38BDF8] bg-[#040E24] px-2 py-0.5 border border-[#38BDF8]/40 rounded-none font-semibold self-start sm:self-auto">
          <ShieldAlert className="w-3 h-3 text-[#38BDF8]" />
          <span>STRICT DEADLINE: {EVENT_METRICS.deadlineDate.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-4 text-center">
        {timeUnits.map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center bg-[#040E24] border border-[rgba(212,233,255,0.12)] p-2 sm:p-3.5 rounded-none">
            <div className="text-xl sm:text-4xl md:text-5xl font-mono-hud font-black text-white tracking-tight tabular-nums">
              {isClient ? String(unit.value).padStart(2, '0') : '00'}
            </div>
            <span className="text-[8px] sm:text-[10px] font-mono-hud text-[#38BDF8] tracking-widest mt-1 font-semibold">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-[9px] sm:text-[10px] font-mono-hud text-[#7DD3FC]">
        STANDARD PPT SUBMISSION PORTAL CLOSES AT 23:59:59 IST
      </div>
    </div>
  );
};
