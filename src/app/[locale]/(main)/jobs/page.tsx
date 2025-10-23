import React from 'react';
import '@/lib/mongoose';
import Job from '@/models/Job';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Chip, Stack, CardMedia } from '@mui/material';
import NextLink from 'next/link';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';

async function getDict(locale: 'en' | 'fa') {
  return locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
}

export default async function JobsPage({ params }: { params: Promise<{ locale: 'en' | 'fa' }> }) {
  const { locale } = await params;
  const dict = await getDict(locale);
  const jobs = await Job.find({ locale, published: true })
    .sort({ createdAt: -1 })
    .select('title slug type location imageFileId')
    .lean();
  return (
    <Container sx={{ py: 6 }}>
      <Stack gap={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>{dict.jobs}</Typography>
        <Typography color="text.secondary">{dict.nav_jobs_sub}</Typography>
      </Stack>
      <Grid container spacing={3}>
        {jobs.map((j: any) => (
          <Grid key={j.slug} xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardActionArea component={NextLink} href={`/${locale}/jobs/${j.slug}`}>
                {j.imageFileId && <CardMedia component="img" height="140" image={`/api/media/${j.imageFileId}`} alt={j.title} />}
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700}>{j.title}</Typography>
                    <Chip size="small" label={j.type} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{j.location}</Typography>
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
  return buildListMetadata({ locale, path: '/jobs', title: dict.jobs, description: dict.nav_jobs_sub });
}
