import React from 'react';
import { Container, Skeleton, Stack, Grid } from '@mui/material';

export default function LoadingMember() {
  return (
    <Container sx={{ py: 6 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Skeleton variant="circular" width={96} height={96} />
          <Skeleton variant="text" width={180} />
          <Skeleton variant="text" width={140} />
        </Grid>
        <Grid xs={12} md={8}>
          <Stack gap={1.2}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="text" />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

