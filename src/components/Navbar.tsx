// @ts-nocheck
"use client";

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useColorScheme } from '@mui/joy/styles';
import { usePathname } from 'next/navigation';
import { 
  AppBar, 
  Container, 
  Link, 
  Stack, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Box,
  Chip,
  Fade,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import dynamic from 'next/dynamic';
const SearchBar = dynamic(() => import('@/components/SearchBar'), { ssr: false });
import GlitchText from '@/components/GlitchText';
import enCommon from '@/locales/en/common.json';
import faCommon from '@/locales/fa/common.json';

const logoLight = '/logo.png';
const logoDark = '/logo-dark-mode.png';

export default function Navbar() {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const lastScroll = React.useRef(0);
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => setMounted(true), []);
  
  // Handle scroll effect (shrink + auto-hide on scroll down)
  React.useEffect(() => {
    const handleScroll = () => {
        const y = window.scrollY;
        setScrolled(y > 20);
        const goingDown = y > lastScroll.current;
        const threshold = 80;
        setHidden(goingDown && y > threshold);
        lastScroll.current = y;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const colorMode = mounted 
    ? (mode === 'system' ? theme.palette.mode : mode) 
    : 'light';
  const logoSrc = colorMode === 'dark' ? logoDark : logoLight;
  const pathname = usePathname();

  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  const current = `/${parts.slice(1).join('/')}`;
  const isRtl = locale === 'fa';
  const dict = locale === 'fa' ? (faCommon as any) : (enCommon as any);
  const drawerDir: 'ltr' | 'rtl' = isRtl ? 'rtl' : 'ltr';
  const centerBoxSx: SxProps<Theme> = { display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center', ml: 2, mr: 2 };
  
  // Check if we're on an admin page
  const isAdminPage = pathname?.includes('/admin');
  
  // Main navigation links
  const mainLinks = [
    { href: `/${locale}/solutions`, key: 'solutions', label: dict.solutions },
    { href: `/${locale}/capabilities`, key: 'capabilities', label: dict.capabilities },
    { href: `/${locale}/team`, key: 'team', label: dict.team },
    { href: `/${locale}/blog`, key: 'blog', label: dict.blog },
    { href: `/${locale}/case-studies`, key: 'case-studies', label: dict.case_studies },
    { href: `/${locale}/jobs`, key: 'jobs', label: dict.jobs },
    { href: `/${locale}/contact`, key: 'contact', label: dict.contact }
  ];
  
  // Admin navigation links
  const adminLinks = [
    { href: `/${locale}/admin`, key: 'admin-dashboard', label: dict.dashboard },
    { href: `/${locale}/admin/users`, key: 'admin-users', label: dict.users },
    { href: `/${locale}/admin/team-members`, key: 'admin-team-members', label: dict.team_members },
    { href: `/${locale}/admin/pages`, key: 'admin-pages', label: dict.pages },
    { href: `/${locale}/admin/solutions`, key: 'admin-solutions', label: dict.solutions },
    { href: `/${locale}/admin/capabilities`, key: 'admin-capabilities', label: dict.capabilities },
    { href: `/${locale}/admin/blog`, key: 'admin-blog', label: dict.blog },
    { href: `/${locale}/admin/case-studies`, key: 'admin-case-studies', label: dict.case_studies },
    { href: `/${locale}/admin/jobs`, key: 'admin-jobs', label: dict.jobs },
    { href: `/${locale}/admin/media`, key: 'admin-media', label: dict.media }
  ];
  
  // Use appropriate links based on current page
  const links = isAdminPage ? adminLinks : mainLinks;
  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={0} 
      sx={{ 
        zIndex: 1000,
        overflow: 'visible',
        pointerEvents: 'auto',
        // Subtle glassy blur for separation
        backdropFilter: 'saturate(140%) blur(2px)',
        WebkitBackdropFilter: 'saturate(140%) blur(2px)',
        background: colorMode === 'dark'
          ? 'linear-gradient(135deg, rgba(18,18,18,0.30) 0%, rgba(35,35,35,0.18) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.16) 100%)',
        borderBottom: `1px solid ${colorMode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)'}`,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s ease, background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          dir={isRtl ? 'rtl' : 'ltr'}
          sx={{
            justifyContent: 'space-between',
            gap: 1,
            py: scrolled ? 0.25 : 0.5,
            minHeight: { xs: 48, md: 56 },
            transition: 'padding 0.3s ease, min-height 0.3s ease'
          }}
        >
          <Stack direction={isRtl ? 'row-reverse' : 'row'} spacing={{ xs: 0.5, md: 1 }} alignItems="center">
            <Link 
              component={NextLink} 
              href={`/${locale}`} 
              underline="none" 
              color="inherit" 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Image 
                  src={logoSrc} 
                  alt="IEEE Association logo" 
                  width={scrolled ? 100 : 120} 
                  height={scrolled ? 60 : 80} 
                  className="navbar-logo-img"
                  priority 
                  sizes="(max-width: 600px) 60px, (max-width: 900px) 80px, 120px" 
                  suppressHydrationWarning 
                />
                {isAdminPage && (
                  <Chip
                    label="ADMIN"
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      ...(isRtl ? { left: -8 } : { right: -8 }),
                      fontSize: '0.6rem',
                      height: 16,
                      '& .MuiChip-label': {
                        px: 0.5
                      }
                    }}
                  />
                )}
              </Box>
              <GlitchText
                speed={0.5}
                enableShadows={true}
                enableOnHover={true}
                disableEffects={true}
                variant="h6"
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-anime-en)',
                  fontWeight: 700,
                  fontSize: scrolled ? '0.9rem' : '1rem',
                  transition: 'font-size 0.3s ease',
                  color: colorMode === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {/* Avoid hydration mismatch by using dict from URL locale */}
                {dict.title}
              </GlitchText>
              <GlitchText
                speed={0.3}
                enableShadows={true}
                enableOnHover={false}
                disableEffects={true}
                variant="h6"
                sx={{ 
                  fontSize: scrolled ? '0.6rem' : '0.7rem',
                  display: { xs: 'block', sm: 'none' },
                  lineHeight: 1.2,
                  fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-tech-en)',
                  fontWeight: 700,
                  transition: 'font-size 0.3s ease',
                  color: colorMode === 'dark' ? '#ffffff' : '#111827'
                }}
              >
                {locale === 'fa' ? dict.name : 'CEA'}
              </GlitchText>
            </Link>
          </Stack>
          <Box component="div" sx={centerBoxSx}>
            <SearchBar />
          </Box>
          <Stack direction={isRtl ? 'row-reverse' : 'row'} spacing={1} alignItems="center">
            <Fade in={mounted} timeout={800}>
              <div>
                <LanguageToggle />
              </div>
            </Fade>
            <Fade in={mounted} timeout={900}>
              <div>
                <ThemeToggle />
              </div>
            </Fade>
            <IconButton 
              edge="end"
              sx={{ 
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.06)',
                  backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                }
              }} 
              onClick={() => setOpen(true)} 
              aria-label="menu"
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
      <Drawer 
        anchor={isRtl ? 'right' : 'left'} 
        open={open} 
        onClose={() => setOpen(false)} 
        sx={{ 
          '& .MuiDrawer-paper': {
            width: { xs: 280, sm: 320 },
            // Frosted drawer panel without blur
            background: colorMode === 'dark'
              ? 'linear-gradient(135deg, rgba(26,26,26,0.32) 0%, rgba(45,45,45,0.26) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(245,245,245,0.22) 100%)',
            backdropFilter: 'saturate(140%) blur(0px)',
            WebkitBackdropFilter: 'saturate(140%) blur(0px)',
            borderRight: `1px solid ${colorMode === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.12)'}`
          }
        }}
      >
        <Box component="div" sx={{ width: '100%', p: 3 }} dir={drawerDir} role="presentation">
          <Stack direction={isRtl ? 'row-reverse' : 'row'} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} suppressHydrationWarning>
              {isAdminPage ? dict.admin_panel : dict.navigation}
            </Typography>
            <IconButton 
              onClick={() => setOpen(false)}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: `rotate(${isRtl ? '-90deg' : '90deg'})`,
                  backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          
          <Divider sx={{ mb: 3, borderColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
          
          {isAdminPage && (
            <>
              <Typography 
                variant="subtitle2" 
                color="primary" 
                fontWeight={600} 
                sx={{ 
                  mb: 2, 
                  px: 1.5, py: 0.75,
                  backgroundColor: colorMode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
                  borderRadius: 2,
                  border: `1px solid ${colorMode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)'}`
                }}
              >
                {dict.admin}
              </Typography>
              <List sx={{ mb: 3 }}>
                {adminLinks.map((l) => (
                  <ListItemButton 
                    key={l.key}
                    component={NextLink} 
                    href={l.href} 
                    onClick={() => setOpen(false)}
                    sx={{ 
                      borderRadius: 2, 
                      mb: 0.5,
                      py: 0.75,
                      '&:hover': {
                        backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={l.label}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                    />
                  </ListItemButton>
                ))}
              </List>
              <Divider sx={{ mb: 3, borderColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
            </>
          )}
          
          <Typography 
            variant="subtitle2" 
            color="primary" 
            fontWeight={600} 
            sx={{ 
              mb: 2, 
              px: 1.5, py: 0.75,
              backgroundColor: colorMode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
              borderRadius: 2,
              border: `1px solid ${colorMode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)'}`
            }}
          >
            {isAdminPage ? dict.site_navigation : dict.navigation}
          </Typography>
          <List>
            {mainLinks.map((l) => (
              <ListItemButton 
                key={l.key}
                component={NextLink} 
                href={l.href} 
                onClick={() => setOpen(false)}
                sx={{ 
                  borderRadius: 2, 
                  mb: 0.5,
                  py: 0.75,
                  '&:hover': {
                    backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemText 
                  primary={l.label}
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
