"use client";

import React from 'react';
import { Breadcrumbs, Container, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';

function labelFor(seg: string, dict: Record<string, any>) {
  const map: Record<string, string> = {
    admin: dict.dashboard,
    users: dict.users,
    solutions: dict.solutions,
    capabilities: dict.capabilities,
    team: dict.team,
    blog: dict.blog,
    'case-studies': dict.case_studies,
    jobs: dict.jobs,
    contact: dict.contact,
    privacy: dict.privacy,
    terms: dict.terms
  };
  return map[seg] || seg;
}

export default function BreadcrumbsNav() {
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  if (parts.length <= 1) return null; // only locale present
  const locale = parts[0];
  const dict = locale === 'fa' ? (faCommon as any) : (enCommon as any);
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
        <Link component={NextLink} href={`/${locale}`}>{dict.home}</Link>
        {acc.map((c, idx) => {
          const isLast = idx === acc.length - 1;
          const label = labelFor(c.seg, dict);
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
