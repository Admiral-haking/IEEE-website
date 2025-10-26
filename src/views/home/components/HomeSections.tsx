"use client";

import React from 'react';
import NextLink from 'next/link';
import { Box, Button, Grid, Card, CardActionArea, CardContent, Chip, Stack, Typography, Skeleton } from '@mui/material';
import Image from 'next/image';
import { typographyPresets } from '@/utils/typography';

type Props = {
  locale: 'en' | 'fa';
  dict: any;
  solutions: any[];
  capabilities: any[];
  posts: any[];
  cases: any[];
  jobs: any[];
};

// Optimized image component with lazy loading
const LazyImage = ({ src, alt, width, height, style, priority = false }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  style: React.CSSProperties;
  priority?: boolean;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'en';
  const fallbackText = (lang || 'en').startsWith('fa') ? 'تصویر در دسترس نیست' : 'Image not available';

  return (
    <Box sx={{ position: 'relative', ...style }}>
      {isLoading && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ 
          ...style, 
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {hasError && (
        <Box 
          sx={{ 
            ...style, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            color: 'grey.500'
          }}
        >
          <Typography variant="caption">{fallbackText}</Typography>
        </Box>
      )}
    </Box>
  );
};

function SectionHeader({ title, subtitle, action, locale }: { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; locale: 'en' | 'fa' }) {
  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      justifyContent="space-between" 
      alignItems={{ xs: 'flex-start', sm: 'center' }} 
      sx={{ mb: 4, gap: 2 }}
    >
      <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: { xs: '100%', sm: 'auto' } }}>
        <Typography 
          variant="h4" 
          fontWeight={700}
          sx={{
            ...typographyPresets.sectionHeader(locale),
            color: 'primary.main',
            backgroundImage: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundSize: '200% 200%',
            mb: 1,
            '@supports (-webkit-background-clip: text)': {
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            },
            '@supports (background-clip: text)': {
              backgroundClip: 'text',
              color: 'transparent'
            }
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="h6"
            color="text.secondary" 
            sx={{
              ...typographyPresets.caption(locale),
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: { xs: '100%', md: '500px' }
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box sx={{ alignSelf: { xs: 'center', sm: 'flex-end' } }}>
          {action}
        </Box>
      )}
    </Stack>
  );
}

export default function HomeSections({ locale, dict, solutions, capabilities, posts, cases, jobs }: Props) {
  return (
    <>
      {/* Solutions */}
      <Box sx={{ mb: 2 }}>
        <SectionHeader
          title={dict.solutions}
          subtitle={dict.nav_solutions_sub}
          action={<Button component={NextLink} href={`/${locale}/solutions`} size="small">{dict.view_all || 'View all'}</Button>}
          locale={locale}
        />
      </Box>
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 6, md: 8 } }} >
        {solutions.map((s: any) => (
          <Grid item key={String(s._id)} xs={12} sm={6} md={4}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                borderRadius: 4,
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: 6,
                  zIndex: 10
                }
              }}
            >
              <CardActionArea component={NextLink as any} href={`/${locale}/solutions/${s.slug || s._id}`}>
                {s.imageFileId && (
                  <LazyImage 
                    src={`/api/media/${s.imageFileId}`} 
                    alt={s.title} 
                    width={800} 
                    height={200} 
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                    priority={false}
                  />
                )}
                <CardContent sx={{ p: { xs: 2, md: 3 } }} >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      {s.title}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={(dict as any)[s.category] || s.category}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  {s.summary && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}
                    >
                      {s.summary}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Capabilities */}
      <Box sx={{ mb: 2 }}>
        <SectionHeader
          title={dict.capabilities}
          subtitle={dict.nav_capabilities_sub}
          action={<Button component={NextLink} href={`/${locale}/capabilities`} size="small">{dict.view_all || 'View all'}</Button>}
          locale={locale}
        />
      </Box>
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 6, md: 8 } }} >
        {capabilities.map((c: any) => (
          <Grid item key={String(c._id)} xs={12} md={6}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                borderRadius: 4,
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: 6,
                  zIndex: 10
                }
              }}
            >
              <CardActionArea component={NextLink as any} href={`/${locale}/capabilities/${c.slug || c._id}`}>
                {c.imageFileId && (
                  <LazyImage 
                    src={`/api/media/${c.imageFileId}`} 
                    alt={c.title} 
                    width={800} 
                    height={180} 
                    style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    priority={false}
                  />
                )}
                <CardContent sx={{ p: { xs: 2, md: 3 } }} >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      {c.title}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={(dict as any)[c.area] || c.area}
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>
                  {c.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}
                    >
                      {c.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Case studies & Blog */}
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 6, md: 8 } }} >
        <Grid item xs={12} md={6}>
          <SectionHeader
            title={dict.case_studies}
            subtitle={dict.nav_case_studies_sub}
            action={<Button component={NextLink} href={`/${locale}/case-studies`} size="small">{dict.view_all || 'View all'}</Button>}
            locale={locale}
          />
          <Stack gap={3}>
            {cases.map((c: any) => (
              <Card 
                key={String(c._id)} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 4,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 4,
                    zIndex: 10
                  }
                }}
              >
                <CardActionArea component={NextLink as any} href={`/${locale}/case-studies/${c.slug}`} sx={{ display: 'flex', alignItems: 'stretch' }}>
                  {c.coverFileId && (
                    <LazyImage 
                      src={`/api/media/${c.coverFileId}`} 
                      alt={c.title} 
                      width={160} 
                      height={120} 
                      style={{ width: 160, height: 120, objectFit: 'cover' }}
                      priority={false}
                    />
                  )}
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1.1rem', mb: 1 }}>
                      {c.title}
                    </Typography>
                    {c.summary && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}
                      >
                        {c.summary}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionHeader
            title={dict.blog}
            subtitle={dict.nav_blog_sub}
            action={<Button component={NextLink} href={`/${locale}/blog`} size="small">{dict.view_all || 'View all'}</Button>}
            locale={locale}
          />
          <Stack gap={3}>
            {posts.map((p: any) => (
              <Card 
                key={String(p._id)} 
                variant="outlined" 
                sx={{ 
                  borderRadius: 4,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 4,
                    zIndex: 10
                  }
                }}
              >
                <CardActionArea component={NextLink as any} href={`/${locale}/blog/${p.slug}`} sx={{ display: 'flex', alignItems: 'stretch' }}>
                  {p.coverFileId && (
                    <LazyImage 
                      src={`/api/media/${p.coverFileId}`} 
                      alt={p.title} 
                      width={160} 
                      height={120} 
                      style={{ width: 160, height: 120, objectFit: 'cover' }}
                      priority={false}
                    />
                  )}
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1.1rem', mb: 1 }}>
                      {p.title}
                    </Typography>
                    {p.excerpt && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}
                      >
                        {p.excerpt}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>

      {/* Jobs */}
      <Box sx={{ mb: 2 }}>
        <SectionHeader
          title={dict.jobs}
          subtitle={dict.nav_jobs_sub}
          action={<Button component={NextLink} href={`/${locale}/jobs`} size="small">{dict.view_all || 'View all'}</Button>}
          locale={locale}
        />
      </Box>
      <Grid container spacing={{ xs: 2, md: 4 }} >
        {jobs.map((j: any) => (
          <Grid item key={String(j._id)} xs={12} sm={6} md={4}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderRadius: 4, 
                height: '100%',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: 6,
                  zIndex: 10
                }
              }}
            >
              <CardActionArea component={NextLink as any} href={`/${locale}/jobs/${j.slug}`}>
                {j.imageFileId && (
                  <LazyImage 
                    src={`/api/media/${j.imageFileId}`} 
                    alt={j.title} 
                    width={800} 
                    height={150} 
                    style={{ width: '100%', height: 150, objectFit: 'cover' }}
                    priority={false}
                  />
                )}
                <CardContent sx={{ p: { xs: 2, md: 3 } }} >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                      {j.title}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={j.type}
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}
                  >
                    {j.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

