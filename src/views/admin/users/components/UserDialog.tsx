"use client";

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['member', 'user', 'admin']),
  password: z.string().min(8).optional()
});

type Values = z.infer<typeof Schema>;

export default function UserDialog({
  open,
  onClose,
  initial,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Values>;
  onSubmit: (values: Values) => Promise<void> | void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { name: '', email: '', role: 'user', password: '' }
  });

  React.useEffect(() => { reset({ name: initial?.name || '', email: initial?.email || '', role: (initial?.role as any) || 'user', password: '' }); }, [initial, reset]);
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial?.email ? t('edit_user') : t('add_user')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} mt={1}>
          <TextField label={t('name_label')} {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
          <TextField label={t('email_label')} type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField select label={t('role_label')} defaultValue={initial?.role || 'user'} {...register('role')} error={!!errors.role} helperText={errors.role?.message} >
            <MenuItem value="member">{t('user_role_member') || 'Member'}</MenuItem>
            <MenuItem value="user">{t('user_role_user')}</MenuItem>
            <MenuItem value="admin">{t('user_role_admin')}</MenuItem>
          </TextField>
          <TextField label={t('password_label')} type="password" {...register('password')} error={!!errors.password} helperText={initial?.email ? t('leave_blank_password') : (errors.password?.message as any)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>{t('cancel')}</Button>
        <Button onClick={handleSubmit(async (v) => { await onSubmit(v); onClose(); })} variant="contained" color="secondary" disabled={isSubmitting}>
          {initial?.email ? t('save') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
