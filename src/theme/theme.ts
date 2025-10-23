import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { TypographyVariantsOptions } from '@mui/material/styles';

const SYSTEM_FONT_STACK = [
  '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica',
  'Arial', 'Noto Sans', 'Liberation Sans', 'Apple Color Emoji',
  'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
].join(', ');

const LINK_COLOR = 'hsl(210, 100%, 66%)';

export function createMaterialTheme(mode: 'light' | 'dark' = 'light', direction: 'ltr' | 'rtl' = 'ltr') {
  const isDark = mode === 'dark';
  const base = createTheme({
    direction,
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: SYSTEM_FONT_STACK,
      // Enhanced responsive typography
      h1: {
        fontSize: '2.5rem', // 40px
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        '@media (min-width:600px)': {
          fontSize: '3.5rem', // 56px
        },
        '@media (min-width:900px)': {
          fontSize: '4.5rem', // 72px
        },
        '@media (min-width:1200px)': {
          fontSize: '5.5rem', // 88px
        }
      },
      h2: {
        fontSize: '2rem', // 32px
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        '@media (min-width:600px)': {
          fontSize: '2.5rem', // 40px
        },
        '@media (min-width:900px)': {
          fontSize: '3rem', // 48px
        },
        '@media (min-width:1200px)': {
          fontSize: '3.5rem', // 56px
        }
      },
      h3: {
        fontSize: '1.5rem', // 24px
        fontWeight: 600,
        lineHeight: 1.3,
        '@media (min-width:600px)': {
          fontSize: '1.75rem', // 28px
        },
        '@media (min-width:900px)': {
          fontSize: '2rem', // 32px
        },
        '@media (min-width:1200px)': {
          fontSize: '2.25rem', // 36px
        }
      },
      h4: {
        fontSize: '1.25rem', // 20px
        fontWeight: 600,
        lineHeight: 1.4,
        '@media (min-width:600px)': {
          fontSize: '1.5rem', // 24px
        },
        '@media (min-width:900px)': {
          fontSize: '1.75rem', // 28px
        }
      },
      h5: {
        fontSize: '1.125rem', // 18px
        fontWeight: 600,
        lineHeight: 1.4,
        '@media (min-width:600px)': {
          fontSize: '1.25rem', // 20px
        },
        '@media (min-width:900px)': {
          fontSize: '1.5rem', // 24px
        }
      },
      h6: {
        fontSize: '1rem', // 16px
        fontWeight: 600,
        lineHeight: 1.5,
        '@media (min-width:600px)': {
          fontSize: '1.125rem', // 18px
        },
        '@media (min-width:900px)': {
          fontSize: '1.25rem', // 20px
        }
      },
      body1: {
        fontSize: '0.875rem', // 14px
        lineHeight: 1.6,
        '@media (min-width:600px)': {
          fontSize: '1rem', // 16px
        },
        '@media (min-width:900px)': {
          fontSize: '1.125rem', // 18px
        }
      },
      body2: {
        fontSize: '0.75rem', // 12px
        lineHeight: 1.6,
        '@media (min-width:600px)': {
          fontSize: '0.875rem', // 14px
        },
        '@media (min-width:900px)': {
          fontSize: '1rem', // 16px
        }
      },
      button: {
        fontSize: '0.875rem', // 14px
        fontWeight: 600,
        lineHeight: 1.2,
        '@media (min-width:600px)': {
          fontSize: '1rem', // 16px
        }
      },
      caption: {
        fontSize: '0.75rem', // 12px
        lineHeight: 1.4,
        '@media (min-width:600px)': {
          fontSize: '0.875rem', // 14px
        }
      },
      overline: {
        fontSize: '0.75rem', // 12px
        fontWeight: 600,
        lineHeight: 1.2,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        '@media (min-width:600px)': {
          fontSize: '0.875rem', // 14px
        }
      }
    },
    palette: isDark ? {
      mode: 'dark',
      background: { default: '#000000', paper: '#0A0A0A' },
      text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.72)' },
      primary: { main: '#ffffff', contrastText: '#222222' },
      secondary: { main: '#B39DDB' },
      info: { main: '#4DD0E1' },
      success: { main: '#66BB6A' },
      warning: { main: '#FFB74D' },
      error: { main: '#EF5350' },
      divider: 'rgba(255,255,255,0.15)'
    } : {
      mode: 'light',
      background: { default: '#ffffff', paper: '#ffffff' },
      text: { primary: '#222222', secondary: 'rgba(0,0,0,0.68)' },
      primary: { main: '#111111', contrastText: '#ffffff' },
      secondary: { main: '#7E57C2' },
      info: { main: '#26C6DA' },
      success: { main: '#2E7D32' },
      warning: { main: '#ED6C02' },
      error: { main: '#D32F2F' },
      divider: 'rgba(0,0,0,0.12)'
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          InputProps: {
            sx: { py: 2 }
          }
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1.5
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2
            }
          }
        }
      },
      MuiButton: {
        defaultProps: {
          color: 'inherit'
        }
      },
      MuiIconButton: {
        defaultProps: {
          color: 'inherit'
        }
      },
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          body: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          },
          a: {
            color: LINK_COLOR,
            textDecoration: 'none'
          },
        })
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: LINK_COLOR,
            textDecoration: 'none'
          }
        }
      }
    }
  });
  return responsiveFontSizes(base, {
    breakpoints: ['sm', 'md', 'lg'],
    factor: 2.5,
    variants: ['h1','h2','h3','h4','h5','h6','body1','body2','button','caption','overline']
  });
}

const theme = createMaterialTheme('light');
export default theme;
