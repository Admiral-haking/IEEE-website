"use client";

import React from 'react';
import { Box, Card, CardContent, Container, Grid, Skeleton, Stack } from '@mui/material';

export default function HomeLoading() {
  return (
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      <Stack gap={4}>
        <Box>
          <Skeleton variant="rounded" height={56} sx={{ mb: 1, maxWidth: 360 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: 480 }} />
        </Box>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                <Skeleton variant="rounded" height={160} />
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                  <Skeleton variant="text" sx={{ fontSize: '0.9rem', width: '80%' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}


