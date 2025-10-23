"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  Divider,
  Fade,
  Slide,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Cookie,
  Settings,
  Close,
  Check,
  Info
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ClientCookieManager, CookieConsent, CookieCategory } from '@/lib/cookies';

interface CookieConsentBannerProps {
  onConsentChange?: (consent: CookieConsent) => void;
}

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Set mounted state
    setMounted(true);
    
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Check if user has already given consent
      const existingConsent = ClientCookieManager.getConsent();
      const hasConsent = Object.values(existingConsent).some(value => value);
      
      if (!hasConsent) {
        setShowBanner(true);
      }
      
      setConsent(existingConsent);
    } catch (error) {
      // If there's an error reading cookies, show banner with default consent
      console.warn('Error reading cookie consent:', error);
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    setConsent(newConsent);
    try {
      ClientCookieManager.setConsent(newConsent);
    } catch (error) {
      console.warn('Error setting cookie consent:', error);
    }
    setShowBanner(false);
    onConsentChange?.(newConsent);
  };

  const handleAcceptEssential = () => {
    const newConsent: CookieConsent = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    setConsent(newConsent);
    try {
      ClientCookieManager.setConsent(newConsent);
    } catch (error) {
      console.warn('Error setting cookie consent:', error);
    }
    setShowBanner(false);
    onConsentChange?.(newConsent);
  };

  const handleSaveSettings = () => {
    try {
      ClientCookieManager.setConsent(consent);
    } catch (error) {
      console.warn('Error setting cookie consent:', error);
    }
    setShowBanner(false);
    setShowSettings(false);
    onConsentChange?.(consent);
  };

  const handleConsentChange = (category: keyof CookieConsent, value: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setConsent(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getCategoryDescription = (category: keyof CookieConsent): string => {
    switch (category) {
      case 'essential':
        return t('cookie_essential_desc');
      case 'functional':
        return t('cookie_functional_desc');
      case 'analytics':
        return t('cookie_analytics_desc');
      case 'marketing':
        return t('cookie_marketing_desc');
      case 'preferences':
        return t('cookie_preferences_desc');
      default:
        return '';
    }
  };

  const getCategoryTitle = (category: keyof CookieConsent): string => {
    switch (category) {
      case 'essential':
        return t('cookie_essential');
      case 'functional':
        return t('cookie_functional');
      case 'analytics':
        return t('cookie_analytics');
      case 'marketing':
        return t('cookie_marketing');
      case 'preferences':
        return t('cookie_preferences');
      default:
        return '';
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <Fade in={showBanner} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          p: 2,
          pointerEvents: 'none'
        }}
      >
        <Slide direction="up" in={showBanner} timeout={500}>
          <Card
            sx={{
              maxWidth: 600,
              mx: 'auto',
              pointerEvents: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              '& .MuiCardContent-root': {
                p: 3
              }
            }}
          >
            <CardContent>
              <Stack spacing={3}>
                {/* Header */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Cookie />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {t('cookie_consent_title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('cookie_consent_subtitle')}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setShowBanner(false)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Close />
                  </IconButton>
                </Stack>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t('cookie_consent_description')}
                </Typography>

                {/* Settings Toggle */}
                <Box>
                  <Button
                    variant="text"
                    startIcon={<Settings />}
                    onClick={() => setShowSettings(!showSettings)}
                    sx={{ 
                      textTransform: 'none',
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  >
                    {t('cookie_settings')}
                  </Button>
                </Box>

                {/* Cookie Settings */}
                <Collapse in={showSettings}>
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      {Object.entries(consent).map(([category, value]) => (
                        <Box key={category}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value}
                                onChange={(e) => handleConsentChange(category as keyof CookieConsent, e.target.checked)}
                                disabled={category === 'essential'}
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {getCategoryTitle(category as keyof CookieConsent)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {getCategoryDescription(category as keyof CookieConsent)}
                                </Typography>
                              </Box>
                            }
                            sx={{ alignItems: 'flex-start' }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Collapse>

                {/* Action Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ pt: 1 }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleAcceptEssential}
                    sx={{ 
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    {t('accept_essential')}
                  </Button>
                  
                  {showSettings && (
                    <Button
                      variant="contained"
                      onClick={handleSaveSettings}
                      startIcon={<Check />}
                      sx={{ 
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      {t('save_settings')}
                    </Button>
                  )}
                  
                  {!showSettings && (
                    <Button
                      variant="contained"
                      onClick={handleAcceptAll}
                      startIcon={<Check />}
                      sx={{ 
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      {t('accept_all')}
                    </Button>
                  )}
                </Stack>

                {/* Privacy Policy Link */}
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  {t('cookie_privacy_notice')}{' '}
                  <Button
                    variant="text"
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      textDecoration: 'underline'
                    }}
                  >
                    {t('privacy_policy')}
                  </Button>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Slide>
      </Box>
    </Fade>
  );
}
