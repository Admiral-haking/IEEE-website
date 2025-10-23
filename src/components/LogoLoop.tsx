"use client";

import React from 'react';
import { Box, Link as MuiLink } from '@mui/material';

export type LogoItem =
  | { node: React.ReactNode; href?: string; title?: string; ariaLabel?: string }
  | { src: string; alt?: string; href?: string; title?: string; width?: number; height?: number };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // px/sec
  direction?: 'left' | 'right';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

const toCssLength = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v);

export default function LogoLoop({
  logos,
  speed = 120,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 32,
  pauseOnHover = true,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = 'Partner logos',
  style,
}: LogoLoopProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const seqRef = React.useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = React.useState(0);
  const [copyCount, setCopyCount] = React.useState(2);
  const [hovered, setHovered] = React.useState(false);

  const velocity = React.useMemo(() => {
    const dir = direction === 'left' ? 1 : -1;
    return Math.abs(speed) * dir;
  }, [speed, direction]);

  // Measure sequence width and decide how many copies we need
  const updateDims = React.useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = Math.ceil(seqRef.current?.getBoundingClientRect?.().width || 0);
    if (sw > 0) {
      setSeqWidth(sw);
      const copies = Math.max(2, Math.ceil(cw / sw) + 2);
      setCopyCount(copies);
    }
  }, []);

  React.useEffect(() => {
    updateDims();
    if (typeof ResizeObserver !== 'undefined') {
      const obs = new ResizeObserver(updateDims);
      if (containerRef.current) obs.observe(containerRef.current);
      if (seqRef.current) obs.observe(seqRef.current);
      return () => obs.disconnect();
    } else {
      window.addEventListener('resize', updateDims);
      return () => window.removeEventListener('resize', updateDims);
    }
  }, [updateDims, logos, gap, logoHeight]);

  // Animation loop
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      track.style.transform = 'translate3d(0,0,0)';
      return;
    }
    let raf: number | null = null;
    let last: number | null = null;
    let offset = 0;

    const run = (ts: number) => {
      if (last == null) last = ts;
      const dt = Math.max(0, ts - last) / 1000;
      last = ts;

      const target = pauseOnHover && hovered ? 0 : velocity;
      if (seqWidth > 0 && target !== 0) {
        offset = ((offset + target * dt) % seqWidth + seqWidth) % seqWidth;
        track.style.transform = `translate3d(${-offset}px,0,0)`;
      }
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [velocity, seqWidth, hovered, pauseOnHover]);

  const list = (
    <Box
      component="ul"
      ref={seqRef}
      sx={{ display: 'flex', alignItems: 'center', p: 0, m: 0, listStyle: 'none' }}
    >
      {logos.map((item, idx) => {
        const content = 'node' in item ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            {item.node}
          </Box>
        ) : (
          <Box
            component="img"
            src={item.src}
            alt={item.alt || ''}
            title={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            sx={{ height: logoHeight, width: 'auto', display: 'block', objectFit: 'contain' }}
          />
        );
        const inner = (item as any).href ? (
          <MuiLink href={(item as any).href} target="_blank" rel="noopener noreferrer" underline="none">
            {content}
          </MuiLink>
        ) : (
          content
        );
        return (
          <Box
            component="li"
            key={idx}
            sx={{ flex: 'none', mr: `${gap}px`, fontSize: `${logoHeight}px`, lineHeight: 1, ':last-child': { mr: 0 } }}
          >
            <Box sx={{ display: 'inline-flex', alignItems: 'center', transition: scaleOnHover ? 'transform .3s ease' : 'none', '&:hover': scaleOnHover ? { transform: 'scale(1.1)' } : undefined }}>
              {inner}
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setHovered(true)}
      onMouseLeave={() => pauseOnHover && setHovered(false)}
      sx={{ position: 'relative', overflowX: 'hidden', width: toCssLength(width) || '100%', ...(style || {}) }}
    >
      {fadeOut && (
        <>
          <Box aria-hidden sx={{ pointerEvents: 'none', position: 'absolute', insetY: 0, left: 0, width: { xs: 48, md: 96 }, zIndex: 1, background: `linear-gradient(to right, ${fadeOutColor || '#fff'} 0%, rgba(0,0,0,0) 100%)` }} />
          <Box aria-hidden sx={{ pointerEvents: 'none', position: 'absolute', insetY: 0, right: 0, width: { xs: 48, md: 96 }, zIndex: 1, background: `linear-gradient(to left, ${fadeOutColor || '#fff'} 0%, rgba(0,0,0,0) 100%)` }} />
        </>
      )}
      <Box ref={trackRef} sx={{ display: 'flex', willChange: 'transform' }}>
        {Array.from({ length: copyCount }).map((_, i) => (
          <React.Fragment key={i}>{i === 0 ? list : React.cloneElement(list as any)}</React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

