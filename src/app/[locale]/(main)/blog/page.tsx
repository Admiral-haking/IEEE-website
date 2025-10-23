import React from 'react';
import { connectDB } from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';
import { Container, Card, CardActionArea, CardMedia, CardContent, Typography, Stack, TextField, Button, Chip, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import NextLink from 'next/link';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';

async function getDict(locale: 'en' | 'fa') {
  return locale === 'fa' ? (await import('@/locales/fa/common.json')).default : (await import('@/locales/en/common.json')).default;
}

export default async function BlogListPage({ params, searchParams }: { params: Promise<{ locale: 'en' | 'fa' }>, searchParams: Promise<{ q?: string; tag?: string; page?: string }> }) {
  const { locale } = await params;
  const { q: qRaw, tag: tagRaw, page: pageRaw } = await searchParams;
  const dict = await getDict(locale);
  const q = qRaw?.toString() || '';
  const tag = tagRaw?.toString() || '';
  const page = Math.max(1, parseInt(pageRaw || '1', 10));
  const pageSize = 9;
  const query: any = { locale, published: true };
  if (q) query.$or = [{ title: { $regex: q, $options: 'i' } }, { excerpt: { $regex: q, $options: 'i' } }];
  if (tag) query.tags = tag;

  // Ensure database connection is established before making queries
  await connectDB();

  const [items, total, allTags] = await Promise.all([
    BlogPost.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).select('title slug excerpt coverFileId createdAt tags').lean(),
    BlogPost.countDocuments(query),
    BlogPost.distinct('tags', { locale, published: true })
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const tagList = (allTags as string[]).filter(Boolean).slice(0, 30);

  return (
    <Container sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid xs={12} md={8}>
          <Stack gap={1} sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight={800}>{dict.blog}</Typography>
            <Typography color="text.secondary">{dict.nav_blog_sub}</Typography>
          </Stack>
          <Grid container spacing={3}>
            {items.map((p: any) => (
              <Grid key={p.slug} xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                  <CardActionArea component={NextLink} href={`/${locale}/blog/${p.slug}`}>
                    {p.coverFileId && (
                      <CardMedia component="img" height="160" image={`/api/media/${p.coverFileId}`} alt={p.title} />
                    )}
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>{p.title}</Typography>
                      {p.excerpt && (
                        <Typography variant="body2" color="text.secondary">{p.excerpt}</Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1}>
              {Array.from({ length: pages }).map((_, idx) => {
                const p = idx + 1;
                const href = `/${locale}/blog?` + new URLSearchParams({ q, tag, page: String(p) }).toString();
                const active = p === page;
                return (
                  <Button key={p} component={NextLink as any} href={href} variant={active ? 'contained' : 'text'} size="small">{p}</Button>
                );
              })}
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Box component="form" action={`/${locale}/blog`} method="get" sx={{ position: 'sticky', top: 88 }}>
            <Stack gap={2}>
              <TextField name="q" defaultValue={q} placeholder="Search..." />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {tagList.map((t) => {
                  const active = t === tag;
                  const href = `/${locale}/blog?` + new URLSearchParams({ q, tag: t }).toString();
                  return (
                    <Chip key={t} label={t} component={NextLink as any} href={href} clickable color={active ? 'secondary' : 'default'} />
                  );
                })}
              </Stack>
              <Button type="submit" variant="contained" color="secondary">{dict.search || 'Search'}</Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa' }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDict(locale);
  return buildListMetadata({ locale, path: '/blog', title: dict.blog, description: dict.nav_blog_sub });
}
