"use client";

import React from 'react';
import { Box, Button, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';
import { typographyPresets } from '@/utils/typography';

export default function Hero({ locale }: { locale: 'en' | 'fa' }) {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false,
    noSsr: true
  });

  const heroTitleStyles: SxProps<Theme> = {
    ...typographyPresets.pageTitle(locale),
    letterSpacing: locale === 'en' ? -0.5 : 0,
    fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-anime-en)',
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
    lineHeight: { xs: 1.2, md: 1.1 },
    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary
  };

  const taglineStyles: SxProps<Theme> = {
    fontFamily: locale === 'fa' ? 'var(--font-body-fa)' : 'var(--font-tech-en)',
    color: theme.palette.text.secondary
  };

  const subtitleStyles: SxProps<Theme> = {
    ...typographyPresets.body(locale),
    fontFamily: locale === 'fa' ? 'var(--font-body-fa)' : 'var(--font-cartoon-en)',
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary
  };

  const containerSx: SxProps<Theme> = {
    position: 'relative',
    pt: { xs: 8, md: 16 },
    pb: { xs: 8, md: 12 },
    minHeight: { xs: 'auto', md: '80vh' },
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : theme.palette.background.paper
  };

  return (
    <Box sx={containerSx}>
      <Container maxWidth="lg">
        <Stack gap={{ xs: 3, md: 4 }} alignItems="center" textAlign="center">
          <Typography variant="h1" component="h1" sx={heroTitleStyles}>
            {t('title')}
          </Typography>
          <Typography
            variant="h2"
            component="p"
            sx={{
              maxWidth: { xs: '100%', md: '640px' },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              ...taglineStyles
            }}
          >
            {t('tagline')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: { xs: '100%', md: '560px' },
              fontSize: { xs: '0.95rem', sm: '1rem' },
              mt: 1,
              ...subtitleStyles
            }}
          >
            {t('home_subtitle')}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={2}
            sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              component={NextLink}
              href={`/${locale}/solutions`}
              variant="contained"
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              fullWidth={isMobile}
            >
              {t('explore_solutions')}
            </Button>
            <Button
              component={NextLink}
              href={`/${locale}/contact`}
              variant="outlined"
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              fullWidth={isMobile}
            >
              {t('contact_now')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
