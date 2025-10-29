"use client";

import React from 'react';
import { Box, CircularProgress, Fade, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useColorScheme } from '@mui/joy/styles';
import Image from 'next/image';
const logoLight = '/logo.png';
const logoDark = '/logo-dark-mode.png';

export default function SplashScreen() {
  const [visible, setVisible] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const { mode } = useColorScheme();
  const theme = useTheme();

  React.useEffect(() => {
    setMounted(true);
    const done = () => setVisible(false);
    if (document.readyState === 'complete') {
      // Ensure the splash is visible at least briefly even if load already fired
      const id = setTimeout(done, 400);
      return () => clearTimeout(id);
    }
    window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, []);

  // Use light logo as default to match server-side rendering
  const logo = mounted && mode === 'dark' ? logoDark : logoLight;

  const rootStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: (theme?.zIndex?.modal ?? 1500) + 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default
  };
  return (
    <Fade in={visible} timeout={{ enter: 100, exit: 400 }} unmountOnExit>
      <div aria-label="Loading" role="status" style={rootStyle}>
        <Stack gap={2} alignItems="center">
          {/* Removed image for snappier load */}
          <Typography variant="body2" color="text.secondary">Loading…</Typography>
          <CircularProgress size={20} thickness={5} color="secondary" />
        </Stack>
      </div>
    </Fade>
  );
}
