import { SxProps, Theme } from '@mui/material/styles';

// Responsive typography utilities for consistent mobile/desktop optimization
export const responsiveTypography = {
  // Hero title styles - optimized for mobile first
  heroTitle: {
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4.5rem', xl: '5.5rem' },
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  } as SxProps<Theme>,

  // Hero subtitle styles
  heroSubtitle: {
    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem', xl: '2rem' },
    fontWeight: 500,
    lineHeight: 1.4,
  } as SxProps<Theme>,

  // Section titles
  sectionTitle: {
    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem', xl: '2.25rem' },
    fontWeight: 700,
    lineHeight: 1.3,
  } as SxProps<Theme>,

  // Card titles
  cardTitle: {
    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
    fontWeight: 600,
    lineHeight: 1.4,
  } as SxProps<Theme>,

  // Navigation text
  navText: {
    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
    fontWeight: 500,
    lineHeight: 1.2,
  } as SxProps<Theme>,

  // Body text - optimized for readability
  bodyText: {
    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem', lg: '1.25rem' },
    lineHeight: 1.6,
  } as SxProps<Theme>,

  // Small text
  smallText: {
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    lineHeight: 1.5,
  } as SxProps<Theme>,

  // Button text
  buttonText: {
    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
    fontWeight: 600,
    lineHeight: 1.2,
  } as SxProps<Theme>,

  // Caption text
  captionText: {
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    lineHeight: 1.4,
  } as SxProps<Theme>,
};

// Locale-specific typography adjustments
export const localeTypography = {
  // Persian/Farsi specific adjustments
  fa: {
    lineHeight: 1.7, // Slightly more line height for better readability
    letterSpacing: 0, // No letter spacing for Persian text
  },
  // English specific adjustments
  en: {
    lineHeight: 1.5,
    letterSpacing: '-0.01em', // Slight negative letter spacing for English
  },
};

// Utility function to combine responsive typography with locale-specific adjustments
export const getResponsiveTypography = (
  baseStyle: SxProps<Theme>,
  locale: 'en' | 'fa' = 'en'
): SxProps<Theme> => ({
  ...baseStyle,
  ...localeTypography[locale],
});

// Common typography combinations for different use cases
export const typographyPresets = {
  // Page titles
  pageTitle: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.heroTitle, locale),
  
  // Section headers
  sectionHeader: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.sectionTitle, locale),
  
  // Card titles
  cardHeader: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.cardTitle, locale),
  
  // Navigation items
  navigation: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.navText, locale),
  
  // Body content
  body: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.bodyText, locale),
  
  // Small text/captions
  caption: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.captionText, locale),
  
  // Button text
  button: (locale: 'en' | 'fa' = 'en') => getResponsiveTypography(responsiveTypography.buttonText, locale),
};
