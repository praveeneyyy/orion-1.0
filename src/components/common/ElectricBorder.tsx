'use client';

import React, { useEffect, useRef } from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#00F0FF',
  speed = 1.0,
  chaos = 0.06,
  thickness = 1.5,
  borderRadius = 0,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = (rect.width + 40) * dpr;
      canvas.height = (rect.height + 40) * dpr;
      canvas.style.width = `${rect.width + 40}px`;
      canvas.style.height = `${rect.height + 40}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Simple 2D Noise
    const pseudoNoise = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t) * 0.5 +
        Math.sin(x * 0.1 - t * 1.5) * 0.25 +
        Math.cos(y * 0.1 + t * 2) * 0.25
      );
    };

    const draw = () => {
      if (!canvas || !ctx || !container) return;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const pad = 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pad, pad);

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();

      const step = 6;
      const totalPerimeter = (w + h) * 2;
      const pointsCount = Math.floor(totalPerimeter / step);

      for (let i = 0; i <= pointsCount; i++) {
        const dist = (i / pointsCount) * totalPerimeter;
        let x = 0;
        let y = 0;

        if (dist <= w) {
          x = dist;
          y = 0;
        } else if (dist <= w + h) {
          x = w;
          y = dist - w;
        } else if (dist <= w * 2 + h) {
          x = w - (dist - (w + h));
          y = h;
        } else {
          x = 0;
          y = h - (dist - (w * 2 + h));
        }

        const noiseVal = pseudoNoise(x, y, time * speed) * chaos * 12;
        const nx = x + (y === 0 ? 0 : y === h ? 0 : noiseVal);
        const ny = y + (x === 0 ? 0 : x === w ? 0 : noiseVal);

        if (i === 0) {
          ctx.moveTo(nx, ny);
        } else {
          ctx.lineTo(nx, ny);
        }
      }

      ctx.closePath();
      ctx.stroke();

      ctx.restore();
      time += 0.03;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [color, speed, chaos, thickness, borderRadius]);

  return (
    <div
      ref={containerRef}
      className={`electric-border rounded-none ${className}`}
      style={{ borderRadius: 0, ...style }}
    >
      <div className="eb-canvas-container pointer-events-none rounded-none">
        <canvas ref={canvasRef} className="eb-canvas rounded-none" />
      </div>
      <div className="eb-layers pointer-events-none rounded-none">
        <div className="eb-glow-1 rounded-none" />
        <div className="eb-glow-2 rounded-none" />
        <div className="eb-background-glow rounded-none" />
      </div>
      <div className="eb-content relative z-10 rounded-none">{children}</div>
    </div>
  );
};

export default ElectricBorder;
