"use client";

import React, { useEffect } from 'react';

export default function TextLayerFix() {
  useEffect(() => {
    // Fix text layering issues globally - minimal approach
    const fixTextLayering = () => {
      // Only fix elements that actually have layering issues
      const problematicElements = document.querySelectorAll('.MuiTypography-root, .MuiButton-root, .MuiCard-root');
      
      problematicElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Only apply fixes if element doesn't already have proper positioning
        if (!htmlElement.style.position || htmlElement.style.position === 'static') {
          htmlElement.style.position = 'relative';
        }
        
        // Only set z-index if not already set
        if (!htmlElement.style.zIndex || htmlElement.style.zIndex === 'auto') {
          if (htmlElement.classList.contains('MuiButton-root')) {
            htmlElement.style.zIndex = '2';
          } else if (htmlElement.classList.contains('MuiCard-root')) {
            htmlElement.style.zIndex = '1';
          } else if (htmlElement.classList.contains('MuiTypography-root')) {
            htmlElement.style.zIndex = '1';
          }
        }
      });
      
      // Fix GlitchText components specifically
      const glitchElements = document.querySelectorAll('[class*="glitch"], .glitch-text');
      glitchElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (!htmlElement.style.position || htmlElement.style.position === 'static') {
          htmlElement.style.position = 'relative';
          htmlElement.style.zIndex = '2';
        }
      });
    };
    
    // Run immediately
    fixTextLayering();
    
    // Run after DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(fixTextLayering, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
