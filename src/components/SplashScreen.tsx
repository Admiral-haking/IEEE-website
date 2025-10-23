"use client";

import React from 'react';
import { Box, CircularProgress, Fade, Stack, Typography } from '@mui/material';
import { useColorScheme } from '@mui/joy/styles';
import Image from 'next/image';
const logoLight = '/logo.png';
const logoDark = '/logo-dark-mode.png';

export default function SplashScreen() {
  const [visible, setVisible] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const { mode } = useColorScheme();

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

  return (
    <Fade in={visible} timeout={{ enter: 100, exit: 400 }} unmountOnExit>
      <Box
        aria-label="Loading"
        role="status"
        sx={{
          position: 'fixed', inset: 0, zIndex: (t: any) => t.zIndex.modal + 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Stack gap={2} alignItems="center">
          <Image 
            src={logo} 
            alt="Hippogriff logo" 
            width={48}
            height={48} 
            style={{ 
              width: 'auto',
              transition: 'opacity 0.2s ease-in-out'
            }} 
          />
          <Typography variant="body2" color="text.secondary">Loading…</Typography>
          <CircularProgress size={20} thickness={5} color="secondary" />
        </Stack>
      </Box>
    </Fade>
  );
}
