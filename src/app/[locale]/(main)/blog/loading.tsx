import React from 'react';
import { Container, Grid, Skeleton, Stack } from '@mui/material';

export default function LoadingBlogList() {
  return (
    <Container sx={{ py: 6 }}>
      <Stack gap={2} sx={{ mb: 3 }}>
        <Skeleton variant="text" width={220} height={38} />
        <Skeleton variant="text" width={320} />
      </Stack>

      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} item xs={12} md={4}>
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
