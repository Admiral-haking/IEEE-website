import React from 'react';
import '@/lib/mongoose';
import Capability from '@/models/Capability';
import { Container, Card, CardContent, Typography, Stack, Chip, CardMedia, CardActionArea } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'
import NextLink from 'next/link';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';

async function getDict(locale: 'en' | 'fa') {
  return locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
}

export default async function CapabilitiesPage({ params }: { params: Promise<{ locale: 'en' | 'fa' }> }) {
  const { locale } = await params;
  const dict = await getDict(locale);
  const items = await Capability.find({ locale }).sort({ title: 1 }).select('title slug area description imageFileId').lean();
  return (
    <Container sx={{ py: 6 }}>
      <Stack gap={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>{dict.capabilities}</Typography>
        <Typography color="text.secondary">{dict.nav_capabilities_sub}</Typography>
      </Stack>
      <Grid container spacing={3}>
        {items.map((c: any) => (
          <Grid key={`${c.title}-${c._id}`} xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
              <CardActionArea component={NextLink as any} href={`/${locale}/capabilities/${c.slug || c._id}`}>
                {c.imageFileId && <CardMedia component="img" height="140" image={`/api/media/${c.imageFileId}`} alt={c.title} />}
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700}>{c.title}</Typography>
                    <Chip size="small" label={(dict as any)[c.area] || c.area} />
                  </Stack>
                  {c.description && <Typography variant="body2" color="text.secondary">{c.description}</Typography>}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa' }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDict(locale);
  return buildListMetadata({ locale, path: '/capabilities', title: dict.capabilities, description: dict.nav_capabilities_sub });
}

