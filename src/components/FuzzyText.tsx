"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

interface FuzzyTextProps {
  children: React.ReactNode;
  baseIntensity?: number;
  hoverIntensity?: number;
  enableHover?: boolean;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  sx?: any;
  speed?: number;
}

export default function FuzzyText({
  children,
  baseIntensity = 0.1,
  hoverIntensity = 0.3,
  enableHover = true,
  className = '',
  variant = 'h1',
  sx = {},
  speed = 1
}: FuzzyTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIntensity, setCurrentIntensity] = useState(baseIntensity);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableHover) {
      // Continuous fuzzy effect when hover is disabled
      intervalRef.current = setInterval(() => {
        setCurrentIntensity(baseIntensity + (Math.random() - 0.5) * 0.1);
      }, 100 / speed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [baseIntensity, enableHover, speed]);

  const handleMouseEnter = () => {
    if (enableHover) {
      setIsHovered(true);
      setCurrentIntensity(hoverIntensity);
    }
  };

  const handleMouseLeave = () => {
    if (enableHover) {
      setIsHovered(false);
      setCurrentIntensity(baseIntensity);
    }
  };

  const generateFuzzyStyles = () => {
    const intensity = currentIntensity;
    const blurAmount = intensity * 2;
    const noiseAmount = intensity * 10;
    const distortionAmount = intensity * 3;

    return {
      position: 'relative',
      display: 'inline-block',
      fontFamily: 'var(--font-tech-en), monospace',
      fontWeight: 700,
      filter: `blur(${blurAmount}px) contrast(${1 + intensity}) brightness(${1 + intensity * 0.2})`,
      textShadow: `
        ${distortionAmount}px ${distortionAmount}px 0 rgba(255, 0, 0, ${intensity * 0.3}),
        ${-distortionAmount}px ${-distortionAmount}px 0 rgba(0, 255, 0, ${intensity * 0.3}),
        ${distortionAmount}px ${-distortionAmount}px 0 rgba(0, 0, 255, ${intensity * 0.3}),
        ${-distortionAmount}px ${distortionAmount}px 0 rgba(255, 255, 0, ${intensity * 0.3}),
        0 0 ${noiseAmount}px rgba(255, 255, 255, ${intensity * 0.5})
      `,
      transform: `translate(${(Math.random() - 0.5) * distortionAmount}px, ${(Math.random() - 0.5) * distortionAmount}px)`,
      transition: enableHover ? 'all 0.3s ease' : 'none',
      cursor: enableHover ? 'pointer' : 'default',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
          rgba(255, 255, 255, ${intensity * 0.1}) 0%, 
          transparent 50%)`,
        filter: `blur(${blurAmount * 2}px)`,
        opacity: intensity,
        zIndex: -1,
        animation: enableHover ? 'none' : 'fuzzyNoise 0.1s ease-in-out infinite',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(${Math.random() * 360}deg, 
          rgba(255, 0, 0, ${intensity * 0.05}) 0%, 
          rgba(0, 255, 0, ${intensity * 0.05}) 25%, 
          rgba(0, 0, 255, ${intensity * 0.05}) 50%, 
          rgba(255, 255, 0, ${intensity * 0.05}) 75%, 
          rgba(255, 0, 255, ${intensity * 0.05}) 100%)`,
        filter: `blur(${blurAmount * 1.5}px)`,
        opacity: intensity * 0.5,
        zIndex: -2,
        animation: enableHover ? 'none' : 'fuzzyShift 0.2s ease-in-out infinite',
      },
      '@keyframes fuzzyNoise': {
        '0%': { 
          transform: 'translate(0, 0) scale(1)',
          filter: `blur(${blurAmount * 2}px)`
        },
        '25%': { 
          transform: `translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px) scale(${1 + Math.random() * 0.1})`,
          filter: `blur(${blurAmount * 2.5}px)`
        },
        '50%': { 
          transform: `translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px) scale(${1 + Math.random() * 0.1})`,
          filter: `blur(${blurAmount * 3}px)`
        },
        '75%': { 
          transform: `translate(${(Math.random() - 0.5) * 2}px, ${(Math.random() - 0.5) * 2}px) scale(${1 + Math.random() * 0.1})`,
          filter: `blur(${blurAmount * 2.5}px)`
        },
        '100%': { 
          transform: 'translate(0, 0) scale(1)',
          filter: `blur(${blurAmount * 2}px)`
        }
      },
      '@keyframes fuzzyShift': {
        '0%': { 
          transform: 'translate(0, 0) rotate(0deg)',
          filter: `blur(${blurAmount * 1.5}px)`
        },
        '25%': { 
          transform: `translate(${(Math.random() - 0.5) * 1}px, ${(Math.random() - 0.5) * 1}px) rotate(${Math.random() * 2}deg)`,
          filter: `blur(${blurAmount * 2}px)`
        },
        '50%': { 
          transform: `translate(${(Math.random() - 0.5) * 1}px, ${(Math.random() - 0.5) * 1}px) rotate(${Math.random() * 2}deg)`,
          filter: `blur(${blurAmount * 2.5}px)`
        },
        '75%': { 
          transform: `translate(${(Math.random() - 0.5) * 1}px, ${(Math.random() - 0.5) * 1}px) rotate(${Math.random() * 2}deg)`,
          filter: `blur(${blurAmount * 2}px)`
        },
        '100%': { 
          transform: 'translate(0, 0) rotate(0deg)',
          filter: `blur(${blurAmount * 1.5}px)`
        }
      },
      ...sx
    };
  };

  return (
    <Box
      ref={textRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={generateFuzzyStyles()}
    >
      <Typography variant={variant} component="span">
        {children}
      </Typography>
    </Box>
  );
}
