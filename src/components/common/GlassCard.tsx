'use client';

import React, { useRef, useState, useCallback } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'violet' | 'emerald' | 'amber';
  withHudCorners?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  withHudCorners = false,
  onClick,
  style = {}
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowColorMap = {
    cyan: 'rgba(56, 189, 248, 0.25)',
    violet: 'rgba(96, 165, 250, 0.25)',
    emerald: 'rgba(52, 211, 153, 0.22)',
    amber: 'rgba(56, 189, 248, 0.25)'
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={style}
      className={`
        relative overflow-hidden transition-all duration-300
        bg-[#07193D]/90 backdrop-blur-xl border border-[rgba(212,233,255,0.14)] rounded-none
        hover:border-[#38BDF8]/60 hover:bg-[#0B2556]/95
        ${withHudCorners ? 'hud-corner' : ''}
        ${className}
      `}
    >
      {/* High-tech top edge accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Cybernetic Micro Crosshairs */}
      {withHudCorners && (
        <>
          <span className="absolute top-1.5 right-1.5 font-mono-hud text-[7px] text-[#38BDF8]/40 select-none pointer-events-none">+</span>
          <span className="absolute bottom-1.5 left-1.5 font-mono-hud text-[7px] text-[#38BDF8]/40 select-none pointer-events-none">+</span>
        </>
      )}

      {/* Dynamic mouse spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColorMap[glowColor]}, transparent 70%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
