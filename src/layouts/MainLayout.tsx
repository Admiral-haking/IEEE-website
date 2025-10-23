import React from 'react';
import { Box, Toolbar, Container, useTheme } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import LogoLoop from '@/components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" minHeight="100dvh" flexDirection="column">
      {/* Tech marquee just below the top, above navbar */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, py: 1, backgroundColor: (theme: any) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
        <Container maxWidth="lg">
          <LogoLoop
            logos={[
              { node: <SiReact title="React" />, href: 'https://react.dev' },
              { node: <SiNextdotjs title="Next.js" />, href: 'https://nextjs.org' },
              { node: <SiTypescript title="TypeScript" />, href: 'https://www.typescriptlang.org' },
              { node: <SiTailwindcss title="Tailwind CSS" />, href: 'https://tailwindcss.com' },
            ]}
            speed={120}
            direction="left"
            logoHeight={22}
            gap={36}
            pauseOnHover
            fadeOut
            fadeOutColor={undefined}
            ariaLabel="Technologies we use"
          />
        </Container>
      </Box>
      <Navbar />
      {/* Spacer to offset fixed AppBar height */}
      <Toolbar />
      <BreadcrumbsNav />
      <Box
        component="main"
        flexGrow={1}
        sx={{
          pb: {
            xs: 'calc(var(--footer-height) + env(safe-area-inset-bottom))',
            sm: 'calc(var(--footer-height) + env(safe-area-inset-bottom))',
          }
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
