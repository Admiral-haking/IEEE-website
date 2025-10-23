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
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch
} from '@mui/material';
import {
  Cookie,
  Security,
  Analytics,
  Settings,
  Campaign,
  ExpandMore,
  CheckCircle,
  Cancel,
  Info
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ClientCookieManager, CookieConsent, CookieCategory, COOKIE_CATEGORIES } from '@/lib/cookies';

interface CookieManagerProps {
  showAsPage?: boolean;
}

export default function CookieManager({ showAsPage = false }: CookieManagerProps) {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const existingConsent = ClientCookieManager.getConsent();
    setConsent(existingConsent);
  }, []);

  const handleConsentChange = (category: keyof CookieConsent, value: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setConsent(prev => ({
      ...prev,
      [category]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    ClientCookieManager.setConsent(consent);
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetToDefaults = () => {
    setConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      preferences: false
    });
    setHasChanges(true);
  };

  const handleAcceptAll = () => {
    setConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    setHasChanges(true);
  };

  const getCategoryIcon = (category: keyof CookieConsent) => {
    switch (category) {
      case 'essential':
        return <Security />;
      case 'functional':
        return <Settings />;
      case 'analytics':
        return <Analytics />;
      case 'marketing':
        return <Campaign />;
      case 'preferences':
        return <Cookie />;
      default:
        return <Info />;
    }
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

  const getCookiesInCategory = (category: CookieCategory): string[] => {
    return Object.entries(COOKIE_CATEGORIES)
      .filter(([_, cat]) => cat === category)
      .map(([name, _]) => name);
  };

  const content = (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box textAlign="center">
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: 3,
              backgroundColor: 'primary.main',
              color: 'white',
              mb: 2
            }}
          >
            <Cookie sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('cookie_management')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {t('cookie_management_description')}
          </Typography>
        </Box>

        {/* Success Alert */}
        {showSuccess && (
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            {t('cookie_settings_saved')}
          </Alert>
        )}

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('quick_actions')}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                onClick={handleAcceptAll}
                startIcon={<CheckCircle />}
                sx={{ textTransform: 'none' }}
              >
                {t('accept_all_cookies')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleResetToDefaults}
                startIcon={<Cancel />}
                sx={{ textTransform: 'none' }}
              >
                {t('reset_to_defaults')}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Cookie Categories */}
        <Stack spacing={2}>
          {Object.entries(consent).map(([category, value]) => (
            <Card key={category}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: value ? 'success.main' : 'grey.300',
                      color: value ? 'white' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getCategoryIcon(category as keyof CookieConsent)}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" fontWeight={600}>
                        {getCategoryTitle(category as keyof CookieConsent)}
                      </Typography>
                      <Chip
                        label={value ? t('enabled') : t('disabled')}
                        color={value ? 'success' : 'default'}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {getCategoryDescription(category as keyof CookieConsent)}
                    </Typography>
                  </Box>

                  <Switch
                    checked={value}
                    onChange={(e) => handleConsentChange(category as keyof CookieConsent, e.target.checked)}
                    disabled={category === 'essential'}
                    color="primary"
                  />
                </Stack>

                {/* Show cookies in this category */}
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" fontWeight={500}>
                      {t('view_cookies_in_category')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {getCookiesInCategory(category as CookieCategory).map((cookieName) => (
                        <ListItem key={cookieName}>
                          <ListItemIcon>
                            <Cookie fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={cookieName}
                            secondary={t('cookie_used_for_functionality')}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Save Button */}
        {hasChanges && (
          <Card sx={{ backgroundColor: 'primary.50' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {t('unsaved_changes')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('save_changes_to_apply')}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  startIcon={<CheckCircle />}
                  sx={{ textTransform: 'none' }}
                >
                  {t('save_settings')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('cookie_information')}
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('cookie_info_description')}
              </Typography>
              <Divider />
              <Typography variant="body2" color="text.secondary">
                {t('cookie_contact_info')}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );

  if (showAsPage) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        {content}
      </Box>
    );
  }

  return content;
}
