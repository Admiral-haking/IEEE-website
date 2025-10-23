"use client";

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, FormControlLabel, Checkbox, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Editor from '@/components/Editor';
import { useTranslation } from 'react-i18next';
import MediaPickerDialog from '@/components/MediaPickerDialog';

const Schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  client: z.string().optional().default(''),
  industry: z.string().optional().default(''),
  date: z.string().optional().default(''),
  coverFileId: z.string().optional(),
  published: z.boolean().optional().default(false)
});
type Values = z.infer<typeof Schema>;

export default function CaseDialog({ open, onClose, initial, onSubmit }: { open: boolean; onClose: () => void; initial?: Partial<Values>; onSubmit: (values: Values) => Promise<void> | void; }) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { title: '', slug: '', summary: '', contentHtml: '', client: '', industry: '', date: '', coverFileId: '', published: false }
  });
  React.useEffect(() => { reset({ ...(initial as any) }); }, [initial, reset]);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const coverId = watch('coverFileId');
  const coverSrc = coverId ? `/api/media/${coverId}` : '';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initial?.title ? t('edit_case') : t('add_case')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField label={t('title_label')} {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
          <TextField label={t('slug_label')} {...register('slug')} error={!!errors.slug} helperText={errors.slug?.message} />
          <TextField label={t('summary_label')} {...register('summary')} />
          <TextField label={t('client_label')} {...register('client')} />
          <TextField label={t('industry_label')} {...register('industry')} />
          <TextField label={t('date_label')} type="date" {...register('date')} InputLabelProps={{ shrink: true }} />
          <Editor value={watch('contentHtml')} onChange={(html) => setValue('contentHtml', html)} />
          <Box>
            <Button variant="outlined" size="small" onClick={() => setPickerOpen(true)}>{t('select_image')}</Button>
            {coverSrc && (
              <Box sx={{ mt: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverSrc} alt="cover" style={{ maxWidth: '100%', borderRadius: 8 }} />
              </Box>
            )}
          </Box>
          <FormControlLabel control={<Checkbox checked={watch('published')} onChange={(e) => setValue('published', e.target.checked)} />} label={t('published')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t('cancel')}</Button>
        <Button onClick={handleSubmit(async (v) => { await onSubmit(v); onClose(); })} variant="contained" color="secondary" disabled={isSubmitting}>{initial?.title ? t('save') : t('create')}</Button>
      </DialogActions>
      <MediaPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(f) => setValue('coverFileId', f.id)} />
    </Dialog>
  );
}
