"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Grid, Paper, Slider, Button, Alert } from '@mui/material';
import Lanyard from '@/components/Lanyard';

export default function LanyardDemoPage() {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 20]);
  const [gravity, setGravity] = useState<[number, number, number]>([0, -40, 0]);

  const handlePositionChange = (axis: number, value: number) => {
    const newPosition = [...position] as [number, number, number];
    newPosition[axis] = value;
    setPosition(newPosition);
  };

  const handleGravityChange = (axis: number, value: number) => {
    const newGravity = [...gravity] as [number, number, number];
    newGravity[axis] = value;
    setGravity(newGravity);
  };

  const resetToDefaults = () => {
    setPosition([0, 0, 20]);
    setGravity([0, -40, 0]);
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Header */}
          <Box textAlign="center">
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              3D Lanyard Physics
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Interactive 3D physics simulation with realistic lanyard movement
            </Typography>
          </Box>

          {/* Setup Alert */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Setup Required:</strong> To see the full effect, you need to:
              <br />
              1. Install Three.js dependencies: <code>npm install @react-three/fiber @react-three/drei @react-three/cannon three</code>
              <br />
              2. Add the card.glb and lanyard.png files to <code>public/assets/lanyard/</code>
              <br />
              3. Download assets from the original ReactBits repository
            </Typography>
          </Alert>

          {/* Main Demo */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Interactive 3D Lanyard
            </Typography>
            
            <Box
              sx={{
                height: '600px',
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid #e0e0e0',
                mb: 3
              }}
            >
              <Lanyard
                position={position}
                gravity={gravity}
                style={{ height: '100%' }}
              />
            </Box>

            {/* Controls */}
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Camera Position
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      X Position: {position[0]}
                    </Typography>
                    <Slider
                      value={position[0]}
                      onChange={(_: any, value: any) => handlePositionChange(0, value as number)}
                      min={-20}
                      max={20}
                      step={1}
                      marks
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Y Position: {position[1]}
                    </Typography>
                    <Slider
                      value={position[1]}
                      onChange={(_: any, value: any) => handlePositionChange(1, value as number)}
                      min={-20}
                      max={20}
                      step={1}
                      marks
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Z Position: {position[2]}
                    </Typography>
                    <Slider
                      value={position[2]}
                      onChange={(_: any, value: any) => handlePositionChange(2, value as number)}
                      min={5}
                      max={50}
                      step={1}
                      marks
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Physics Gravity
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      X Gravity: {gravity[0]}
                    </Typography>
                    <Slider
                      value={gravity[0]}
                      onChange={(_: any, value: any) => handleGravityChange(0, value as number)}
                      min={-100}
                      max={100}
                      step={5}
                      marks
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Y Gravity: {gravity[1]}
                    </Typography>
                    <Slider
                      value={gravity[1]}
                      onChange={(_: any, value: any) => handleGravityChange(1, value as number)}
                      min={-100}
                      max={100}
                      step={5}
                      marks
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Z Gravity: {gravity[2]}
                    </Typography>
                    <Slider
                      value={gravity[2]}
                      onChange={(_: any, value: any) => handleGravityChange(2, value as number)}
                      min={-100}
                      max={100}
                      step={5}
                      marks
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={resetToDefaults}
                sx={{ mr: 2 }}
              >
                Reset to Defaults
              </Button>
            </Box>
          </Paper>

          {/* Usage Examples */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Usage Examples
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Basic Usage
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: '#1a1a1a',
                      color: '#f8f8f2',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      overflow: 'auto'
                    }}
                  >
{`import Lanyard from './Lanyard';

<Lanyard 
  position={[0, 0, 20]} 
  gravity={[0, -40, 0]} 
/>`}
                  </Box>
                </Box>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Advanced Configuration
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: '#1a1a1a',
                      color: '#f8f8f2',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      overflow: 'auto'
                    }}
                  >
{`<Lanyard
  position={[10, 5, 30]}
  gravity={[5, -50, 0]}
  style={{ 
    height: '500px',
    borderRadius: '12px'
  }}
/>`}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Features */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Features
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'primary.main' }}>
                    Realistic Physics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uses Cannon.js for accurate physics simulation with gravity, friction, and collision detection.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'primary.main' }}>
                    3D Graphics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Built with Three.js and React Three Fiber for smooth 3D rendering and animations.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'primary.main' }}>
                    Interactive Controls
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orbit controls for camera movement and configurable physics parameters.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Setup Instructions */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Setup Instructions
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  1. Install Dependencies
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: '#f8f8f2',
                    p: 2,
                    borderRadius: 1,
                    fontSize: '0.9rem',
                    overflow: 'auto'
                  }}
                >
{`npm install @react-three/fiber @react-three/drei @react-three/cannon three`}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  2. Add Assets
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Download the following files from the original ReactBits repository:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: '#f8f8f2',
                    p: 2,
                    borderRadius: 1,
                    fontSize: '0.9rem',
                    overflow: 'auto'
                  }}
                >
{`public/assets/lanyard/
├── card.glb          # 3D card model
└── lanyard.png       # Lanyard texture`}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  3. Type Declarations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  The component includes TypeScript declarations for GLB and PNG files.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
