import React from 'react';
import { Container, Skeleton, Stack } from '@mui/material';

export default function LoadingPost() {
  return (
    <Container sx={{ py: 6 }}>
      <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2, mb: 2 }} />
      <Stack gap={1.5}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="text" />
        ))}
      </Stack>
    </Container>
  );
}

