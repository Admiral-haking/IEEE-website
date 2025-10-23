# Typography System Guide

## Overview

This application uses a comprehensive responsive typography system optimized for both mobile and desktop experiences. The system is designed to provide consistent, readable text across all screen sizes while supporting both English and Persian (Farsi) languages.

## Key Features

- **Mobile-First Design**: Typography scales up from mobile to desktop
- **Locale-Aware**: Different line heights and letter spacing for English vs Persian
- **Consistent Scaling**: Uses Material-UI's responsive font system with custom enhancements
- **Performance Optimized**: Memoized styles to prevent unnecessary re-renders

## Typography Scale

### Standard Variants

| Variant | Mobile (xs) | Tablet (sm) | Desktop (md) | Large (lg) | XL (xl) |
|---------|-------------|-------------|--------------|------------|---------|
| h1 | 2.5rem (40px) | 3.5rem (56px) | 4.5rem (72px) | 5.5rem (88px) | - |
| h2 | 2rem (32px) | 2.5rem (40px) | 3rem (48px) | 3.5rem (56px) | - |
| h3 | 1.5rem (24px) | 1.75rem (28px) | 2rem (32px) | 2.25rem (36px) | - |
| h4 | 1.25rem (20px) | 1.5rem (24px) | 1.75rem (28px) | - | - |
| h5 | 1.125rem (18px) | 1.25rem (20px) | 1.5rem (24px) | - | - |
| h6 | 1rem (16px) | 1.125rem (18px) | 1.25rem (20px) | - | - |
| body1 | 0.875rem (14px) | 1rem (16px) | 1.125rem (18px) | - | - |
| body2 | 0.75rem (12px) | 0.875rem (14px) | 1rem (16px) | - | - |

### Custom Typography Presets

The system includes several preset combinations optimized for specific use cases:

- **pageTitle**: For main page titles (hero sections)
- **sectionHeader**: For section titles
- **cardHeader**: For card titles
- **navigation**: For navigation items
- **body**: For body content
- **caption**: For small text and captions
- **button**: For button text

## Usage

### Basic Usage

```tsx
import { typographyPresets } from '@/utils/typography';

// For a page title
<Typography variant="h1" sx={typographyPresets.pageTitle(locale)}>
  Page Title
</Typography>

// For a section header
<Typography variant="h3" sx={typographyPresets.sectionHeader(locale)}>
  Section Title
</Typography>

// For body text
<Typography variant="body1" sx={typographyPresets.body(locale)}>
  Body content goes here
</Typography>
```

### Locale-Specific Adjustments

The system automatically applies locale-specific adjustments:

**English (en):**
- Line height: 1.5
- Letter spacing: -0.01em (slight negative spacing for better readability)

**Persian (fa):**
- Line height: 1.7 (more space for better readability)
- Letter spacing: 0 (no letter spacing for Persian text)

### Custom Responsive Typography

For custom responsive typography, use the `responsiveTypography` object:

```tsx
import { responsiveTypography, getResponsiveTypography } from '@/utils/typography';

// Using predefined responsive styles
<Typography sx={responsiveTypography.heroTitle}>
  Custom Hero Title
</Typography>

// Combining with locale adjustments
<Typography sx={getResponsiveTypography(responsiveTypography.heroTitle, 'fa')}>
  Persian Hero Title
</Typography>
```

## Font Families

The application uses different font families for different languages and purposes:

### English Fonts
- **Body Text**: Inter (`--font-body-en`)
- **Display**: Bebas Neue (`--font-display-en`)
- **Anime/Special**: Orbitron (`--font-anime-en`)
- **Tech**: Exo 2 (`--font-tech-en`)
- **Cartoon**: Rajdhani (`--font-cartoon-en`)

### Persian Fonts
- **Body Text**: Vazirmatn (`--font-body-fa`)
- **Display**: Lalezar (`--font-display-fa`)

## Best Practices

### 1. Always Use Locale-Aware Typography

```tsx
// ✅ Good
<Typography sx={typographyPresets.sectionHeader(locale)}>
  Section Title
</Typography>

// ❌ Avoid
<Typography sx={{ fontSize: '1.5rem' }}>
  Section Title
</Typography>
```

### 2. Use Appropriate Variants

```tsx
// ✅ Good - Use semantic variants
<Typography variant="h1" sx={typographyPresets.pageTitle(locale)}>
  Main Title
</Typography>

// ❌ Avoid - Don't override variants unnecessarily
<Typography variant="body1" sx={{ fontSize: '2rem', fontWeight: 800 }}>
  Main Title
</Typography>
```

### 3. Combine with Material-UI Variants

```tsx
// ✅ Good - Combine Material-UI variants with responsive presets
<Typography variant="h3" sx={typographyPresets.sectionHeader(locale)}>
  Section Title
</Typography>

// ✅ Also good - Use Material-UI variants directly for simple cases
<Typography variant="body1">
  Simple body text
</Typography>
```

### 4. Memoize Styles for Performance

```tsx
// ✅ Good - Memoize styles to prevent re-renders
const titleStyles = React.useMemo(() => ({
  ...typographyPresets.pageTitle(locale),
  fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-anime-en)',
}), [locale]);

<Typography variant="h1" sx={titleStyles}>
  Title
</Typography>
```

## Responsive Breakpoints

The system uses Material-UI's standard breakpoints:

- **xs**: 0px and up (mobile)
- **sm**: 600px and up (tablet)
- **md**: 900px and up (desktop)
- **lg**: 1200px and up (large desktop)
- **xl**: 1536px and up (extra large)

## Performance Considerations

1. **Memoization**: Always memoize typography styles that depend on locale or other props
2. **Consistent Usage**: Use the preset system to ensure consistent performance
3. **Avoid Inline Styles**: Use the sx prop with predefined styles instead of inline styles

## Migration Guide

### From Old Typography System

If you're updating existing components:

1. **Replace hardcoded font sizes**:
   ```tsx
   // Old
   sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
   
   // New
   sx={typographyPresets.sectionHeader(locale)}
   ```

2. **Add locale prop**:
   ```tsx
   // Old
   function Component() { ... }
   
   // New
   function Component({ locale }: { locale: 'en' | 'fa' }) { ... }
   ```

3. **Use responsive presets**:
   ```tsx
   // Old
   <Typography variant="h3" fontWeight={700}>
   
   // New
   <Typography variant="h3" sx={typographyPresets.sectionHeader(locale)}>
   ```

## Examples

### Hero Section
```tsx
<Typography 
  variant="h1" 
  sx={{
    ...typographyPresets.pageTitle(locale),
    fontFamily: locale === 'fa' ? 'var(--font-display-fa)' : 'var(--font-anime-en)',
  }}
>
  {t('title')}
</Typography>
```

### Section Header
```tsx
<Typography variant="h3" sx={typographyPresets.sectionHeader(locale)}>
  {title}
</Typography>
```

### Card Title
```tsx
<Typography variant="h6" sx={typographyPresets.cardHeader(locale)}>
  {cardTitle}
</Typography>
```

### Navigation
```tsx
<Typography variant="body1" sx={typographyPresets.navigation(locale)}>
  {navItem}
</Typography>
```

This typography system ensures consistent, readable, and performant text across all devices and languages in your application.
