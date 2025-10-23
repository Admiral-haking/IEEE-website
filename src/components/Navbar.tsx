"use client";

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useColorScheme } from '@mui/joy/styles';
import { usePathname } from 'next/navigation';
import { 
  AppBar, 
  Button, 
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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';
import GlitchText from '@/components/GlitchText';
import { useTranslation } from 'react-i18next';

const logoLight = '/logo.png';
const logoDark = '/logo-dark-mode.png';

export default function Navbar() {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => setMounted(true), []);
  
  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const colorMode = mounted 
    ? (mode === 'system' ? theme.palette.mode : mode) 
    : 'light';
  const logoSrc = colorMode === 'dark' ? logoDark : logoLight;
  const pathname = usePathname();

  const { t } = useTranslation();
  const parts = (pathname || '/').split('/').filter(Boolean);
  const locale = parts[0] === 'en' || parts[0] === 'fa' ? parts[0] : 'en';
  const current = `/${parts.slice(1).join('/')}`;
  const isRtl = locale === 'fa';
  
  // Check if we're on an admin page
  const isAdminPage = pathname?.includes('/admin');
  
  // Main navigation links
  const mainLinks = [
    { href: `/${locale}/solutions`, key: 'solutions', label: t('solutions') },
    { href: `/${locale}/capabilities`, key: 'capabilities', label: t('capabilities') },
    { href: `/${locale}/team`, key: 'team', label: t('team') },
    { href: `/${locale}/blog`, key: 'blog', label: t('blog') },
    { href: `/${locale}/case-studies`, key: 'case-studies', label: t('case_studies') },
    { href: `/${locale}/jobs`, key: 'jobs', label: t('jobs') },
    { href: `/${locale}/contact`, key: 'contact', label: t('contact') }
  ];
  
  // Admin navigation links
  const adminLinks = [
    { href: `/${locale}/admin`, key: 'admin-dashboard', label: t('dashboard') },
    { href: `/${locale}/admin/users`, key: 'admin-users', label: t('users') },
    { href: `/${locale}/admin/team-members`, key: 'admin-team-members', label: t('team_members') },
    { href: `/${locale}/admin/pages`, key: 'admin-pages', label: t('pages') },
    { href: `/${locale}/admin/solutions`, key: 'admin-solutions', label: t('solutions') },
    { href: `/${locale}/admin/capabilities`, key: 'admin-capabilities', label: t('capabilities') },
    { href: `/${locale}/admin/blog`, key: 'admin-blog', label: t('blog') },
    { href: `/${locale}/admin/case-studies`, key: 'admin-case-studies', label: t('case_studies') },
    { href: `/${locale}/admin/jobs`, key: 'admin-jobs', label: t('jobs') },
    { href: `/${locale}/admin/media`, key: 'admin-media', label: t('media') }
  ];
  
  // Use appropriate links based on current page
  const links = isAdminPage ? adminLinks : mainLinks;
  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={0} 
      sx={{ 
        zIndex: 1202,
        overflow: 'visible',
        pointerEvents: 'auto',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
        backgroundColor: scrolled 
          ? (colorMode === 'dark' ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)')
          : 'transparent',
        borderBottom: scrolled 
          ? `1px solid ${colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled 
          ? (colorMode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)')
          : 'none'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          dir={isRtl ? 'rtl' : 'ltr'}
          sx={{
            justifyContent: 'space-between',
            gap: 2,
            py: scrolled ? 0.5 : 1,
            minHeight: { xs: 52, md: 64 },
            transition: 'padding 0.3s ease, min-height 0.3s ease'
          }}
        >
          <Stack direction={isRtl ? 'row-reverse' : 'row'} spacing={1} alignItems="center">
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
              <div style={{ position: 'relative' }}>
                <Image 
                  src={logoSrc} 
                  alt="Ø§Ù†Ø¬Ù…Ù† Ø¹Ù„Ù…ÛŒ Ù…Ù‡Ù†Ø¯Ø³ÛŒ Ú©Ø§Ù…Ù¾ÛŒÙˆØªØ±" 
                  width={scrolled ? 120 : 144} 
                  height={scrolled ? 80 : 96} 
                  style={{ 
                    width: 'auto',
                    transition: 'all 0.3s ease'
                  }} 
                  priority 
                  sizes="(max-width: 600px) 72px, (max-width: 900px) 96px, 144px" 
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
                      [isRtl ? 'left' : 'right']: -8,
                      fontSize: '0.6rem',
                      height: 16,
                      '& .MuiChip-label': {
                        px: 0.5
                      }
                    }}
                  />
                )}
              </div>
              <GlitchText
                speed={0.5}
                enableShadows={true}
                enableOnHover={true}
                variant="h6"
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-anime-en)',
                  fontWeight: 700,
                  fontSize: scrolled ? '1.1rem' : '1.25rem',
                  transition: 'font-size 0.3s ease'
                }}
              >
                {t('title')}
              </GlitchText>
              <GlitchText
                speed={0.3}
                enableShadows={true}
                enableOnHover={false}
                variant="h6"
                sx={{ 
                  fontSize: scrolled ? '0.7rem' : '0.8rem',
                  display: { xs: 'block', sm: 'none' },
                  lineHeight: 1.2,
                  fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-tech-en)',
                  fontWeight: 700,
                  transition: 'font-size 0.3s ease'
                }}
              >
                {locale === 'fa' ? 'Ø§Ù†Ø¬Ù…Ù† Ø¹Ù„Ù…ÛŒ' : 'CEA'}
              </GlitchText>
            </Link>
          </Stack>
          <div style={{ display: 'none', flex: 1, justifyContent: 'center', marginLeft: 16, marginRight: 16 }} className="md:flex">
            <SearchBar />
          </div>
          <Stack direction={isRtl ? 'row-reverse' : 'row'} gap={0.75} style={{ display: 'none' }} className="md:flex">
            {links.map((l, index) => {
              const active = current.startsWith('/' + l.key);
              return (
                <Fade in={mounted} timeout={300 + index * 100} key={l.key}>
                  <Button 
                    LinkComponent={NextLink} 
                    href={l.href} 
                    variant={active ? 'contained' : 'text'} 
                    size="small" 
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: active ? 600 : 500,
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.75,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: active 
                          ? '0 8px 25px rgba(25, 118, 210, 0.3)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.1)',
                        backgroundColor: active 
                          ? 'primary.dark' 
                          : (colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.5s ease',
                      },
                      '&:hover::before': {
                        left: '100%'
                      }
                    }}
                  >
                    {l.label}
                  </Button>
                </Fade>
              );
            })}
          </Stack>
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
              sx={{ 
                display: { xs: 'inline-flex', md: 'none' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }
              }} 
              onClick={() => setOpen(true)} 
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
      <Drawer 
        anchor={isRtl ? 'right' : 'left'} 
        open={open} 
        onClose={() => setOpen(false)} 
        sx={{ 
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            background: colorMode === 'dark' 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }
        }}
      >
        <div style={{ width: 300, padding: 24, direction: isRtl ? 'rtl' : 'ltr' }} role="presentation">
          <Stack direction={isRtl ? 'row-reverse' : 'row'} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction={isRtl ? 'row-reverse' : 'row'} spacing={1} alignItems="center">
              <Image src={logoSrc} alt="logo" width={32} height={32} style={{ width: 'auto' }} />
              <Typography variant="subtitle1" fontWeight={700} suppressHydrationWarning>
                {isAdminPage ? t('admin_panel') : t('name')}
              </Typography>
            </Stack>
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
                {t('admin')}
              </Typography>
              <List sx={{ mb: 3 }}>
                {adminLinks.map((l, index) => (
                  <Slide key={l.key} direction={isRtl ? 'left' : 'right'} in={open} timeout={200 + index * 50}>
                    <ListItemButton 
                      component={NextLink} 
                      href={l.href} 
                      sx={{ 
                        borderRadius: 2, 
                        mb: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          transform: 'translateX(8px)'
                        }
                      }}
                    >
                      <ListItemText 
                        primary={l.label}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }}
                      />
                    </ListItemButton>
                  </Slide>
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
            {isAdminPage ? t('site_navigation') : t('navigation')}
          </Typography>
          <List>
            {mainLinks.map((l, index) => (
              <Slide key={l.key} direction={isRtl ? 'left' : 'right'} in={open} timeout={300 + index * 50}>
                <ListItemButton 
                  component={NextLink} 
                  href={l.href} 
                  sx={{ 
                    borderRadius: 2, 
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <ListItemText 
                    primary={l.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }}
                  />
                </ListItemButton>
              </Slide>
            ))}
          </List>
        </div>
      </Drawer>
    </AppBar>
  );
}





