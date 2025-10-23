"use client";

import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import FuzzyText from '@/components/FuzzyText';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container sx={{ py: 10 }}>
      <Stack gap={2} textAlign="center" alignItems="center">
        <FuzzyText 
          baseIntensity={0.15} 
          hoverIntensity={0.4} 
          enableHover={true}
          variant="h3"
          sx={{ fontWeight: 800 }}
        >
          Something went wrong
        </FuzzyText>
        <Typography color="text.secondary">An unexpected error occurred. Please try again.</Typography>
        <Box>
          <Button onClick={() => reset()} variant="contained" color="secondary">Retry</Button>
        </Box>
        {process.env.NODE_ENV !== 'production' && (
          <Typography variant="caption" color="text.secondary">{String(error?.message)}</Typography>
        )}
      </Stack>
    </Container>
  );
}

