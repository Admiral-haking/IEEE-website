"use client";

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, FormControlLabel, Checkbox, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Editor from '@/components/Editor';
import { useTranslation } from 'react-i18next';
import MediaPickerDialog from '@/components/MediaPickerDialog';

const Schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  location: z.string().optional().default('Remote'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  descriptionHtml: z.string().optional().default(''),
  requirements: z.string().optional().default(''),
  applyLink: z.string().optional().default(''),
  imageFileId: z.string().optional(),
  published: z.boolean().optional().default(false)
});
type Values = z.infer<typeof Schema>;

export default function JobDialog({ open, onClose, initial, onSubmit }: { open: boolean; onClose: () => void; initial?: Partial<Values>; onSubmit: (values: any) => Promise<void> | void; }) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { title: '', slug: '', location: 'Remote', type: 'full-time', descriptionHtml: '', requirements: '', applyLink: '', imageFileId: '', published: false }
  });
  React.useEffect(() => { reset({ ...(initial as any) }); }, [initial, reset]);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const imageId = watch('imageFileId');
  const imageSrc = imageId ? `/api/media/${imageId}` : '';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initial?.title ? t('edit_job') : t('add_job')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField label={t('title_label')} {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
          <TextField label={t('slug_label')} {...register('slug')} error={!!errors.slug} helperText={errors.slug?.message} />
          <TextField label={t('location_label')} {...register('location')} />
          <TextField select label={t('type_label')} defaultValue={(initial as any)?.type || 'full-time'} {...register('type')}>
            <MenuItem value="full-time">Full-time</MenuItem>
            <MenuItem value="part-time">Part-time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
            <MenuItem value="internship">Internship</MenuItem>
          </TextField>
          <Editor value={watch('descriptionHtml')} onChange={(html) => setValue('descriptionHtml', html)} />
          <TextField multiline rows={4} label={t('requirements_label')} helperText={t('requirements_help')} {...register('requirements')} />
          <Box>
            <Button variant="outlined" size="small" onClick={() => setPickerOpen(true)}>{t('select_image')}</Button>
            {imageSrc && (
              <Box sx={{ mt: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="cover" style={{ maxWidth: '100%', borderRadius: 8 }} />
              </Box>
            )}
          </Box>
          <TextField label={t('apply_link_label')} {...register('applyLink')} />
          <FormControlLabel control={<Checkbox checked={watch('published')} onChange={(e) => setValue('published', e.target.checked)} />} label={t('published')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t('cancel')}</Button>
        <Button onClick={handleSubmit(async (v) => { const payload: any = { ...v, requirements: v.requirements ? v.requirements.split('\n').map((s) => s.trim()).filter(Boolean) : [] }; await onSubmit(payload); onClose(); })} variant="contained" color="secondary" disabled={isSubmitting}>{initial?.title ? t('save') : t('create')}</Button>
      </DialogActions>
      <MediaPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(f) => setValue('imageFileId', f.id)} />
    </Dialog>
  );
}
