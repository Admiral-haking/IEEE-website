"use client";

import { useAxiosWithCancel } from '@/hooks/useAxiosWithCancel';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HealthCheck() {
  const { t } = useTranslation();
  const [{ data, loading, error }, refetch] = useAxiosWithCancel({ url: '/api/health' });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>{t('api_health')}</Typography>
      {loading && <CircularProgress size={20} />}
      {error && <Alert severity="error">{String(error)}</Alert>}
      {data && (
        <Stack gap={0.5}>
          <Typography variant="body2">{t('status')}: {data.status}</Typography>
          <Typography variant="body2">{t('service')}: {data.service}</Typography>
          <Typography variant="body2">{t('time')}: {data.time}</Typography>
        </Stack>
      )}
      <Button onClick={() => refetch()} sx={{ mt: 1 }} variant="outlined" size="small">{t('refresh')}</Button>
    </Box>
  );
}
