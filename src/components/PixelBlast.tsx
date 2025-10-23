"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';

interface PixelBlastProps {
  variant?: 'circle' | 'square' | 'triangle';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  liquidWobbleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function PixelBlast({
  variant = 'circle',
  pixelSize = 6,
  color = '#B19EEF',
  patternScale = 3,
  patternDensity = 1.2,
  pixelSizeJitter = 0.5,
  enableRipples = false,
  rippleSpeed = 0.4,
  rippleThickness = 0.12,
  rippleIntensityScale = 1.5,
  liquid = false,
  liquidStrength = 0.12,
  liquidRadius = 1.2,
  liquidWobbleSpeed = 5,
  speed = 0.6,
  edgeFade = 0.25,
  transparent = false,
  style = {},
  className = ""
}: PixelBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);

  const scalar = useMemo(() => {
    return (i: number, j: number) => {
      const v = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (currentTime: number) => {
      if (!timeRef.current) timeRef.current = currentTime;
      timeRef.current = currentTime;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate grid dimensions
      const gridSize = pixelSize * patternScale;
      const cols = Math.ceil(width / gridSize) + 2;
      const rows = Math.ceil(height / gridSize) + 2;

      // Animation time
      const t = currentTime * 0.001 * speed;

      // Draw pixels
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Skip if outside viewport
          if (x > width + gridSize || y > height + gridSize) continue;

          // Calculate noise/pattern
          const noiseX = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.7);
          const noiseY = Math.cos(x * 0.01 + t * 0.5) * Math.sin(y * 0.01 + t);
          const noise = (noiseX + noiseY) * 0.5;

          // Apply pattern density (inverted logic - higher density = more pixels)
          const densityThreshold = Math.max(0.1, Math.min(1, patternDensity * (0.3 + noise * 0.4)));
          if (scalar(i, j) > densityThreshold) continue;

          // Calculate pixel properties
          let currentPixelSize = pixelSize;
          if (pixelSizeJitter > 0) {
            const jitterSeed = scalar(i + 1000, j + 2000) - 0.5;
            currentPixelSize *= 1 + jitterSeed * pixelSizeJitter;
          }

          // Liquid effect
          let offsetX = 0;
          let offsetY = 0;
          if (liquid) {
            const liquidNoise = Math.sin(x * liquidRadius + t * liquidWobbleSpeed) * 
                              Math.cos(y * liquidRadius + t * liquidWobbleSpeed * 0.7);
            offsetX = liquidNoise * liquidStrength * currentPixelSize;
            offsetY = Math.cos(x * liquidRadius + t * liquidWobbleSpeed * 0.5) * 
                     Math.sin(y * liquidRadius + t * liquidWobbleSpeed) * liquidStrength * currentPixelSize;
          }

          // Ripple effect
          let rippleIntensity = 1;
          if (enableRipples) {
            const centerX = width / 2;
            const centerY = height / 2;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const ripplePhase = (distance * rippleThickness - t * rippleSpeed) % (Math.PI * 2);
            rippleIntensity = 1 + Math.sin(ripplePhase) * rippleIntensityScale;
          }

          // Edge fade (reduced effect)
          const distanceToEdge = Math.min(x, y, width - x, height - y);
          const fadeFactor = Math.min(1, distanceToEdge / (Math.min(width, height) * edgeFade * 2));

          // Calculate final position and size
          const finalX = x + offsetX;
          const finalY = y + offsetY;
          const finalSize = currentPixelSize * rippleIntensity * fadeFactor;

          if (finalSize <= 0) continue;

          // Set color with transparency
          const alpha = transparent ? 0.3 + noise * 0.2 : 1;
          ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');

          // Draw pixel based on variant
          ctx.save();
          ctx.translate(finalX + finalSize / 2, finalY + finalSize / 2);
          
          switch (variant) {
            case 'circle':
              ctx.beginPath();
              ctx.arc(0, 0, finalSize / 2, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'square':
              ctx.fillRect(-finalSize / 2, -finalSize / 2, finalSize, finalSize);
              break;
            case 'triangle':
              ctx.beginPath();
              ctx.moveTo(0, -finalSize / 2);
              ctx.lineTo(-finalSize / 2, finalSize / 2);
              ctx.lineTo(finalSize / 2, finalSize / 2);
              ctx.closePath();
              ctx.fill();
              break;
          }
          
          ctx.restore();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    variant, pixelSize, color, patternScale, patternDensity, pixelSizeJitter,
    enableRipples, rippleSpeed, rippleThickness, rippleIntensityScale,
    liquid, liquidStrength, liquidRadius, liquidWobbleSpeed, speed, edgeFade, transparent,
    scalar
  ]);

  return (
    <Box
      className={className}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </Box>
  );
}
