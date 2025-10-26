"use client";

import React from 'react';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function StatsBand({ stats }: { stats: { value: number | string; label: string }[] }) {
  return (
    <Paper variant="outlined" sx={{ 
      borderRadius: { xs: 2, md: 4 }, 
      p: { xs: 2, md: 4 }, 
      mb: { xs: 4, md: 8 }, 
      backgroundImage: 'linear-gradient(135deg, rgba(25,118,210,0.08), rgba(156,39,176,0.06))',
      border: '1px solid',
      borderColor: (t) => alpha(t.palette.primary.main, 0.2)
    }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {stats.map((s, i) => (
          <Grid item key={i} xs={6} md={3}>
            <Stack alignItems="center" textAlign="center" spacing={1}>
              <Typography 
                variant="h2" 
                fontWeight={800} 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  color: '#1e3a8a',
                  backgroundImage: 'linear-gradient(45deg, #1976d2, #9c27b0)', 
                  backgroundSize: '200% 200%',
                  textShadow: '0 0 10px rgba(25, 118, 210, 0.25)',
                  '@supports (-webkit-background-clip: text)': {
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent'
                  },
                  '@supports (background-clip: text)': {
                    backgroundClip: 'text',
                    color: 'transparent'
                  }
                }}
              >
                {s.value}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                fontWeight={500}
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
              >
                {s.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
