"use client";

import React from 'react';
import { Breadcrumbs, Container, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function labelFor(seg: string, t: (k: string) => string) {
  const map: Record<string, string> = {
    admin: t('dashboard'),
    users: t('users'),
    solutions: t('solutions'),
    capabilities: t('capabilities'),
    team: t('team'),
    blog: t('blog'),
    'case-studies': t('case_studies'),
    jobs: t('jobs'),
    contact: t('contact'),
    privacy: t('privacy'),
    terms: t('terms')
  };
  return map[seg] || seg;
}

export default function BreadcrumbsNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const parts = (pathname || '/').split('/').filter(Boolean);
  if (parts.length <= 1) return null; // only locale present
  const locale = parts[0];
  const trail = parts.slice(1);
  const acc: { href: string; seg: string }[] = [];
  trail.reduce((href, seg) => {
    const next = `${href}/${seg}`;
    acc.push({ href: next, seg });
    return next;
  }, `/${locale}`);

  return (
    <Container sx={{ pt: 1.5 }}>
      <Breadcrumbs aria-label="breadcrumbs">
        <Link component={NextLink} href={`/${locale}`}>{t('home')}</Link>
        {acc.map((c, idx) => {
          const isLast = idx === acc.length - 1;
          const label = labelFor(c.seg, t);
          return isLast ? (
            <Typography key={c.href} color="text.secondary">{label}</Typography>
          ) : (
            <Link key={c.href} component={NextLink} href={c.href}>{label}</Link>
          );
        })}
      </Breadcrumbs>
    </Container>
  );
}
