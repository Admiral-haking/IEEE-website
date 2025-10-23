"use client";

import React from 'react';
import useAxios from 'axios-hooks';
import { Alert, Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/views/admin/users/components/ConfirmDialog';

export default function MediaAdminView() {
  const { t } = useTranslation();
  const [{ data, error }, refetch] = useAxios({ url: '/api/media' });
  const [, upload] = useAxios({ url: '/api/media', method: 'POST' }, { manual: true });
  const [, del] = useAxios({ method: 'DELETE' }, { manual: true });
  const [confirm, setConfirm] = React.useState<{ open: boolean; id?: string; name?: string }>({ open: false });

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read error'));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
    const base64 = dataUrl.split('base64,')[1] || '';
    await upload({ data: { name: file.name, contentType: file.type, data: base64 } });
    await refetch();
  };

  const items = data?.items || [];

  return (
    <Container sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{t('media')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('media_admin_sub')}</Typography>
        </Box>
        <Button variant="contained" color="secondary" component="label">
          {t('upload_file')}
          <input type="file" hidden onChange={onPick} />
        </Button>
      </Stack>

      {error && <Alert severity="error">{t('load_failed')}</Alert>}
      <Grid container spacing={2}>
        {items.map((f: any) => (
          <Grid key={f._id} xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardActionArea href={`/api/media/${f._id}`} target="_blank">
                {String(f.contentType || '').startsWith('image/') && (
                  <CardMedia component="img" image={`/api/media/${f._id}`} alt={f.filename} sx={{ maxHeight: 180, objectFit: 'cover' }} />
                )}
                <CardContent>
                  <Typography fontWeight={700} noWrap>{f.filename}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.length} {t('bytes')}</Typography>
                  <Typography variant="caption" color="text.secondary">{f.contentType}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Tooltip title={t('delete') as string}>
                       <IconButton size="small" onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); setConfirm({ open: true, id: String(f._id), name: f.filename }); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false })}
        onConfirm={async () => { if (confirm.id) { await del({ url: `/api/media/${confirm.id}` }); await refetch(); } }}
        title={t('delete_file_title')}
        message={t('delete_file_message', { filename: confirm.name || t('this_user') })}
      />
    </Container>
  );
}
