import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import FuzzyText from '@/components/FuzzyText';

export default function NotFound() {
  return (
    <Container sx={{ py: 10 }}>
      <Stack gap={2} textAlign="center" alignItems="center">
        <FuzzyText 
          baseIntensity={0.2} 
          hoverIntensity={0.5} 
          enableHover={true}
          variant="h3"
          sx={{ fontWeight: 800 }}
        >
          404 — Page not found
        </FuzzyText>
        <Typography color="text.secondary">The page you’re looking for doesn’t exist.</Typography>
        <Box>
          <Button component={NextLink} href="/en" sx={{ mr: 1 }} variant="contained" color="secondary">Go to English Home</Button>
          <Button component={NextLink} href="/fa" variant="outlined">رفتن به صفحه اصلی فارسی</Button>
        </Box>
      </Stack>
    </Container>
  );
}

