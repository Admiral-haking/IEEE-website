"use client";

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface LoginFormStyledProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string;
  success?: string;
}

export default function LoginFormStyled({ 
  onSubmit, 
  loading = false, 
  error, 
  success 
}: LoginFormStyledProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('password_required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('password_min_length');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        maxWidth: 300,
        mx: 'auto',
        p: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 1 }}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 1 }}>
          {success}
        </Alert>
      )}

      {/* Email Field */}
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            mb: 0.5,
            alignSelf: 'flex-start'
          }}
        >
          {t('email_label')}
        </Typography>
        <TextField
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(156, 156, 156, 0.1)',
              '& fieldset': {
                borderColor: 'rgba(112, 112, 112, 0.3)',
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: 'rgba(112, 112, 112, 0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            },
            '& .MuiInputBase-input': {
              py: 1.5,
              px: 1
            }
          }}
        />
      </Box>

      {/* Password Field */}
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            mb: 0.5,
            alignSelf: 'flex-start'
          }}
        >
          {t('password_label')}
        </Typography>
        <TextField
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          variant="outlined"
          placeholder="Enter your password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(156, 156, 156, 0.1)',
              '& fieldset': {
                borderColor: 'rgba(112, 112, 112, 0.3)',
                borderWidth: 2
              },
              '&:hover fieldset': {
                borderColor: 'rgba(112, 112, 112, 0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            },
            '& .MuiInputBase-input': {
              py: 1.5,
              px: 1
            }
          }}
        />
      </Box>

      {/* Forgot Password Link */}
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Link
          href="#"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            fontSize: '0.875rem',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'underline'
            }
          }}
        >
          {t('forgot_password')}
        </Link>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : <Login />}
        sx={{
          py: 1.5,
          borderRadius: 6,
          backgroundColor: 'rgba(112, 112, 112, 0.9)',
          color: '#efefef',
          fontWeight: 600,
          fontSize: '0.9rem',
          textTransform: 'none',
          transition: 'all 300ms ease',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'rgba(112, 112, 112, 0.9)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          },
          '&:disabled': {
            backgroundColor: 'rgba(163, 32, 32, 0.5)',
            color: 'rgba(239, 239, 239, 0.5)'
          }
        }}
      >
        {loading ? t('logging_in') : t('sign_in')}
      </Button>

      {/* Sign Up Link */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
          mt: 1
        }}
      >
        {t('no_account')}{' '}
        <Link
          href="#"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {t('create_one')}
        </Link>
      </Typography>
    </Box>
  );
}
