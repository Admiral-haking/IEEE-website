"use client";

import React from 'react';
import { Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function CapabilitiesView() {
  const { t } = useTranslation();
  const items = [
    { title: t('software'), desc: t('capability_software_desc') },
    { title: t('hardware'), desc: t('capability_hardware_desc') },
    { title: t('networking'), desc: t('capability_networking_desc') },
    { title: t('devops'), desc: t('capability_devops_desc') }
  ];
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>{t('capabilities')}</Typography>
      <Grid container spacing={3}>
        {items.map((it) => (
          <Grid key={it.title} xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Stack gap={1}>
                <Typography variant="h6" fontWeight={700}>{it.title}</Typography>
                <Typography color="text.secondary">{it.desc}</Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

