import React from 'react';
import { Container, Skeleton, Stack } from '@mui/material';

export default function LoadingPrivacy() {
  return (
    <Container sx={{ py: 6 }}>
      <Skeleton variant="text" width={240} height={38} />
      <Stack gap={1.2} sx={{ mt: 2 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} variant="text" />
        ))}
      </Stack>
    </Container>
  );
}

