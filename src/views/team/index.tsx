"use client";

import React from 'react';
import useAxios from 'axios-hooks';
import { Alert, Box, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import TeamCard, { TeamMember } from './components/TeamCard';
import { useTranslation } from 'react-i18next';

type TabKey = 'all' | 'software' | 'hardware' | 'networking';

export default function TeamView() {
  const { t } = useTranslation();
  const [{ data, loading, error }] = useAxios<{ members: TeamMember[] }>({ url: '/api/team' });
  const [tab, setTab] = React.useState<TabKey>('all');

  const members = data?.members || [];
  const filtered = tab === 'all' ? members : members.filter((m) => m.discipline === tab);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>{t('our_team')}</Typography>

      <Tabs value={tab} onChange={(_evt: React.SyntheticEvent, v: TabKey) => setTab(v)} sx={{ mb: 3 }}>
        <Tab value="all" label={t('all')} />
        <Tab value="software" label={t('software')} />
        <Tab value="hardware" label={t('hardware')} />
        <Tab value="networking" label={t('networking')} />
      </Tabs>

      {error && <Alert severity="error">{t('error_loading_team')}</Alert>}

      <Grid container spacing={3}>
        {filtered.map((m) => (
          <Grid key={m._id} xs={12} sm={6} md={4}>
            <TeamCard member={m} />
          </Grid>
        ))}
        {!loading && filtered.length === 0 && (
          <Box sx={{ color: 'text.secondary' }}>{t('no_members')}</Box>
        )}
      </Grid>
    </Container>
  );
}
