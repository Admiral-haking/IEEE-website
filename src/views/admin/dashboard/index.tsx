import React from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

export default function AdminDashboardView() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        {["Services", "Requests", "Latency", "Errors"].map((k) => (
          <Grid key={k} xs={12} md={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack>
                <Typography variant="body2" color="text.secondary">{k}</Typography>
                <Typography variant="h6" fontWeight={700}>—</Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
