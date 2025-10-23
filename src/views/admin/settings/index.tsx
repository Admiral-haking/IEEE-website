"use client";

import React from 'react';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

type SettingsPayload = {
  siteTitle?: string;
  contactEmail?: string;
  analyticsKey?: string;
  locale: string;
};

export default function SettingsAdminView() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';

  const [{ data, loading }, refetch] = useAxios({ url: '/api/settings', params: { locale } });
  const [, saveReq] = useAxios({ method: 'POST' }, { manual: true });

  const [form, setForm] = React.useState<SettingsPayload>({ siteTitle: '', contactEmail: '', analyticsKey: '', locale });

  React.useEffect(() => {
    if (!data) return;
    setForm({
      siteTitle: data?.siteTitle || '',
      contactEmail: data?.contactEmail || '',
      analyticsKey: data?.analyticsKey || '',
      locale
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, locale]);

  const onChange = (key: keyof SettingsPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSave = async () => {
    await saveReq({ url: `/api/settings?locale=${locale}`, data: form });
    await refetch();
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{t('settings') || 'Settings'}</Typography>

      <Stack gap={2}>
        <TextField
          label={t('siteTitle') || 'Site title'}
          value={form.siteTitle || ''}
          onChange={onChange('siteTitle')}
          disabled={loading}
        />
        <TextField
          label={t('contactEmail') || 'Contact email'}
          value={form.contactEmail || ''}
          onChange={onChange('contactEmail')}
          disabled={loading}
        />
        <TextField
          label={t('analyticsKey') || 'Analytics key'}
          value={form.analyticsKey || ''}
          onChange={onChange('analyticsKey')}
          disabled={loading}
        />

        <Box>
          <Button variant="contained" onClick={onSave} disabled={loading}>{t('save') || 'Save'}</Button>
        </Box>
      </Stack>
    </Container>
  );
}


