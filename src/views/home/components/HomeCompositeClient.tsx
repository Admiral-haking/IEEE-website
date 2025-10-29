"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import type { CommonDictionary, Locale } from '@/types/i18n';

const StatsBand = dynamic(() => import('@/views/home/components/StatsBand'), { ssr: false });
const HomeSections = dynamic(() => import('@/views/home/components/HomeSections'), { ssr: false });

interface Props {
  stats: { value: number | string; label: string }[];
  locale: Locale;
  dict: CommonDictionary;
  solutions: any[];
  capabilities: any[];
  posts: any[];
  cases: any[];
  jobs: any[];
}

export default function HomeCompositeClient({ stats, locale, dict, solutions, capabilities, posts, cases, jobs }: Props) {
  return (
    <>
      <StatsBand stats={stats} />
      <HomeSections
        locale={locale}
        dict={dict}
        solutions={solutions}
        capabilities={capabilities}
        posts={posts}
        cases={cases}
        jobs={jobs}
      />
    </>
  );
}

