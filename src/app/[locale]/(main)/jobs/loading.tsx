import React from 'react';
import { Container, Skeleton, Stack, Grid } from '@mui/material';

export default function LoadingJobs() {
  return (
    <Container sx={{ py: 6 }}>
      <Stack gap={2} sx={{ mb: 3 }}>
        <Skeleton variant="text" width={220} height={38} />
        <Skeleton variant="text" width={320} />
      </Stack>
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} xs={12} md={6}>
            <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

