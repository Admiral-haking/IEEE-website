"use client";

import React, { useRef } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import LaserFlow from './LaserFlow';

export default function LaserFlowDemo() {
  const revealImgRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={{
        height: '600px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#060010',
        borderRadius: 3,
        border: '2px solid #FF79C6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'crosshair'
      }}
      onMouseMove={(e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#FF79C6"
        intensity={0.8}
        speed={1.2}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '86%',
          height: '60%',
          backgroundColor: 'rgba(6, 0, 16, 0.8)',
          borderRadius: '20px',
          border: '2px solid #FF79C6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          zIndex: 6,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h4" sx={{ 
            background: 'linear-gradient(45deg, #FF79C6, #7df9ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}>
            Laser Flow Effect
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '400px' }}>
            Move your mouse around to see the interactive laser reveal effect
          </Typography>
        </Stack>
      </Box>

      <Box
        ref={revealImgRef}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 5,
          background: 'linear-gradient(45deg, #FF79C6, #7df9ff, #4ecdc4, #96ceb4)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease-in-out infinite',
          pointerEvents: 'none',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          opacity: 0.3,
          mixBlendMode: 'lighten'
        }}
      />

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 50% 100%; }
          75% { background-position: 0% 100%; }
        }
      `}</style>
    </Box>
  );
}
