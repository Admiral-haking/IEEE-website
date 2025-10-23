import React from 'react';
import { connectDB } from '@/lib/mongoose';
import Solution from '@/models/Solution';
import { Container, Card, CardActionArea, CardMedia, CardContent, Typography, Chip, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'
import NextLink from 'next/link';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';

async function getDict(locale: 'en' | 'fa') {
  return locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
}


export default async function SolutionsPage({ params }: { params: Promise<{ locale: 'en' | 'fa' }> }) {
  const { locale } = await params;
  const dict = await getDict(locale);
  
  // Ensure database connection is established before making queries
  await connectDB();
  
  const items = await Solution.find({ locale, published: true }).sort({ createdAt: -1 }).select('title slug category summary imageFileId').lean();
  return (
    <Container sx={{ py: 6 }}>
      <Stack gap={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>{dict.solutions}</Typography>
        <Typography color="text.secondary">{dict.nav_solutions_sub}</Typography>
      </Stack>
      <Grid container spacing={3}>
        {items.map((s: any) => (
          <Grid key={`${s.title}-${s._id}`} xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
              <CardActionArea component={NextLink as any} href={`/${locale}/solutions/${s.slug || s._id}`}>
                {s.imageFileId && <CardMedia component="img" height="160" image={`/api/media/${s.imageFileId}`} alt={s.title} />}
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700}>{s.title}</Typography>
                    <Chip size="small" label={(dict as any)[s.category] || s.category} />
                  </Stack>
                  {s.summary && <Typography variant="body2" color="text.secondary">{s.summary}</Typography>}
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
  return buildListMetadata({ locale, path: '/solutions', title: dict.solutions, description: dict.nav_solutions_sub });
}

