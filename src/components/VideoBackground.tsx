"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';

interface VideoBackgroundProps {
  videoSrc?: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export default function VideoBackground({ 
  videoSrc, 
  fallbackImage = '/api/placeholder/1920/1080',
  overlay = true,
  overlayOpacity = 0.4
}: VideoBackgroundProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc) {
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true));
      video.addEventListener('error', () => setIsVideoError(true));
      
      // Try to play the video
      video.play().catch(() => {
        // If autoplay fails, we'll use the fallback
        setIsVideoError(true);
      });
    }
  }, [videoSrc]);

  // If no video source provided, use animated gradient background
  if (!videoSrc || isVideoError) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: `
            linear-gradient(135deg, 
              rgba(25,118,210,0.8) 0%, 
              rgba(156,39,176,0.6) 25%,
              rgba(76,175,80,0.4) 50%,
              rgba(255,152,0,0.6) 75%,
              rgba(233,30,99,0.8) 100%
            ),
            radial-gradient(circle at 20% 80%, rgba(25,118,210,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(156,39,176,0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(76,175,80,0.2) 0%, transparent 50%)
          `,
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        }}
      >
        {/* Floating particles */}
        <Box className="floating-particles">
          {[...Array(9)].map((_, i) => (
            <Box key={i} className="particle" />
          ))}
        </Box>

        {overlay && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `rgba(0,0,0,${overlayOpacity})`,
            }}
          />
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          opacity: isVideoLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc} type="video/webm" />
      </Box>
      
      {/* Fallback image while video loads */}
      {!isVideoLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${fallbackImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `rgba(0,0,0,${overlayOpacity})`,
          }}
        />
      )}
    </Box>
  );
}
