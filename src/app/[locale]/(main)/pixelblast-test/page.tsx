"use client";

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import PixelBlast from '@/components/PixelBlast';

export default function PixelBlastTest() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        PixelBlast Test
      </Typography>
      
      <Box sx={{ mb: 4, height: 300, position: 'relative', border: '2px solid #ccc' }}>
        <PixelBlast
          variant="circle"
          pixelSize={8}
          color="#ff0000"
          patternScale={2}
          patternDensity={0.8}
          pixelSizeJitter={0.3}
          enableRipples={false}
          liquid={false}
          speed={1}
          edgeFade={0.1}
          transparent={false}
        />
        <Typography sx={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white' }}>
          Red Circles - Density 0.8
        </Typography>
      </Box>

      <Box sx={{ mb: 4, height: 300, position: 'relative', border: '2px solid #ccc' }}>
        <PixelBlast
          variant="square"
          pixelSize={6}
          color="#00ff00"
          patternScale={3}
          patternDensity={0.6}
          pixelSizeJitter={0.5}
          enableRipples={false}
          liquid={false}
          speed={0.8}
          edgeFade={0.1}
          transparent={false}
        />
        <Typography sx={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white' }}>
          Green Squares - Density 0.6
        </Typography>
      </Box>

      <Box sx={{ mb: 4, height: 300, position: 'relative', border: '2px solid #ccc' }}>
        <PixelBlast
          variant="circle"
          pixelSize={4}
          color="#0000ff"
          patternScale={2.5}
          patternDensity={0.4}
          pixelSizeJitter={0.2}
          enableRipples={true}
          liquid={true}
          speed={0.6}
          edgeFade={0.1}
          transparent={false}
        />
        <Typography sx={{ position: 'absolute', top: 10, left: 10, zIndex: 10, color: 'white' }}>
          Blue Circles with Effects - Density 0.4
        </Typography>
      </Box>
    </Container>
  );
}
