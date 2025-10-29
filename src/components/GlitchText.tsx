"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface GlitchTextProps {
  children: React.ReactNode;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  sx?: any;
  disableEffects?: boolean;
  color?: string;
}

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = '',
  variant = 'h1',
  sx = {},
  disableEffects = false,
  color
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!enableOnHover) {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }, 3000 / speed);

      return () => clearInterval(interval);
    }
  }, [speed, enableOnHover]);

  const handleMouseEnter = () => {
    if (enableOnHover) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }
  };

  const handleMouseLeave = () => {
    if (enableOnHover) {
      setIsGlitching(false);
    }
  };

  const primaryGradient = 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)';
  const secondaryGradient = 'linear-gradient(45deg, #96CEB4, #FFEAA7, #DDA0DD, #FF6B6B)';

  if (disableEffects) {
    const style: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      fontFamily: 'inherit',
      fontWeight: 700,
      color: color || 'inherit',
      cursor: 'default',
      ...(sx as any)
    };
    return (
      <span className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={style}>
        <Typography variant={variant} component="span" color={color || 'inherit'}>
          {children}
        </Typography>
      </span>
    );
  }

  const glitchStyles: any = {
    position: 'relative',
    display: 'inline-block',
    fontFamily: 'var(--font-tech-en), monospace',
    fontWeight: 700,
    color: '#ffffff',
    backgroundImage: primaryGradient,
    backgroundSize: '240% 240%',
    backgroundPosition: '50% 50%',
    animation: isGlitching ? 'glitch 180ms ease-in-out' : 'none',
    textShadow: enableShadows ? '0 0 6px rgba(255, 255, 255, 0.35)' : 'none',
    transition: 'transform 0.25s ease, filter 0.25s ease, text-shadow 0.25s ease',
    willChange: isGlitching ? 'transform, filter' : 'auto',
    cursor: enableOnHover ? 'pointer' : 'default',
    '&:hover': enableOnHover ? {
      transform: 'scale(1.05)',
      filter: 'brightness(1.06)'
    } : {},
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: primaryGradient,
      backgroundSize: '240% 240%',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'blur(2px)',
      opacity: isGlitching ? 0.45 : 0,
      zIndex: -1,
      transition: 'opacity 120ms ease',
      animation: isGlitching ? 'glitchBefore 180ms ease-in-out' : 'none'
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: secondaryGradient,
      backgroundSize: '240% 240%',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'blur(1px)',
      opacity: isGlitching ? 0.35 : 0,
      zIndex: -2,
      transition: 'opacity 120ms ease',
      animation: isGlitching ? 'glitchAfter 180ms ease-in-out' : 'none'
    },
    '@supports (-webkit-background-clip: text)': {
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      color: 'transparent'
    },
    '@supports (background-clip: text)': {
      backgroundClip: 'text',
      color: 'transparent'
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
      '&::before': {
        animation: 'none',
        opacity: 0
      },
      '&::after': {
        animation: 'none',
        opacity: 0
      }
    },
    '@keyframes glitch': {
      '0%': {
        transform: 'translate(0)',
        filter: 'hue-rotate(0deg)'
      },
      '10%': {
        transform: 'translate(-2px, 2px)',
        filter: 'hue-rotate(90deg)'
      },
      '20%': {
        transform: 'translate(2px, -2px)',
        filter: 'hue-rotate(180deg)'
      },
      '30%': {
        transform: 'translate(-2px, -2px)',
        filter: 'hue-rotate(270deg)'
      },
      '40%': {
        transform: 'translate(2px, 2px)',
        filter: 'hue-rotate(360deg)'
      },
      '50%': {
        transform: 'translate(-2px, 2px)',
        filter: 'hue-rotate(0deg)'
      },
      '60%': {
        transform: 'translate(2px, -2px)',
        filter: 'hue-rotate(90deg)'
      },
      '70%': {
        transform: 'translate(-2px, -2px)',
        filter: 'hue-rotate(180deg)'
      },
      '80%': {
        transform: 'translate(2px, 2px)',
        filter: 'hue-rotate(270deg)'
      },
      '90%': {
        transform: 'translate(-2px, 2px)',
        filter: 'hue-rotate(360deg)'
      },
      '100%': {
        transform: 'translate(0)',
        filter: 'hue-rotate(0deg)'
      }
    },
    '@keyframes glitchBefore': {
      '0%': {
        transform: 'translate(0)',
        filter: 'blur(2px) hue-rotate(0deg)'
      },
      '10%': {
        transform: 'translate(-3px, 3px)',
        filter: 'blur(3px) hue-rotate(90deg)'
      },
      '20%': {
        transform: 'translate(3px, -3px)',
        filter: 'blur(2px) hue-rotate(180deg)'
      },
      '30%': {
        transform: 'translate(-3px, -3px)',
        filter: 'blur(4px) hue-rotate(270deg)'
      },
      '40%': {
        transform: 'translate(3px, 3px)',
        filter: 'blur(2px) hue-rotate(360deg)'
      },
      '50%': {
        transform: 'translate(-3px, 3px)',
        filter: 'blur(3px) hue-rotate(0deg)'
      },
      '60%': {
        transform: 'translate(3px, -3px)',
        filter: 'blur(2px) hue-rotate(90deg)'
      },
      '70%': {
        transform: 'translate(-3px, -3px)',
        filter: 'blur(4px) hue-rotate(180deg)'
      },
      '80%': {
        transform: 'translate(3px, 3px)',
        filter: 'blur(2px) hue-rotate(270deg)'
      },
      '90%': {
        transform: 'translate(-3px, 3px)',
        filter: 'blur(3px) hue-rotate(360deg)'
      },
      '100%': {
        transform: 'translate(0)',
        filter: 'blur(2px) hue-rotate(0deg)'
      }
    },
    '@keyframes glitchAfter': {
      '0%': {
        transform: 'translate(0)',
        filter: 'blur(1px) hue-rotate(0deg)'
      },
      '10%': {
        transform: 'translate(3px, -3px)',
        filter: 'blur(2px) hue-rotate(90deg)'
      },
      '20%': {
        transform: 'translate(-3px, 3px)',
        filter: 'blur(1px) hue-rotate(180deg)'
      },
      '30%': {
        transform: 'translate(3px, 3px)',
        filter: 'blur(3px) hue-rotate(270deg)'
      },
      '40%': {
        transform: 'translate(-3px, -3px)',
        filter: 'blur(1px) hue-rotate(360deg)'
      },
      '50%': {
        transform: 'translate(3px, -3px)',
        filter: 'blur(2px) hue-rotate(0deg)'
      },
      '60%': {
        transform: 'translate(-3px, 3px)',
        filter: 'blur(1px) hue-rotate(90deg)'
      },
      '70%': {
        transform: 'translate(3px, 3px)',
        filter: 'blur(3px) hue-rotate(180deg)'
      },
      '80%': {
        transform: 'translate(-3px, -3px)',
        filter: 'blur(1px) hue-rotate(270deg)'
      },
      '90%': {
        transform: 'translate(3px, -3px)',
        filter: 'blur(2px) hue-rotate(360deg)'
      },
      '100%': {
        transform: 'translate(0)',
        filter: 'blur(1px) hue-rotate(0deg)'
      }
    },
    ...sx
  };

  return (
    <Box
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={glitchStyles}
    >
      <Typography variant={variant} component="span">
        {children}
      </Typography>
    </Box>
  );
}
