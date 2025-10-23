import React from 'react';
import { Box, Toolbar, Container, useTheme } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreadcrumbsNav from '@/components/BreadcrumbsNav';
import LogoLoop from '@/components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const backgroundColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', flexDirection: 'column' }}>
      {/* Tech marquee just below the top, above navbar */}
      <div 
        style={{ 
          display: 'none',
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: backgroundColor
        }}
        className="md:block"
      >
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
      </div>
      <Navbar />
      {/* Spacer to offset fixed AppBar height */}
      <Toolbar />
      <BreadcrumbsNav />
      <Box
        component="main"
        style={{ flexGrow: 1, paddingBottom: 'calc(var(--footer-height) + env(safe-area-inset-bottom))' }}
      >
        {children}
      </Box>
      <Footer />
    </div>
  );
}
