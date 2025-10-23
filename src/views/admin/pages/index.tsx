"use client";

import React from 'react';
import { Box, Button, Container, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import useAxios from 'axios-hooks';
import Editor from '@/components/Editor';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

type Key = 'privacy' | 'terms' | 'contact';

export default function PagesAdminView() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? (parts[0] as 'en' | 'fa') : 'en';

  const [tab, setTab] = React.useState<Key>('privacy');
  const [{ data, loading }, refetch] = useAxios({ url: '/api/pages', params: { key: tab, locale } });
  const [, save] = useAxios({ method: 'PATCH' }, { manual: true });

  type PageState = { contentHtml: string; contact?: any };
  const [pages, setPages] = React.useState<Record<Key, PageState>>({
    privacy: { contentHtml: '' },
    terms: { contentHtml: '' },
    contact: { contentHtml: '', contact: {} }
  });

  React.useEffect(() => {
    if (!data) return;
    setPages((prev) => ({
      ...prev,
      [tab]: {
        contentHtml: data.contentHtml || '',
        contact: tab === 'contact' ? (data.contact || {}) : prev[tab]?.contact
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSave = async () => {
    const state = pages[tab] || { contentHtml: '' };
    await save({ url: `/api/pages?key=${tab}&locale=${locale}`, data: { contentHtml: state.contentHtml, contact: tab === 'contact' ? state.contact : undefined } });
    await refetch();
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{t('pages')}</Typography>
      <Tabs value={tab} onChange={(_evt: React.SyntheticEvent, v: Key) => setTab(v)} sx={{ mb: 2 }}>
        <Tab value="privacy" label={t('privacy')} />
        <Tab value="terms" label={t('terms')} />
        <Tab value="contact" label={t('contact')} />
      </Tabs>

      <Stack gap={2}>
        {tab === 'contact' && (
          <Box>
            <Stack gap={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField label={t('phone_label')} value={(pages.contact?.contact?.phone) || ''} onChange={(e) => setPages((prev) => ({ ...prev, contact: { contentHtml: prev.contact.contentHtml, contact: { ...prev.contact.contact, phone: e.target.value } } }))} fullWidth required />
              <TextField label={t('email_label')} value={(pages.contact?.contact?.email) || ''} onChange={(e) => setPages((prev) => ({ ...prev, contact: { contentHtml: prev.contact.contentHtml, contact: { ...prev.contact.contact, email: e.target.value } } }))} fullWidth required />
            </Stack>
            <TextField label={t('address_label')} value={(pages.contact?.contact?.address) || ''} onChange={(e) => setPages((prev) => ({ ...prev, contact: { contentHtml: prev.contact.contentHtml, contact: { ...prev.contact.contact, address: e.target.value } } }))} fullWidth sx={{ mt: 2 }} />
            <TextField label={t('map_embed_label')} value={(pages.contact?.contact?.mapEmbedUrl) || ''} onChange={(e) => setPages((prev) => ({ ...prev, contact: { contentHtml: prev.contact.contentHtml, contact: { ...prev.contact.contact, mapEmbedUrl: e.target.value } } }))} fullWidth sx={{ mt: 2 }} />
            <TextField label={t('opening_hours_label')} value={(pages.contact?.contact?.openingHours) || ''} onChange={(e) => setPages((prev) => ({ ...prev, contact: { contentHtml: prev.contact.contentHtml, contact: { ...prev.contact.contact, openingHours: e.target.value } } }))} fullWidth sx={{ mt: 2 }} />
          </Box>
        )}

        <Editor value={pages[tab]?.contentHtml || ''} onChange={(html) => setPages((prev) => ({ ...prev, [tab]: { ...prev[tab], contentHtml: html } as PageState }))} />

        <Box>
          <Button variant="contained" color="secondary" onClick={onSave}>{t('save_changes')}</Button>
        </Box>
      </Stack>
    </Container>
  );
}
