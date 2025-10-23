"use client";

import React from 'react';
import useAxios from 'axios-hooks';
import { Dialog, DialogTitle, DialogContent, ImageList, ImageListItem, ImageListItemBar, IconButton, Tooltip, Button, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';

export default function MediaPickerDialog({ open, onClose, onSelect, imagesOnly = true }: { open: boolean; onClose: () => void; onSelect: (file: { id: string; src: string; filename: string; contentType?: string }) => void; imagesOnly?: boolean; }) {
  const { t } = useTranslation();
  const [{ data }, refetch] = useAxios({ url: '/api/media' }, { useCache: false });
  const [, upload] = useAxios({ url: '/api/media', method: 'POST' }, { manual: true });
  const items: any[] = data?.items || [];
  const files = imagesOnly ? items.filter((f) => String(f.contentType || '').startsWith('image/')) : items;
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
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span>{t('select_image')}</span>
          <Button size="small" variant="outlined" component="label">
            {t('upload_file')}
            <input type="file" hidden onChange={onPick} accept={imagesOnly ? 'image/*' : undefined} />
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <ImageList cols={4} gap={8} sx={{ m: 0 }}>
          {files.map((f) => {
            const src = `/api/media/${f._id}`;
            return (
              <ImageListItem key={f._id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={f.filename} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <ImageListItemBar title={f.filename} actionIcon={
                  <Tooltip title={t('select') as string}>
                    <IconButton onClick={() => { onSelect({ id: String(f._id), src, filename: f.filename, contentType: f.contentType }); onClose(); }} size="small" sx={{ color: 'white' }}>
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                } />
              </ImageListItem>
            );
          })}
        </ImageList>
      </DialogContent>
    </Dialog>
  );
}
