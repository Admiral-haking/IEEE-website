"use client";

import React from 'react';
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';

export default function Footer() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  const dict = (parts[0] === 'fa' ? (faCommon as any) : (enCommon as any));
  return (
    <Box
      component="footer"
      sx={(theme: any) => ({
        py: 2,
        pb: 'max(12px, env(safe-area-inset-bottom))',
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        minHeight: 'var(--footer-height)',
        zIndex: theme.zIndex.appBar,
        backdropFilter: 'blur(12px)',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 18, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
        borderTop:
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)'
      })}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            © {new Date().getFullYear()} {locale === 'fa' ? 'انجمن علمی مهندسی کامپیوتر' : 'Computer Engineering Association'}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Link component={NextLink} href={`/${locale}/privacy`} color="text.secondary">{dict.privacy}</Link>
            <Link component={NextLink} href={`/${locale}/terms`} color="text.secondary">{dict.terms}</Link>
            <Link component={NextLink} href={`/${locale}/contact`} color="text.secondary">{dict.contact}</Link>
            <Link component={NextLink} href={`/${locale}/signin`} color="text.secondary">{dict.sign_in}</Link>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
          {locale === 'fa' 
            ? 'دانشگاه صنعتی قوچان - پیشبرد علم و فناوری' 
            : 'Quchan University of Technology - Advancing Science and Technology'
          }
        </Typography>
      </Container>
    </Box>
  );
}
