"use client";

import React from 'react';
import { Box, Button, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type enCommon from '@/locales/en/common.json';
import NextLink from 'next/link';
import { typographyPresets } from '@/utils/typography';
import type { CommonDictionary, Locale } from '@/types/i18n';

type CommonDict = typeof enCommon;
interface HeroProps {
  locale: 'en' | 'fa';
  dict: Partial<CommonDict>;
}

export default function Hero({ locale, dict }: HeroProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false,
    noSsr: true
  });

  // Reduce JSX typing complexity for TS by using a loose alias
  const BoxAny = Box as any;

  const heroTitleStyles = {
    ...typographyPresets.pageTitle(locale),
    letterSpacing: locale === 'en' ? -0.5 : 0,
    fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-anime-en)',
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
    lineHeight: { xs: 1.2, md: 1.1 },
    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary
  };

  const taglineStyles = {
    fontFamily: locale === 'fa' ? 'var(--font-body-fa)' : 'var(--font-tech-en)',
    color: theme.palette.text.secondary
  };

  const subtitleStyles = {
    ...typographyPresets.body(locale),
    fontFamily: locale === 'fa' ? 'var(--font-body-fa)' : 'var(--font-cartoon-en)',
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary
  };

  // Reduce type complexity for TS by precomputing bg color
  const containerBgColor = theme.palette.mode === 'dark'
    ? theme.palette.background.default
    : theme.palette.background.paper;

  const containerSx = {
    position: 'relative',
    pt: { xs: 8, md: 16 },
    pb: { xs: 8, md: 12 },
    minHeight: { xs: 'auto', md: '80vh' },
    backgroundColor: containerBgColor
  };

  return (
    <BoxAny sx={containerSx as any}>
      <Container maxWidth="lg">
        <Stack gap={{ xs: 3, md: 4 }} alignItems="center" textAlign="center">
          <Typography variant="h1" component="h1" sx={heroTitleStyles as any}>
            {dict.title}
          </Typography>
          <Typography
            variant="h2"
            component="p"
            sx={{
              maxWidth: { xs: '100%', md: '640px' },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              ...taglineStyles
            } as any}
          >
            {dict.tagline}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: { xs: '100%', md: '560px' },
              fontSize: { xs: '0.95rem', sm: '1rem' },
              mt: 1,
              ...subtitleStyles
            } as any}
          >
            {dict.home_subtitle}
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
              {dict.explore_solutions}
            </Button>
            <Button
              component={NextLink}
              href={`/${locale}/contact`}
              variant="outlined"
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              fullWidth={isMobile}
            >
              {dict.contact_now}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </BoxAny>
  );
};

export default Hero;
