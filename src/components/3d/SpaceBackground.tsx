'use client';

import React from 'react';
import WebThreads from '../common/WebThreads';

export const SpaceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* WebThreads Canvas */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <WebThreads
          color1="#3B82F6"
          color2="#60A5FA"
          color3="#FFFFFF"
          speed={0.15}
          threadCount={7}
          frequency={4.5}
          spread={0.22}
          taper={0.8}
          position={0.45}
          fanMode="center"
          glow={0.03}
          falloff={0.55}
          thickness={1.2}
          brightness={0.5}
          opacity={0.85}
          mirror={true}
          shimmer={true}
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={false}
          mouseStrength={0}
        />
      </div>

      {/* Soft Ambient Radial Lights */}
      <div 
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[140px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)'
        }}
      />
      <div 
        className="absolute top-[45%] right-[-5%] w-[650px] h-[650px] rounded-full blur-[160px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.08) 60%, transparent 80%)'
        }}
      />
    </div>
  );
};
