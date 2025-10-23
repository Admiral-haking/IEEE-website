"use client";

import React from 'react';
import { Box, Container, Typography, Stack, Paper, Button, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import GradualBlur from '@/components/GradualBlur';
import ClickSpark from '@/components/ClickSpark';
import CardNav from '@/components/CardNav';

export default function ReactBitsDemoPage() {
  const cardNavItems = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company", onClick: () => console.log("Company clicked") },
        { label: "Careers", ariaLabel: "About Careers", onClick: () => console.log("Careers clicked") }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects", onClick: () => console.log("Featured clicked") },
        { label: "Case Studies", ariaLabel: "Project Case Studies", onClick: () => console.log("Case Studies clicked") }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us", onClick: () => console.log("Email clicked") },
        { label: "Twitter", ariaLabel: "Twitter", onClick: () => console.log("Twitter clicked") },
        { label: "LinkedIn", ariaLabel: "LinkedIn", onClick: () => console.log("LinkedIn clicked") }
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={6}>
          {/* Header */}
          <Box textAlign="center">
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2 }}>
              ReactBits Components
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Modern React components for enhanced user interactions and visual effects
            </Typography>
          </Box>

          {/* GradualBlur Demo */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              GradualBlur Component
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Creates smooth blur effects that gradually fade content at the edges
            </Typography>
            
            <Box
              sx={{
                position: 'relative',
                height: 400,
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                border: '2px solid #e0e0e0'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  overflowY: 'auto',
                  padding: '2rem',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white'
                }}
              >
                <Stack spacing={2}>
                  {Array.from({ length: 20 }, (_, i) => (
                    <Typography key={i} variant="body1">
                      This is content item {i + 1}. The GradualBlur component will create a smooth
                      blur effect at the bottom of this container, making the content gradually
                      fade out as it approaches the edge.
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <GradualBlur
                target="parent"
                position="bottom"
                height="6rem"
                strength={2}
                divCount={5}
                curve="bezier"
                exponential={true}
                opacity={1}
              />
            </Box>
          </Paper>

          {/* ClickSpark Demo */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              ClickSpark Component
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Interactive click effects that create spark animations on click
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <ClickSpark
                  sparkColor='#FF79C6'
                  sparkSize={8}
                  sparkRadius={20}
                  sparkCount={12}
                  duration={500}
                >
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(45deg, #FF79C6, #7df9ff)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={600}>
                        Click Me!
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Click anywhere on this card to see the spark effect
                      </Typography>
                    </CardContent>
                  </Card>
                </ClickSpark>
              </Grid>
              
              <Grid xs={12} md={6}>
                <ClickSpark
                  sparkColor='#4ecdc4'
                  sparkSize={6}
                  sparkRadius={15}
                  sparkCount={8}
                  duration={300}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #4ecdc4, #96ceb4)',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600
                    }}
                  >
                    Spark Button
                  </Button>
                </ClickSpark>
              </Grid>
            </Grid>
          </Paper>

          {/* CardNav Demo */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              CardNav Component
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Navigation component with interactive cards and smooth animations
            </Typography>
            
            <Box
              sx={{
                height: '600px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                border: '2px solid #e0e0e0'
              }}
            >
              <CardNav
                items={cardNavItems}
                baseColor="#fff"
                menuColor="#000"
                buttonBgColor="#111"
                buttonTextColor="#fff"
                ease="power3.out"
              />
            </Box>
          </Paper>

          {/* Usage Examples */}
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
              Usage Examples
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    GradualBlur
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
{`<GradualBlur
  target="parent"
  position="bottom"
  height="6rem"
  strength={2}
  divCount={5}
  curve="bezier"
  exponential={true}
  opacity={1}
/>`}
                  </Box>
                </Box>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    ClickSpark
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
{`<ClickSpark
  sparkColor='#fff'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
  {/* Your content */}
</ClickSpark>`}
                  </Box>
                </Box>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    CardNav
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
{`<CardNav
  logo={logo}
  logoAlt="Logo"
  items={items}
  baseColor="#fff"
  menuColor="#000"
  buttonBgColor="#111"
  buttonTextColor="#fff"
  ease="power3.out"
/>`}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

