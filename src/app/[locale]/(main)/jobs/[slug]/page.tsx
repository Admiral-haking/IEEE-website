import React from 'react';
import { connectDB } from '@/lib/mongoose';
import Job from '@/models/Job';
import { Container, Typography, Box, Chip } from '@mui/material';
import type { Metadata } from 'next';
import { buildDocMetadata, getBaseUrl } from '@/lib/metadata';

export default async function JobPage({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Ensure database connection is established before making queries
  await connectDB();
  
  const job = await Job.findOne({ locale, slug, published: true }).lean();
  if (!job) return <Container sx={{ py: 6 }}><Typography>Not found</Typography></Container>;
  return (
    <Container sx={{ py: 6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: job.title,
          employmentType: job.type,
          jobLocation: job.location ? { '@type': 'Place', address: job.location } : undefined,
          description: job.descriptionHtml || '',
          hiringOrganization: { '@type': 'Organization', name: 'Hippogriff Engineering' },
          url: `${getBaseUrl()}/${(job as any).locale}/jobs/${(job as any).slug}`
        }) }}
      />
      {job.imageFileId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/media/${job.imageFileId}`} alt={job.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
      )}
      <Typography variant="h3" fontWeight={800} gutterBottom>{job.title}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip label={job.type} size="small" />
        {job.location && <Chip label={job.location} size="small" />}
      </Box>
      <Box mt={3} sx={{ '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: job.descriptionHtml || '' }} />
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  await connectDB();
  const job = await Job.findOne({ locale, slug, published: true }).select('title type location imageFileId').lean();
  const title = job?.title || 'Job';
  const description = job ? `${job.type}${job.location ? ' • ' + job.location : ''}` : '';
  const image = job?.imageFileId ? `${getBaseUrl()}/api/media/${job.imageFileId}` : undefined;
  return buildDocMetadata({ locale, path: `/jobs/${slug}`, title, description, image });
}
