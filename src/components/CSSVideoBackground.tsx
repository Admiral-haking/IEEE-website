"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// MUI Box avoided to reduce TS union complexity in animated nodes

/**
 * CSSVideoBackgroundWithBlur
 * - Plays a looping background video
 * - Adds blur + gradient overlay
 * - Animated floating particles for subtle motion
 * - Fully client-safe (no hydration mismatch)
 */
type Props = {
  sources?: string[]; // playlist of video sources relative to public/
};

export default function CSSVideoBackground({ sources }: Props) {
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }, []);
  const playlist = useMemo(() => (sources && sources.length > 0 ? sources : [
    "/videos/campus.mp4"
  ]), [sources]);

  // Double-buffered video elements for seamless, no-delay switching
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [useAasCurrent, setUseAasCurrent] = useState(true);
  const [nextReady, setNextReady] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);

  // ✅ Generate random floating particles on client - optimized for desktop
  useEffect(() => {
    const count = prefersReducedMotion ? 0 : (isMobile ? 6 : 12);
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = isMobile ? 1 + Math.random() * 2 : 1.5 + Math.random() * 3;
      const duration = prefersReducedMotion ? 0 : (isMobile ? 10 + Math.random() * 6 : 8 + Math.random() * 6);
      const delay = Math.random() * 8;

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
            left: `${left}%`,
            top: `${top}%`,
            transform: 'translateZ(0)',
            animation: duration ? `float ${duration}s ease-in-out infinite` : 'none',
            animationDelay: `${delay}s`,
            willChange: 'transform, opacity'
          }}
        />
      );
    });
    setParticles(newParticles);
  }, [prefersReducedMotion, isMobile]);

  // Prepare next video source in the hidden buffer
  const preloadNext = useCallback((nextIndex: number) => {
    const nextSrc = playlist[nextIndex % playlist.length];
    const bufferRef = useAasCurrent ? videoBRef.current : videoARef.current;
    if (!bufferRef) return;
    setNextReady(false);
    bufferRef.src = nextSrc;
    bufferRef.load();
  }, [playlist, useAasCurrent]);

  // When buffer can play through, mark ready
  const handleCanPlayThrough = useCallback(() => {
    setNextReady(true);
  }, []);

  const safePlay = useCallback(async (el?: HTMLVideoElement | null) => {
    if (!el) return;
    try {
      // Only attempt play when we have enough data
      if (el.readyState >= 3) {
        const p = el.play();
        if (p && typeof (p as any).catch === 'function') {
          await (p as Promise<void>).catch(() => {});
        }
      } else {
        const onReady = () => {
          const p = el.play();
          if (p && typeof (p as any).catch === 'function') {
            (p as Promise<void>).catch(() => {});
          }
          el.removeEventListener('canplay', onReady);
        };
        el.addEventListener('canplay', onReady);
      }
    } catch {}
  }, []);

  // Swap videos at end without delay
  const swapToNext = useCallback(() => {
    const currentRef = useAasCurrent ? videoARef.current : videoBRef.current;
    const bufferRef = useAasCurrent ? videoBRef.current : videoARef.current;
    const nextIndex = (currentIndex + 1) % playlist.length;

    if (!bufferRef) return;

    // If next not ready (e.g., missing), try to play current again or hide video
    if (!nextReady) {
      // Attempt to continue with current by restarting it to avoid blank
      try { currentRef?.play(); } catch {}
      return;
    }

    // Cross-fade swap (play the preloaded buffer) - optimized for desktop
    bufferRef.currentTime = 0;
    safePlay(bufferRef);

    setUseAasCurrent((v) => !v);
    setCurrentIndex(nextIndex);
    setNextReady(false);
    
    // Preload the subsequent source with delay for better performance
    setTimeout(() => {
      preloadNext((nextIndex + 1) % playlist.length);
    }, 200);
  }, [currentIndex, playlist.length, preloadNext, nextReady, useAasCurrent, safePlay]);

  // Handle errors by skipping to the next source; if all fail, hide video layer
  const handleError = useCallback(() => {
    const triedCount = playlist.length;
    let attempts = 0;
    let idx = (currentIndex + 1) % playlist.length;
    const bufferRef = useAasCurrent ? videoBRef.current : videoARef.current;

    const tryNext = () => {
      if (attempts >= triedCount) {
        setVideoVisible(false);
        return;
      }
      attempts += 1;
      setCurrentIndex(idx);
      if (bufferRef) {
        bufferRef.src = playlist[idx];
        bufferRef.load();
      }
      idx = (idx + 1) % playlist.length;
    };

    tryNext();
  }, [currentIndex, playlist, useAasCurrent]);

  // Initialize: set current and preload next
  useEffect(() => {
    const currentRef = useAasCurrent ? videoARef.current : videoBRef.current;
    const bufferRef = useAasCurrent ? videoBRef.current : videoARef.current;
    if (!currentRef || !bufferRef) return;
    setVideoVisible(true);
    currentRef.src = playlist[currentIndex % playlist.length];
    currentRef.load();
    // Autoplay current as soon as possible
    const onCanPlay = () => { safePlay(currentRef); };
    currentRef.addEventListener('canplay', onCanPlay, { once: true });
    preloadNext((currentIndex + 1) % playlist.length);
    return () => { currentRef.removeEventListener('canplay', onCanPlay as any); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  // Preload buffer event bindings
  useEffect(() => {
    const bufferRef = useAasCurrent ? videoBRef.current : videoARef.current;
    if (!bufferRef) return;
    bufferRef.addEventListener('canplaythrough', handleCanPlayThrough);
    bufferRef.addEventListener('error', handleError);
    return () => {
      bufferRef.removeEventListener('canplaythrough', handleCanPlayThrough);
      bufferRef.removeEventListener('error', handleError);
    };
  }, [handleCanPlayThrough, handleError, useAasCurrent]);

  // Listen for end of current to swap instantly
  useEffect(() => {
    const currentRef = useAasCurrent ? videoARef.current : videoBRef.current;
    if (!currentRef) return;
    currentRef.addEventListener('ended', swapToNext);
    return () => { currentRef.removeEventListener('ended', swapToNext); };
  }, [swapToNext, useAasCurrent]);

  // Pause playback when offscreen to save CPU
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const currentRef = useAasCurrent ? videoARef.current : videoBRef.current;
        if (!currentRef) return;
        if (entry.isIntersecting) {
          safePlay(currentRef);
        } else {
          try { currentRef.pause(); } catch {}
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [useAasCurrent, safePlay]);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1
      }}
    >
      {/* 🎥 Double-buffered video backgrounds for gapless playback */}
      {videoVisible && (
        <>
          <video
            ref={videoARef}
            autoPlay
            muted
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              filter: `${isMobile ? 'blur(6px)' : 'blur(12px)'} brightness(${prefersReducedMotion ? 0.8 : 0.7})`,
              zIndex: useAasCurrent ? -2 : -3,
              opacity: useAasCurrent ? 1 : 0,
              transition: "opacity 200ms ease-out",
            }}
          />
          <video
            ref={videoBRef}
            autoPlay={false}
            muted
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              filter: `${isMobile ? 'blur(6px)' : 'blur(12px)'} brightness(${prefersReducedMotion ? 0.8 : 0.7})`,
              zIndex: useAasCurrent ? -3 : -2,
              opacity: useAasCurrent ? 0 : 1,
              transition: "opacity 200ms ease-out",
            }}
          />
        </>
      )}

      {/* 🌈 Gradient overlay (only when no video available) */}
      {!videoVisible && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(135deg, rgba(25,118,210,0.6), rgba(156,39,176,0.5), rgba(76,175,80,0.3), rgba(233,30,99,0.6))',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 25s ease infinite',
            zIndex: -1
          }}
        />
      )}

      {/* ✨ Floating particles (only when no video available) */}
      {!videoVisible && particles}

      {/* Decorative shapes removed intentionally */}

      {/* 🎨 Animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
