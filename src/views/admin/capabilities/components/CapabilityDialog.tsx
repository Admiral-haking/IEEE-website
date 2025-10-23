"use client";

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import MediaPickerDialog from '@/components/MediaPickerDialog';
import Editor from '@/components/Editor';

const Schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  area: z.enum(['software', 'hardware', 'networking', 'devops']),
  description: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  imageFileId: z.string().optional()
});

type Values = z.infer<typeof Schema>;

export default function CapabilityDialog({ open, onClose, initial, onSubmit }: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Values>;
  onSubmit: (values: Values) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { title: '', slug: '', area: 'software', description: '', contentHtml: '', imageFileId: '' }
  });
  React.useEffect(() => { register('contentHtml'); }, [register]);
  React.useEffect(() => { reset({ title: initial?.title || '', slug: (initial as any)?.slug || '', area: (initial?.area as any) || 'software', description: (initial as any)?.description || '', contentHtml: (initial as any)?.contentHtml || '' }); }, [initial, reset]);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const imageId = watch('imageFileId');
  const imageSrc = imageId ? `/api/media/${imageId}` : '';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial?.title ? t('edit_capability') : t('add_capability')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField label={t('title_label')} {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
          <TextField label={t('slug_label')} {...register('slug')} error={!!errors.slug} helperText={errors.slug?.message} />
          <TextField select label={t('area_label')} defaultValue={initial?.area || 'software'} {...register('area')} error={!!errors.area} helperText={errors.area?.message}>
            <MenuItem value="software">{t('software')}</MenuItem>
            <MenuItem value="hardware">{t('hardware')}</MenuItem>
            <MenuItem value="networking">{t('networking')}</MenuItem>
            <MenuItem value="devops">DevOps</MenuItem>
          </TextField>
          <TextField label={t('description_label')} multiline minRows={3} {...register('description')} />
          <Editor value={watch('contentHtml')} onChange={(html) => setValue('contentHtml', html, { shouldDirty: true })} />
          <Box>
            <Button variant="outlined" size="small" onClick={() => setPickerOpen(true)}>{t('select_image')}</Button>
            {imageSrc && (
              <Box sx={{ mt: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="cover" style={{ maxWidth: '100%', borderRadius: 8 }} />
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t('cancel')}</Button>
        <Button onClick={handleSubmit(async (v) => { await onSubmit(v); onClose(); })} variant="contained" color="secondary" disabled={isSubmitting}>
          {initial?.title ? t('save') : t('create')}
        </Button>
      </DialogActions>
      <MediaPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(f) => setValue('imageFileId', f.id)} />
    </Dialog>
  );
}
