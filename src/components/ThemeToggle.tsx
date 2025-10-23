"use client";

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/joy/styles';

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45 14.32l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 4V1h-2v3h2zm0 19v-3h-2v3h2zm8-9h3v-2h-3v2zM1 12H4v-2H1v2zm15.24-7.16l1.42 1.42 1.79-1.8-1.41-1.41-1.8 1.79zM4.95 19.07l1.41-1.41-1.79-1.8-1.41 1.41 1.79 1.8zM11 7a5 5 0 100 10 5 5 0 000-10z"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.74 2.01c-5.52 0-10 4.48-10 10 0 4.63 3.15 8.52 7.4 9.67.54.15.95-.44.7-.93A7.99 7.99 0 0112 4c.73 0 1.44.1 2.12.3.5.14.91-.38.72-.87A10.02 10.02 0 0012.74 2z"/>
    </svg>
  );
}

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const next = mode === 'dark' ? 'light' : 'dark';
  return (
    <Tooltip title={`Switch to ${next} mode`}>
      <IconButton aria-label="toggle theme" onClick={() => setMode(next)} size="medium" sx={{ width: 44, height: 44, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        {mounted && mode === 'dark' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Tooltip>
  );
}

