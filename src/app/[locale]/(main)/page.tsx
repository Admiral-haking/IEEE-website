import React from 'react';
import { connectDB } from '@/lib/mongoose';
import Solution from '@/models/Solution';
import Capability from '@/models/Capability';
import BlogPost from '@/models/BlogPost';
import CaseStudy from '@/models/CaseStudy';
import Job from '@/models/Job';
import Hero from '@/views/home/components/Hero';
import { Container } from '@mui/material';
import HomeCompositeClient from '@/views/home/components/HomeCompositeClient';
import type { Metadata } from 'next';
import { buildListMetadata } from '@/lib/metadata';
import type { CommonDictionary, Locale } from '@/types/i18n';

async function getDict(locale: Locale): Promise<CommonDictionary> {
  if (locale === 'fa') {
    const faDict = (await import('@/locales/fa/common.json')).default;
    return faDict as CommonDictionary;
  }

  const enDict = (await import('@/locales/en/common.json')).default;
  return enDict;
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = await getDict(locale);
  
  // Ensure database connection is established before making queries
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    // Continue with empty data if database is not available
  }
  
  const [solutions, capabilities, posts, cases, jobs] = await Promise.all([
    Solution.find({ locale, published: true }).sort({ createdAt: -1 }).limit(6).select('title slug summary category imageFileId').lean().then(data => 
      data.map(item => ({ ...item, _id: item._id.toString() }))
    ).catch(() => []),
    Capability.find({ locale }).sort({ title: 1 }).limit(6).select('title slug area description imageFileId').lean().then(data => 
      data.map(item => ({ ...item, _id: item._id.toString() }))
    ).catch(() => []),
    BlogPost.find({ locale, published: true }).sort({ createdAt: -1 }).limit(3).select('title slug excerpt coverFileId createdAt tags').lean().then(data => 
      data.map(item => ({ ...item, _id: item._id.toString() }))
    ).catch(() => []),
    CaseStudy.find({ locale, published: true }).sort({ createdAt: -1 }).limit(3).select('title slug summary coverFileId createdAt').lean().then(data => 
      data.map(item => ({ ...item, _id: item._id.toString() }))
    ).catch(() => []),
    Job.find({ locale, published: true }).sort({ createdAt: -1 }).limit(3).select('title slug type location imageFileId').lean().then(data => 
      data.map(item => ({ ...item, _id: item._id.toString() }))
    ).catch(() => [])
  ]);
  const [solutionsTotal, postsTotal, casesTotal, jobsTotal] = await Promise.all([
    Solution.countDocuments({ locale, published: true }).catch(() => 0),
    BlogPost.countDocuments({ locale, published: true }).catch(() => 0),
    CaseStudy.countDocuments({ locale, published: true }).catch(() => 0),
    Job.countDocuments({ locale, published: true }).catch(() => 0)
  ]);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <HomeCompositeClient
          stats={[
            { value: solutionsTotal, label: dict.stats_projects || 'Solutions' },
            { value: postsTotal, label: dict.stats_blog_posts || 'Blog posts' },
            { value: casesTotal, label: dict.stats_case_studies || 'Case studies' },
            { value: jobsTotal, label: dict.stats_jobs || 'Open jobs' }
          ]}
          locale={locale}
          dict={dict}
          solutions={solutions}
          capabilities={capabilities}
          posts={posts}
          cases={cases}
          jobs={jobs}
        />
      </Container>
    </>
  );
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params;
  const dict = await getDict(locale);
  return buildListMetadata({
    locale,
    path: '',
    title: dict.title,
    description: dict.tagline
  });
}

// Revalidate static data every 5 minutes for fresher homepage while staying fast
export const revalidate = 300;
