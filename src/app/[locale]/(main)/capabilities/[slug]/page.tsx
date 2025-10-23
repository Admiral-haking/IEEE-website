import React from 'react';
import { connectDB } from '@/lib/mongoose';
import Capability from '@/models/Capability';
import { Container, Typography, Box, Chip, Stack } from '@mui/material';
import type { Metadata } from 'next';
import { buildDocMetadata, getBaseUrl } from '@/lib/metadata';

export default async function CapabilityPage({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Ensure database connection is established before making queries
  await connectDB();
  
  let doc = await Capability.findOne({ locale, slug }).lean();
  if (!doc) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
    if (isObjectId) doc = await Capability.findOne({ _id: slug, locale }).lean();
  }
  if (!doc) return <Container sx={{ py: 6 }}><Typography>Not found</Typography></Container>;
  return (
    <Container sx={{ py: 6 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: doc.title,
        description: doc.description || '',
        category: doc.area,
        areaServed: (doc as any).locale,
        image: doc.imageFileId ? [`${getBaseUrl()}/api/media/${doc.imageFileId}`] : undefined,
        url: `${getBaseUrl()}/${(doc as any).locale}/capabilities/${(doc as any).slug || (doc as any)._id}`
      }) }} />
      {doc.imageFileId && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/media/${doc.imageFileId}`} alt={doc.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
      )}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h3" fontWeight={800}>{doc.title}</Typography>
        <Chip size="small" label={doc.area} />
      </Stack>
      {doc.description && <Typography color="text.secondary" gutterBottom>{doc.description}</Typography>}
      <Box mt={3} sx={{ '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: (doc as any).contentHtml || '' }} />
    </Container>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  await connectDB();
  let doc = await Capability.findOne({ locale, slug }).select('title description imageFileId').lean();
  if (!doc && /^[0-9a-fA-F]{24}$/.test(slug)) {
    doc = await Capability.findOne({ _id: slug, locale }).select('title description imageFileId').lean();
  }
  const title = doc?.title || 'Capability';
  const description = doc?.description || '';
  const image = doc?.imageFileId ? `${getBaseUrl()}/api/media/${doc.imageFileId}` : undefined;
  return buildDocMetadata({ locale, path: `/capabilities/${slug}`, title, description, image });
}
