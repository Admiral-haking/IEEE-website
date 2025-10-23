import React from 'react';
import { connectDB } from '@/lib/mongoose';
import Solution from '@/models/Solution';
import { Container, Typography, Box, Chip, Stack } from '@mui/material';
import type { Metadata } from 'next';
import { buildDocMetadata, getBaseUrl } from '@/lib/metadata';

export default async function SolutionPage({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Ensure database connection is established before making queries
  await connectDB();
  
  let doc = await Solution.findOne({ locale, slug, published: true }).lean();
  if (!doc) {
    // Fallback: allow linking by ObjectId when slug is missing
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    if (isObjectId) doc = await Solution.findOne({ _id: slug, locale, published: true }).lean();
  }
  if (!doc) return <Container sx={{ py: 6 }}><Typography>Not found</Typography></Container>;
  return (
    <Container sx={{ py: 6 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: doc.title,
        description: doc.summary || '',
        category: doc.category,
        areaServed: (doc as any).locale,
        image: doc.imageFileId ? [`${getBaseUrl()}/api/media/${doc.imageFileId}`] : undefined,
        url: `${getBaseUrl()}/${(doc as any).locale}/solutions/${(doc as any).slug || (doc as any)._id}`
      }) }} />
      {doc.imageFileId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/media/${doc.imageFileId}`} alt={doc.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
      )}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h3" fontWeight={800}>{doc.title}</Typography>
        <Chip size="small" label={doc.category} />
      </Stack>
      {doc.summary && <Typography color="text.secondary" gutterBottom>{doc.summary}</Typography>}
      <Box mt={3} sx={{ '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: (doc as any).contentHtml || '' }} />
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  await connectDB();
  let doc = await Solution.findOne({ locale, slug, published: true }).select('title summary imageFileId').lean();
  if (!doc && /^[0-9a-fA-F]{24}$/.test(slug)) {
    doc = await Solution.findOne({ _id: slug, locale, published: true }).select('title summary imageFileId').lean();
  }
  const title = doc?.title || 'Solution';
  const description = doc?.summary || '';
  const image = doc?.imageFileId ? `${getBaseUrl()}/api/media/${doc.imageFileId}` : undefined;
  return buildDocMetadata({ locale, path: `/solutions/${slug}`, title, description, image });
}
