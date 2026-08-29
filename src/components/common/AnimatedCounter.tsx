'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1600,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // If reduced motion is preferred, display static value (already initialized to value)
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Extract numeric components and prefix/suffix
    const match = value.match(/^([^0-9]*)([\d,]+)(.*)$/);
    if (!match) {
      return;
    }

    const prefix = match[1] || '';
    const rawNumberStr = match[2].replace(/,/g, '');
    const targetNumber = parseInt(rawNumberStr, 10);
    const suffix = match[3] || '';

    if (isNaN(targetNumber)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease-out cubic curve
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.floor(easeProgress * targetNumber);

            // Format with Indian numbering system if target was >= 1000
            let formattedNumber = String(currentNumber);
            if (rawNumberStr.length >= 4) {
              formattedNumber = currentNumber.toLocaleString('en-IN');
            }

            setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
};

export default AnimatedCounter;
