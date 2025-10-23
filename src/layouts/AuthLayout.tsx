"use client";
import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useColorScheme } from '@mui/joy/styles';
import { useTranslation } from 'react-i18next';
const logoLight = '/logo.png';
const logoDark = '/logo-dark-mode.png';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  // Prevent hydration mismatch by only showing theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use light logo as default to match server-side rendering
  const logo = mounted && mode === 'dark' ? logoDark : logoLight;
  return (
    <Box sx={{ position: 'relative', minHeight: '100dvh', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: `radial-gradient(900px 500px at 50% -20%, rgba(82,168,255,0.20), transparent 60%),
                       radial-gradient(700px 400px at 90% 10%, rgba(126,87,194,0.18), transparent 60%)`
        }}
      />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack gap={3} alignItems="center" textAlign="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Image 
              src={logo} 
              alt="Hippogriff logo" 
              width={28}
              height={28} 
              style={{ 
                width: 'auto',
                transition: 'opacity 0.2s ease-in-out'
              }} 
            />
            <Typography variant="h6" fontWeight={700}>{t('name')}</Typography>
          </Stack>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -0.3 }}>{t('auth_welcome_title')}</Typography>
          <Typography color="text.secondary">{t('auth_welcome_subtitle')}</Typography>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              width: '100%',
              backdropFilter: 'blur(8px)'
            }}
          >
            {children}
          </Paper>
          <Typography variant="caption" color="text.secondary">Protected by modern security practices</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
