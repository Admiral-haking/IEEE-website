"use client";

import React, { useEffect, useRef } from 'react';

interface GradualBlurProps {
  target?: 'parent' | 'self';
  position?: 'top' | 'bottom' | 'left' | 'right';
  height?: string;
  strength?: number;
  divCount?: number;
  curve?: 'linear' | 'bezier' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  exponential?: boolean;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GradualBlur({
  target = 'parent',
  position = 'bottom',
  height = '6rem',
  strength = 2,
  divCount = 5,
  curve = 'bezier',
  exponential = true,
  opacity = 1,
  className = '',
  style = {}
}: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentElement;
    if (!parent) return;

    // Clear existing blur elements
    const existingBlurs = parent.querySelectorAll('.gradual-blur-element');
    existingBlurs.forEach(el => el.remove());

    // Create blur elements
    const blurElements: HTMLDivElement[] = [];
    
    for (let i = 0; i < divCount; i++) {
      const blurDiv = document.createElement('div');
      blurDiv.className = 'gradual-blur-element';
      
      // Calculate blur strength
      let blurStrength: number;
      if (exponential) {
        blurStrength = strength * Math.pow(i / (divCount - 1), 2);
      } else {
        blurStrength = strength * (i / (divCount - 1));
      }
      
      // Calculate opacity
      const elementOpacity = opacity * (1 - i / (divCount - 1));
      
      // Set styles based on position
      const isVertical = position === 'top' || position === 'bottom';
      const isHorizontal = position === 'left' || position === 'right';
      
      if (isVertical) {
        blurDiv.style.position = 'absolute';
        blurDiv.style.left = '0';
        blurDiv.style.right = '0';
        blurDiv.style.height = `${parseFloat(height) / divCount}rem`;
        blurDiv.style.width = '100%';
        
        if (position === 'bottom') {
          blurDiv.style.bottom = `${i * parseFloat(height) / divCount}rem`;
        } else {
          blurDiv.style.top = `${i * parseFloat(height) / divCount}rem`;
        }
      } else {
        blurDiv.style.position = 'absolute';
        blurDiv.style.top = '0';
        blurDiv.style.bottom = '0';
        blurDiv.style.width = `${parseFloat(height) / divCount}rem`;
        blurDiv.style.height = '100%';
        
        if (position === 'right') {
          blurDiv.style.right = `${i * parseFloat(height) / divCount}rem`;
        } else {
          blurDiv.style.left = `${i * parseFloat(height) / divCount}rem`;
        }
      }
      
      // Apply blur and opacity
      blurDiv.style.filter = `blur(${blurStrength}px)`;
      blurDiv.style.opacity = elementOpacity.toString();
      blurDiv.style.pointerEvents = 'none';
      blurDiv.style.zIndex = '10';
      
      // Set background based on target
      if (target === 'parent') {
        const parentBg = window.getComputedStyle(parent).backgroundColor;
        blurDiv.style.backgroundColor = parentBg !== 'rgba(0, 0, 0, 0)' ? parentBg : 'inherit';
      } else {
        blurDiv.style.backgroundColor = 'inherit';
      }
      
      // Apply curve animation
      if (curve === 'bezier') {
        blurDiv.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        blurDiv.style.transition = `all 0.3s ${curve}`;
      }
      
      parent.appendChild(blurDiv);
      blurElements.push(blurDiv);
    }

    return () => {
      blurElements.forEach(el => el.remove());
    };
  }, [target, position, height, strength, divCount, curve, exponential, opacity]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
        ...style
      }}
    />
  );
}
