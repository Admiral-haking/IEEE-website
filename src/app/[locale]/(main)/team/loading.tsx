import React from 'react';
import { Container, Grid, Skeleton, Stack } from '@mui/material';

export default function LoadingTeam() {
  return (
    <Container sx={{ py: 6 }}>
      <Stack gap={2} sx={{ mb: 3 }}>
        <Skeleton variant="text" width={220} height={38} />
        <Skeleton variant="text" width={320} />
      </Stack>
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

