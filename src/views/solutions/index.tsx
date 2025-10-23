"use client";

import React from 'react';
import { Container, Typography } from '@mui/material';
import SolutionsGrid from '@/views/home/components/SolutionsGrid';
import { useTranslation } from 'react-i18next';

export default function SolutionsView() {
  const { t } = useTranslation();
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>{t('solutions')}</Typography>
      <SolutionsGrid />
    </Container>
  );
}

