"use client";

import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function ElectricBorder({
  children,
  color = "#7df9ff",
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style = {},
  className = ""
}: ElectricBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateBorder = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Create animated border path
      const points = [];
      const segments = 20;
      
      for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        let x, y;
        
        if (progress < 0.25) {
          // Top edge
          x = progress * 4 * width;
          y = 0;
        } else if (progress < 0.5) {
          // Right edge
          x = width;
          y = (progress - 0.25) * 4 * height;
        } else if (progress < 0.75) {
          // Bottom edge
          x = width - (progress - 0.5) * 4 * width;
          y = height;
        } else {
          // Left edge
          x = 0;
          y = height - (progress - 0.75) * 4 * height;
        }
        
        // Add chaos/noise
        const noiseX = (Math.random() - 0.5) * chaos * 10;
        const noiseY = (Math.random() - 0.5) * chaos * 10;
        
        points.push({
          x: x + noiseX,
          y: y + noiseY
        });
      }
      
      // Create SVG path
      let pathData = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
      }
      pathData += ' Z';
      
      // Update SVG
      const svg = container.querySelector('svg');
      if (svg) {
        const path = svg.querySelector('path');
        if (path) {
          path.setAttribute('d', pathData);
        }
      }
    };

    const animate = () => {
      updateBorder();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle resize
    const handleResize = () => {
      updateBorder();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [chaos]);

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
    >
      {/* Animated Border SVG */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          '& svg': {
            width: '100%',
            height: '100%',
            overflow: 'visible'
          }
        }}
      >
        <svg>
          <defs>
            <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="25%" stopColor={color} stopOpacity="1" />
              <stop offset="50%" stopColor={color} stopOpacity="0.6" />
              <stop offset="75%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M 0 0 L 100 0 L 100 100 L 0 100 Z"
            fill="none"
            stroke="url(#electricGradient)"
            strokeWidth={thickness}
            filter="url(#glow)"
            style={{
              animation: `electricPulse ${2 / speed}s ease-in-out infinite alternate`
            }}
          />
        </svg>
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          padding: `${thickness + 4}px`,
          borderRadius: style.borderRadius || '8px',
          background: 'transparent'
        }}
      >
        {children}
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes electricPulse {
          0% {
            stroke-opacity: 0.6;
            filter: url(#glow) brightness(1);
          }
          50% {
            stroke-opacity: 1;
            filter: url(#glow) brightness(1.5);
          }
          100% {
            stroke-opacity: 0.8;
            filter: url(#glow) brightness(1.2);
          }
        }
        
        @keyframes electricFlow {
          0% {
            stroke-dasharray: 0 1000;
          }
          100% {
            stroke-dasharray: 1000 0;
          }
        }
      `}</style>
    </Box>
  );
}
