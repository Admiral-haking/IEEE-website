"use client";

import React, { useEffect } from 'react';

export default function FontOptimizer() {
  useEffect(() => {
    // Detect Windows and apply specific optimizations
    const isWindows = navigator.platform.toLowerCase().includes('win');
    
    if (isWindows) {
      // Add Windows-specific class to body
      document.body.classList.add('windows-optimized');
      
      // Force font loading
      const fontFaces = [
        'Inter',
        'Bebas Neue',
        'Orbitron',
        'Exo 2',
        'Rajdhani',
        'Vazirmatn',
        'Lalezar'
      ];
      
      fontFaces.forEach(font => {
        if (document.fonts) {
          document.fonts.load(`400 16px ${font}`).catch(() => {
            console.log(`Font ${font} failed to load, using fallback`);
          });
        }
      });
      
      // Apply Windows-specific CSS
      const style = document.createElement('style');
      style.textContent = `
        .windows-optimized {
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: optimizeLegibility !important;
        }
        
        .windows-optimized * {
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        /* Fix MUI component layering - minimal approach */
        .windows-optimized .MuiTypography-root {
          position: relative !important;
          z-index: 1 !important;
        }
        
        .windows-optimized .MuiButton-root {
          position: relative !important;
          z-index: 2 !important;
        }
        
        .windows-optimized .MuiCard-root {
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* Windows ClearType optimization */
        .windows-optimized {
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1 !important;
        }
        
        /* Prevent text blur on Windows */
        @media screen and (-webkit-min-device-pixel-ratio: 1) {
          .windows-optimized * {
            -webkit-font-smoothing: subpixel-antialiased !important;
          }
        }
        
        /* High DPI display optimization for Windows */
        @media screen and (-webkit-min-device-pixel-ratio: 2) {
          .windows-optimized * {
            -webkit-font-smoothing: antialiased !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Cleanup
      return () => {
        document.body.classList.remove('windows-optimized');
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  return null;
}
