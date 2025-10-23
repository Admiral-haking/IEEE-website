"use client";

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxios from 'axios-hooks';
import { 
  Alert, 
  Box, 
  Button, 
  Stack, 
  TextField, 
  InputAdornment, 
  IconButton, 
  FormControlLabel, 
  Checkbox, 
  Typography,
  CircularProgress,
  Divider,
  Link,
  Paper
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import type { Route } from 'next';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// Enhanced schema with MFA support
const LoginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().transform((email) => email.trim()),
  password: z.string().min(1, 'Password is required').max(128, 'Password too long'),
  mfaToken: z.string().optional(),
  rememberMe: z.boolean().optional()
});

type LoginValues = z.infer<typeof LoginSchema>;

interface LoginResponse {
  success: boolean;
  user?: any;
  mfaRequired?: boolean;
  message?: string;
  error?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  const [showPassword, setShowPassword] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { 
      email: '', 
      password: '', 
      mfaToken: '',
      rememberMe: false 
    }
  });

  const [{ error: axiosError }, exec] = useAxios<LoginResponse>({ 
    url: '/api/auth/login', 
    method: 'POST' 
  }, { manual: true });

  // Watch form values for dynamic behavior
  const watchedValues = watch();

  // Handle form submission with enhanced error handling
  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await exec({ 
        data: {
          email: values.email,
          password: values.password,
          mfaToken: values.mfaToken || undefined,
          rememberMe: values.rememberMe
        }
      });

      if (response.data?.mfaRequired) {
        setMfaRequired(true);
        setError(null);
        return;
      }

      if (response.data?.success) {
        setSuccess(true);
        // Redirect after successful login
        setTimeout(() => {
          const href = (`/${locale}/admin`) as Route;
          router.push(href);
        }, 1000);
      } else {
        setError(response.data?.error || t('login_failed'));
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || t('login_failed');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle MFA token submission
  const handleMFASubmit = async () => {
    if (!watchedValues.mfaToken) {
      setError(t('mfa_token_required'));
      return;
    }
    await onSubmit(watchedValues);
  };

  // Reset MFA state when email/password changes
  useEffect(() => {
    if (mfaRequired && (watchedValues.email || watchedValues.password)) {
      setMfaRequired(false);
      setValue('mfaToken', '');
    }
  }, [watchedValues.email, watchedValues.password, mfaRequired, setValue]);

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={3}>
          {/* Header */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" component="h1" gutterBottom>
              {t('sign_in')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('welcome_back')}
            </Typography>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success">
              {t('login_successful')}
            </Alert>
          )}

          {/* MFA Required Message */}
          {mfaRequired && (
            <Alert severity="info" icon={<SecurityIcon />}>
              {t('mfa_required_message')}
            </Alert>
          )}

          {/* Email Field */}
          <TextField
            label={t('email_label')}
            type="email"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={mfaRequired || isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            InputLabelProps={isRtl ? { 
              sx: { left: 'auto', right: 14, transformOrigin: 'right top', textAlign: 'right' } 
            } : undefined}
            fullWidth
          />

          {/* Password Field */}
          <TextField
            label={t('password_label')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={mfaRequired || isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    aria-label="toggle password visibility" 
                    onClick={() => setShowPassword((v) => !v)} 
                    edge="end" 
                    size="small"
                    disabled={mfaRequired || isSubmitting}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            InputLabelProps={isRtl ? { 
              sx: { left: 'auto', right: 14, transformOrigin: 'right top', textAlign: 'right' } 
            } : undefined}
            fullWidth
          />

          {/* MFA Token Field */}
          {mfaRequired && (
            <TextField
              label={t('mfa_token_label')}
              type="text"
              autoComplete="one-time-code"
              {...register('mfaToken')}
              error={!!errors.mfaToken}
              helperText={errors.mfaToken?.message || t('mfa_token_help')}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SecurityIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              InputLabelProps={isRtl ? { 
                sx: { left: 'auto', right: 14, transformOrigin: 'right top', textAlign: 'right' } 
              } : undefined}
              fullWidth
              autoFocus
            />
          )}

          {/* Remember Me Checkbox */}
          {!mfaRequired && (
            <FormControlLabel 
              control={
                <Checkbox 
                  size="small" 
                  {...register('rememberMe')}
                  disabled={isSubmitting}
                />
              } 
              label={<Typography variant="body2">{t('remember_me')}</Typography>} 
            />
          )}

          {/* Submit Button */}
          <Button 
            type={mfaRequired ? "button" : "submit"}
            onClick={mfaRequired ? handleMFASubmit : undefined}
            variant="contained" 
            color="primary" 
            disabled={isSubmitting || (mfaRequired && !watchedValues.mfaToken)}
            sx={{ py: 1.5, position: 'relative' }}
            fullWidth
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              mfaRequired ? t('verify_mfa') : t('sign_in')
            )}
          </Button>

          {/* Divider */}
          <Divider>
            <Typography variant="body2" color="text.secondary">
              {t('or')}
            </Typography>
          </Divider>

          {/* Sign Up Link */}
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t('no_account')}{' '}
            <Link 
              component="button" 
              type="button"
              variant="body2"
              onClick={() => router.push(`/${locale}/signup` as Route)}
              disabled={isSubmitting}
              sx={{ textDecoration: 'none' }}
            >
              {t('create_one')}
            </Link>
          </Typography>

          {/* Forgot Password Link */}
          <Typography variant="body2" color="text.secondary" textAlign="center">
            <Link 
              component="button" 
              type="button"
              variant="body2"
              onClick={() => router.push(`/${locale}/forgot-password` as Route)}
              disabled={isSubmitting}
              sx={{ textDecoration: 'none' }}
            >
              {t('forgot_password')}
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
