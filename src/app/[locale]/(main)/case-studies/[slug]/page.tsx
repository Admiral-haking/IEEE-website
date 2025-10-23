import React from 'react';
import { connectDB } from '@/lib/mongoose';
import CaseStudy from '@/models/CaseStudy';
import { Container, Typography, Box } from '@mui/material';
import type { Metadata } from 'next';
import { buildDocMetadata, getBaseUrl } from '@/lib/metadata';

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Ensure database connection is established before making queries
  await connectDB();
  
  const doc = await CaseStudy.findOne({ locale, slug, published: true }).lean();
  if (!doc) return <Container sx={{ py: 6 }}><Typography>Not found</Typography></Container>;
  return (
    <Container sx={{ py: 6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          headline: doc.title,
          description: doc.summary || '',
          image: doc.coverFileId ? [`${getBaseUrl()}/api/media/${doc.coverFileId}`] : undefined,
          inLanguage: (doc as any).locale || undefined,
          url: `${getBaseUrl()}/${(doc as any).locale}/case-studies/${(doc as any).slug}`
        }) }}
      />
      {doc.coverFileId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/media/${doc.coverFileId}`} alt={doc.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
      )}
      <Typography variant="h3" fontWeight={800} gutterBottom>{doc.title}</Typography>
      {doc.summary && <Typography color="text.secondary" gutterBottom>{doc.summary}</Typography>}
      <Box mt={3} sx={{ '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: doc.contentHtml || '' }} />
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  await connectDB();
  const doc = await CaseStudy.findOne({ locale, slug, published: true }).select('title summary coverFileId').lean();
  const title = doc?.title || 'Case study';
  const description = doc?.summary || '';
  const image = doc?.coverFileId ? `${getBaseUrl()}/api/media/${doc.coverFileId}` : undefined;
  return buildDocMetadata({ locale, path: `/case-studies/${slug}`, title, description, image });
}
