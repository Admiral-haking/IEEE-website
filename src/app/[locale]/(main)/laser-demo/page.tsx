"use client";

import React from 'react';
import { Box, Container, Typography, Stack, Grid, Paper } from '@mui/material';
import LaserFlow from '@/components/LaserFlow';
import LaserFlowDemo from '@/components/LaserFlowDemo';

export default function LaserDemoPage() {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Header */}
          <Box textAlign="center">
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              Laser Flow Effects
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Advanced WebGL shader-based laser effects for modern web applications
            </Typography>
          </Box>

          {/* Basic Usage Example */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Basic Usage
            </Typography>
            <Box
              sx={{
                height: '400px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#060010',
                borderRadius: 2,
                border: '2px solid #7df9ff'
              }}
            >
              <LaserFlow
                horizontalBeamOffset={0.0}
                verticalBeamOffset={0.0}
                color="#7df9ff"
                intensity={0.6}
                speed={1.0}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  textAlign: 'center',
                  zIndex: 2
                }}
              >
                <Typography variant="h5" fontWeight={600}>
                  Basic Laser Flow
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Simple horizontal and vertical laser beams
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Interactive Demo */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Interactive Demo
            </Typography>
            <LaserFlowDemo />
          </Paper>

          {/* Different Color Variations */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Color Variations
            </Typography>
            <Grid container spacing={3}>
              {[
                { color: '#FF79C6', name: 'Pink', offset: 0.1 },
                { color: '#7df9ff', name: 'Cyan', offset: -0.1 },
                { color: '#4ecdc4', name: 'Teal', offset: 0.0 },
                { color: '#96ceb4', name: 'Mint', offset: 0.05 }
              ].map((variant, index) => (
                <Grid key={index} xs={12} sm={6}>
                  <Box
                    sx={{
                      height: '250px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#060010',
                      borderRadius: 2,
                      border: `2px solid ${variant.color}`
                    }}
                  >
                    <LaserFlow
                      horizontalBeamOffset={variant.offset}
                      verticalBeamOffset={0.0}
                      color={variant.color}
                      intensity={0.5}
                      speed={0.8}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        textAlign: 'center',
                        zIndex: 2
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {variant.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Usage Code Example */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Usage Example
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: '#1a1a1a',
                color: '#f8f8f2',
                p: 3,
                borderRadius: 2,
                overflow: 'auto',
                fontSize: '0.9rem',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace'
              }}
            >
{`import LaserFlow from './LaserFlow';

// Basic Usage
<div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
  <LaserFlow />
</div>

// With Custom Properties
<LaserFlow
  horizontalBeamOffset={0.1}
  verticalBeamOffset={0.0}
  color="#FF79C6"
  intensity={0.8}
  speed={1.2}
/>

// Interactive Reveal Effect
<div 
  style={{ 
    height: '800px', 
    position: 'relative', 
    overflow: 'hidden',
    backgroundColor: '#060010'
  }}
  onMouseMove={(e) => {
    // Handle mouse movement for reveal effect
  }}
>
  <LaserFlow
    horizontalBeamOffset={0.1}
    verticalBeamOffset={0.0}
    color="#FF79C6"
  />
  {/* Your content here */}
</div>`}
            </Box>
          </Paper>

          {/* Properties Documentation */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Component Properties
            </Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      horizontalBeamOffset
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Controls the vertical position of the horizontal laser beam (default: 0.0)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      verticalBeamOffset
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Controls the horizontal position of the vertical laser beam (default: 0.0)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      color
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hex color code for the laser beam (default: &quot;#FF79C6&quot;)
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      intensity
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Controls the brightness/intensity of the laser effect (default: 1.0)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      speed
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Animation speed multiplier (default: 1.0)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      className & style
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Standard React props for additional styling
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
