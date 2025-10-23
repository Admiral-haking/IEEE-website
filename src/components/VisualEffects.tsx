"use client";

import React from 'react';
import { Box } from '@mui/material';

export default function VisualEffects() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: 0.6, // Reduced opacity to not interfere with video
      }}
    >
      {/* Animated geometric shapes - optimized for desktop */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '40px',
          height: '40px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'pulse 6s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '30px',
          height: '30px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          animation: 'pulse 5s ease-in-out infinite',
          animationDelay: '1.5s',
          willChange: 'transform, opacity',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '80%',
          width: '25px',
          height: '25px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'pulse 7s ease-in-out infinite',
          animationDelay: '3s',
          willChange: 'transform, opacity',
        }}
      />

      {/* Floating lines - optimized for desktop */}
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          width: '80px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          animation: 'float 8s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '5%',
          width: '60px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '4s',
          willChange: 'transform, opacity',
        }}
      />

      {/* Glowing dots - optimized for desktop */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '25%',
          width: '6px',
          height: '6px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '80%',
          left: '30%',
          width: '4px',
          height: '4px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 5s ease-in-out infinite',
          animationDelay: '2s',
          willChange: 'transform, opacity',
        }}
      />
    </Box>
  );
}
