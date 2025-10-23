"use client";

import React from 'react';
import { Box, Container, Stack, Typography, Paper } from '@mui/material';
import LoginForm from './components/LoginForm';

export default function SigninView() {
  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: (theme: any) => theme.palette.mode === 'dark'
        ? 'radial-gradient(800px 400px at 10% -10%, rgba(82,168,255,0.12), transparent 60%), radial-gradient(800px 400px at 90% 0%, rgba(126,87,194,0.1), transparent 60%)'
        : 'linear-gradient(135deg, #eef2f7 0%, #f8fbff 100%)',
      p: { xs: 3, md: 6 }
    }}>
      <Container maxWidth="sm">
        <Stack gap={3} alignItems="center" textAlign="center" sx={{ mb: 2 }}>
          <Typography variant="overline" color="primary" fontWeight={600}>
            Welcome back
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            Sign in to your account
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            Access the admin panel, manage content and explore analytics.
          </Typography>
        </Stack>
        <Paper elevation={8} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, backdropFilter: 'blur(6px)' }}>
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
}

