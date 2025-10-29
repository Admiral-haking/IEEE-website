"use client";

import React, { useRef, useCallback } from 'react';

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ClickSpark({
  children,
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  className = '',
  style = {}
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const createSpark = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return;

    // Create spark container
    const sparkContainer = document.createElement('div');
    sparkContainer.style.position = 'absolute';
    sparkContainer.style.left = `${x}px`;
    sparkContainer.style.top = `${y}px`;
    sparkContainer.style.pointerEvents = 'none';
    sparkContainer.style.zIndex = '1000';
    sparkContainer.style.transform = 'translate(-50%, -50%)';

    // Create individual sparks
    const count = prefersReducedMotion ? Math.max(2, Math.floor(sparkCount / 2)) : sparkCount;
    const size = prefersReducedMotion ? Math.max(4, Math.floor(sparkSize / 2)) : sparkSize;
    const radius = prefersReducedMotion ? Math.max(8, Math.floor(sparkRadius / 2)) : sparkRadius;
    const life = prefersReducedMotion ? Math.max(220, Math.floor(duration * 0.6)) : duration;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      
      // Calculate angle for this spark
      const angle = (i / sparkCount) * Math.PI * 2;
      
      // Calculate end position
      const endX = Math.cos(angle) * radius;
      const endY = Math.sin(angle) * radius;
      
      // Set spark styles
      spark.style.position = 'absolute';
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.backgroundColor = sparkColor;
      spark.style.borderRadius = '50%';
      spark.style.left = '0';
      spark.style.top = '0';
      spark.style.transform = 'translate(-50%, -50%)';
      spark.style.opacity = '1';
      spark.style.boxShadow = `0 0 ${size}px ${sparkColor}`;
      
      // Create animation
      const animation = spark.animate([
        {
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`,
          opacity: 0
        }
      ], {
        duration: life,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });

      sparkContainer.appendChild(spark);
      
      // Remove spark after animation
      animation.addEventListener('finish', () => {
        spark.remove();
      });
    }

    container.appendChild(sparkContainer);
    
    // Remove container after all sparks are done
    setTimeout(() => {
      sparkContainer.remove();
    }, (prefersReducedMotion ? Math.max(220, Math.floor(duration * 0.6)) : duration) + 100);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, prefersReducedMotion]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createSpark(x, y);
  }, [createSpark]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer',
        ...style
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
