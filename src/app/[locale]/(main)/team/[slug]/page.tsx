import React from 'react';
import '@/lib/mongoose';
import TeamMember from '@/models/TeamMember';
import { Avatar, Box, Button, Chip, Container, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type { Metadata } from 'next';
import { buildDocMetadata, getBaseUrl } from '@/lib/metadata';
import mongooseConn from '@/lib/mongoose';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import PlaceIcon from '@mui/icons-material/Place';

function isObjectId(str: string) {
  return /^[a-fA-F0-9]{24}$/.test(str);
}

export default async function TeamMemberPage({ params }: { params: Promise<{ locale: 'en' | 'fa'; slug: string }> }) {
  const { locale, slug } = await params;
  const query: any = { locale };
  if (isObjectId(slug)) query._id = slug; else query.slug = slug;
  const m = await TeamMember.findOne(query).lean();
  if (!m) return <Container sx={{ py: 6 }}><Typography>Not found</Typography></Container>;

  const initials = m.name?.split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Box sx={{
      background: 'radial-gradient(600px 300px at 10% -10%, rgba(82,168,255,0.18), transparent 60%), radial-gradient(600px 300px at 90% 0%, rgba(126,87,194,0.15), transparent 60%)'
    }}>
      {/* JSON-LD Person schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: (m as any).name,
          jobTitle: (m as any).role,
          image: (m as any).avatarUrl ? (String((m as any).avatarUrl).startsWith('http') ? (m as any).avatarUrl : `${getBaseUrl()}${(m as any).avatarUrl}`) : undefined,
          url: `${getBaseUrl()}/${(m as any).locale}/team/${(m as any).slug || String((m as any)._id)}`,
          homeLocation: (m as any).location || undefined,
          sameAs: [
            (m as any).socials?.github,
            (m as any).socials?.linkedin,
            (m as any).socials?.twitter,
            (m as any).socials?.website
          ].filter(Boolean)
        }) }}
      />
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Stack gap={2} alignItems={{ xs: 'flex-start' }}>
              <Avatar src={(m as any).avatarUrl || undefined} sx={{ width: 96, height: 96, fontSize: 32 }}>{initials}</Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800}>{(m as any).name}</Typography>
                <Typography color="text.secondary">{(m as any).role}</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" label={(m as any).discipline} />
                {(m as any).location && (<Stack direction="row" spacing={0.5} alignItems="center"><PlaceIcon fontSize="small" /><Typography variant="body2">{(m as any).location}</Typography></Stack>)}
              </Stack>
              <Stack direction="row" spacing={1}>
                {(m as any).socials?.github && <Link href={(m as any).socials.github} target="_blank" rel="noopener"><GitHubIcon /></Link>}
                {(m as any).socials?.linkedin && <Link href={(m as any).socials.linkedin} target="_blank" rel="noopener"><LinkedInIcon /></Link>}
                {(m as any).socials?.twitter && <Link href={(m as any).socials.twitter} target="_blank" rel="noopener"><TwitterIcon /></Link>}
                {(m as any).socials?.website && <Link href={(m as any).socials.website} target="_blank" rel="noopener"><LanguageIcon /></Link>}
              </Stack>
              {(m as any).email && <Typography variant="body2"><Link href={`mailto:${(m as any).email}`}>{(m as any).email}</Link></Typography>}
              <Stack direction="row" spacing={1}>
                {(m as any).portfolioLink && <Button variant="outlined" size="small" href={(m as any).portfolioLink} target="_blank">Portfolio</Button>}
                {(m as any).resumeFileId && <Button variant="contained" size="small" color="secondary" href={`/api/media/${(m as any).resumeFileId}`} target="_blank">Resume</Button>}
              </Stack>
              {(m as any).skills?.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(m as any).skills.map((s: string) => <Chip key={s} label={s} size="small" sx={{ mb: 0.5 }} />)}
                </Stack>
              )}
            </Stack>
          </Grid>
          <Grid xs={12} md={8}>
            {(m as any).bio && (
              <Box sx={{ '& img': { maxWidth: '100%', height: 'auto' } }} dangerouslySetInnerHTML={{ __html: (m as any).bio }} />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: 'en'|'fa'; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  await mongooseConn;
  const q: any = { locale };
  if (/^[a-fA-F0-9]{24}$/.test(slug)) q._id = slug; else q.slug = slug;
  const m = await TeamMember.findOne(q).select('name role discipline location avatarUrl slug _id').lean();
  const title = m ? `${m.name} â€” ${m.role}` : 'Team member';
  const description = m ? `${m.role}${m.location ? ' â€¢ ' + m.location : ''}` : '';
  const avatar = (m as any)?.avatarUrl ? (String((m as any).avatarUrl).startsWith('http') ? (m as any).avatarUrl : `${getBaseUrl()}${(m as any).avatarUrl}`) : undefined;
  return buildDocMetadata({ locale, path: `/team/${slug}`, title, description, image: avatar });
}


