"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Storage as Database,
  CheckCircle,
  Error,
  Warning,
  Refresh,
  Settings,
  Storage,
  Speed,
  Security
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAxiosWithCancel } from '@/hooks/useAxiosWithCancel';

interface DatabaseHealth {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  connection: {
    readyState: number;
    host: string;
    port: string;
    name: string;
  };
  collections: {
    count: number;
    documents: Record<string, number>;
    totalDocuments: number;
  };
  indexes: {
    users: number;
    blogPosts: number;
    solutions: number;
  };
  environment: {
    nodeEnv: string;
    hasMongoUri: boolean;
  };
  error?: {
    message: string;
    type: string;
  };
}

export default function DatabaseAdminView() {
  const { t } = useTranslation();
  const [healthData, setHealthData] = useState<DatabaseHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [initDialogOpen, setInitDialogOpen] = useState(false);
  const [initResult, setInitResult] = useState<any>(null);

  const [{ data: healthResponse, loading: healthLoading, error: healthError }, refetchHealth] = useAxiosWithCancel({
    url: '/api/database/health'
  });

  useEffect(() => {
    if (healthResponse) {
      setHealthData(healthResponse);
    }
  }, [healthResponse]);

  const handleInitializeDatabase = async () => {
    setInitLoading(true);
    try {
      const response = await fetch('/api/database/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      setInitResult(result);
      
      if (result.success) {
        // Refresh health data after successful initialization
        await refetchHealth();
      }
    } catch (error) {
      console.error('Database initialization failed:', error);
      setInitResult({
        success: false,
        error: 'Failed to initialize database'
      });
    } finally {
      setInitLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'unhealthy': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle />;
      case 'unhealthy': return <Error />;
      default: return <Warning />;
    }
  };

  const getConnectionState = (readyState: number) => {
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };
    return states[readyState as keyof typeof states] || 'Unknown';
  };

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Database Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage your database connection, health, and initialization
          </Typography>
        </Box>

        {/* Health Status Card */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Database color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Database Health
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={() => refetchHealth()}
                disabled={healthLoading}
              >
                Refresh
              </Button>
            </Stack>

            {healthLoading && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            )}

            {healthError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to fetch database health: {String(healthError)}
              </Alert>
            )}

            {healthData && (
              <Grid container spacing={3}>
                {/* Status */}
                <Grid xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        icon={getStatusIcon(healthData.status)}
                        label={healthData.status.toUpperCase()}
                        color={getStatusColor(healthData.status)}
                        variant="filled"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Connection State
                      </Typography>
                      <Typography variant="body1">
                        {getConnectionState(healthData.connection.readyState)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Database
                      </Typography>
                      <Typography variant="body1">
                        {healthData.connection.name} @ {healthData.connection.host}:{healthData.connection.port}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                {/* Collections */}
                <Grid xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Collections & Documents
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Storage fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Total Collections"
                          secondary={healthData.collections.count}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Speed fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Total Documents"
                          secondary={healthData.collections.totalDocuments.toLocaleString()}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>

                {/* Document Counts */}
                <Grid xs={12}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Document Counts by Collection
                    </Typography>
                    <Grid container spacing={1}>
                      {Object.entries(healthData.collections.documents).map(([collection, count]) => (
                        <Grid key={collection} xs={6} sm={4} md={3}>
                          <Chip
                            label={`${collection}: ${count}`}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>

                {/* Indexes */}
                <Grid xs={12}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Indexes
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<Security />}
                        label={`Users: ${healthData.indexes.users}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label={`Blog Posts: ${healthData.indexes.blogPosts}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label={`Solutions: ${healthData.indexes.solutions}`}
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Box>
                </Grid>

                {/* Environment */}
                <Grid xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Environment
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Chip
                        label={`Node: ${healthData.environment.nodeEnv}`}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={`MongoDB URI: ${healthData.environment.hasMongoUri ? 'Configured' : 'Missing'}`}
                        color={healthData.environment.hasMongoUri ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Database Actions */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Settings color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Database Actions
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Database />}
                onClick={() => setInitDialogOpen(true)}
                disabled={initLoading}
              >
                Initialize Database
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => refetchHealth()}
                disabled={healthLoading}
              >
                Refresh Health
              </Button>
            </Stack>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Initialize Database:</strong> Creates indexes, collections, and sample data.
                This action requires admin privileges and should only be run once during initial setup.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Initialization Dialog */}
        <Dialog
          open={initDialogOpen}
          onClose={() => setInitDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Initialize Database</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              This will initialize your database with:
            </DialogContentText>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Security fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Database indexes for performance" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Storage fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sample data and admin user" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Collection structure setup" />
              </ListItem>
            </List>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Warning:</strong> This action will create an admin user with email &quot;admin@hippogriff.com&quot; 
                and password &quot;admin123&quot;. Please change these credentials after initialization.
              </Typography>
            </Alert>

            {initResult && (
              <Box sx={{ mt: 2 }}>
                {initResult.success ? (
                  <Alert severity="success">
                    <Typography variant="body2">
                      Database initialized successfully! Created {initResult.counts?.users || 0} users, 
                      {initResult.counts?.solutions || 0} solutions, and {initResult.counts?.blogPosts || 0} blog posts.
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error">
                    <Typography variant="body2">
                      Initialization failed: {initResult.error}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInitDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInitializeDatabase}
              variant="contained"
              disabled={initLoading}
              startIcon={initLoading ? <CircularProgress size={16} /> : <Database />}
            >
              {initLoading ? 'Initializing...' : 'Initialize'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
