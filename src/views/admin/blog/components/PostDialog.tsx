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
  excerpt: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  coverFileId: z.string().optional(),
  tags: z.string().optional().default(''),
  published: z.boolean().optional().default(false)
});
type Values = z.infer<typeof Schema>;

export default function PostDialog({ open, onClose, initial, onSubmit }: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Values>;
  onSubmit: (values: Values) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { title: '', slug: '', excerpt: '', contentHtml: '', coverFileId: '', tags: '', published: false }
  });
  React.useEffect(() => { reset({ title: initial?.title || '', slug: initial?.slug || '', excerpt: (initial as any)?.excerpt || '', contentHtml: (initial as any)?.contentHtml || '', tags: Array.isArray((initial as any)?.tags) ? ((initial as any).tags as string[]).join(', ') : ((initial as any)?.tags || ''), published: !!(initial as any)?.published }); }, [initial, reset]);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const coverId = watch('coverFileId');
  const coverSrc = coverId ? `/api/media/${coverId}` : '';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initial?.title ? t('edit_post') : t('add_post')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField label={t('title_label')} {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
          <TextField label={t('slug_label')} {...register('slug')} error={!!errors.slug} helperText={errors.slug?.message} />
          <TextField label={t('excerpt_label')} {...register('excerpt')} />
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
          <TextField label={t('tags_label')} helperText={t('tags_help')} {...register('tags')} />
          <FormControlLabel control={<Checkbox checked={watch('published')} onChange={(e) => setValue('published', e.target.checked)} />} label={t('published')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t('cancel')}</Button>
        <Button onClick={handleSubmit(async (v) => { const payload: any = { ...v, tags: v.tags ? v.tags.split(',').map((s) => s.trim()).filter(Boolean) : [] }; await onSubmit(payload); onClose(); })} variant="contained" color="secondary" disabled={isSubmitting}>{initial?.title ? t('save') : t('create')}</Button>
      </DialogActions>
      <MediaPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(f) => setValue('coverFileId', f.id)} />
    </Dialog>
  );
}
