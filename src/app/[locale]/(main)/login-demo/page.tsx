"use client";

import React from 'react';
import { Box, Container, Typography, Stack, Paper } from '@mui/material';
import LoginFormStyled from '@/components/LoginFormStyled';

export default function LoginDemoPage() {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log('Login data:', data);
    // Handle login logic here
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center">
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Login Demo
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400
              }}
            >
              Modern styled login form
            </Typography>
          </Paper>

          {/* Login Form */}
          <LoginFormStyled onSubmit={handleLogin} />
        </Stack>
      </Container>
    </Box>
  );
}
