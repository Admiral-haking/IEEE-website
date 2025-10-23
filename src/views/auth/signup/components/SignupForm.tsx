"use client";

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from 'axios-hooks';
import { Alert, Box, Button, Stack, TextField, InputAdornment, IconButton, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { Route } from 'next';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  confirm: z.string().min(8)
}).refine((d) => d.password === d.confirm, { message: 'Passwords must match', path: ['confirm'] });

type Values = z.infer<typeof Schema>;

export default function SignupForm() {
  const router = useRouter();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' }
  });

  const [{ error }, exec] = useAxios({ url: '/api/auth/register', method: 'POST' }, { manual: true });

  const onSubmit = async (values: Values) => {
    await exec({ data: { name: values.name, email: values.email, password: values.password } });
    const href = (`/${locale}/admin`) as Route;
    router.push(href);
  };

  const labelProps = isRtl ? { sx: { left: 'auto', right: 14, transformOrigin: 'right top', textAlign: 'right' } } : undefined;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2.5}>
        {error && <Alert severity="error">{String((error as any)?.response?.data?.error || t('signup_failed'))}</Alert>}

        <TextField
          label={t('full_name')}
          autoComplete="name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          InputLabelProps={labelProps}
        />

        <TextField
          label={t('email_label')}
          type="email"
          autoComplete="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          InputLabelProps={labelProps}
        />

        <TextField
          label={t('password_label')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          InputLabelProps={labelProps}
        />

        <TextField
          label={t('confirm_password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          {...register('confirm')}
          error={!!errors.confirm}
          helperText={errors.confirm?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          InputLabelProps={labelProps}
        />

        <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting} sx={{ py: 1.2 }}>
          {t('sign_up')}
        </Button>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          {t('have_account')} <Button size="small" variant="text" href={`/${locale}/auth/signin` as Route}>{t('sign_in')}</Button>
        </Typography>
      </Stack>
    </Box>
  );
}

