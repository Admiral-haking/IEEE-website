"use client";

import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `${pathname}?${searchParams?.toString() || ''}`;

  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const firstRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    // Start progress on route change
    let incId: any;
    let doneId: any;
    let hideId: any;

    setVisible(true);
    setValue(0);

    // Smoothly increment up to 85%
    incId = setInterval(() => {
      setValue((v) => {
        const next = v + Math.random() * 15;
        return next < 85 ? next : 85;
      });
    }, 120);

    // Complete after a reasonable time (fallback for slow routes)
    doneId = setTimeout(() => {
      setValue(100);
      hideId = setTimeout(() => setVisible(false), 250);
    }, 1200);

    return () => {
      clearInterval(incId);
      clearTimeout(doneId);
      clearTimeout(hideId);
      // On subsequent navigations, ensure old bar is hidden
      setVisible(false);
      setValue(0);
    };
  }, [key]);

  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }}>
      <LinearProgress color="secondary" variant="determinate" value={value} sx={{ height: 3 }} />
    </div>
  );
}
