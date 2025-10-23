import React from 'react';
import '@/lib/mongoose';
import StaticPage from '@/models/StaticPage';
import { Container, Typography, Box } from '@mui/material';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';

async function getDict(locale: 'en'|'fa') {
  return locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: 'en'|'fa' }> }) {
  const { locale } = await params;
  const dict = await getDict(locale);
  const page = await StaticPage.findOne({ key: 'privacy', locale }).lean();
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>{dict.privacy}</Typography>
      <Box mt={2} sx={{ '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: page?.contentHtml || '' }} />
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa' }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDict(locale as any);
  return buildListMetadata({ locale, path: '/privacy', title: dict.privacy, description: dict.nav_pages_sub });
}
