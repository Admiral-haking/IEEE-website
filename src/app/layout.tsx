import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import ErrorBoundary from '@/components/ErrorBoundary';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { Inter, Bebas_Neue, Vazirmatn, Lalezar, Orbitron, Exo_2, Rajdhani, Saira_Condensed } from 'next/font/google';
import { cookies } from 'next/headers';

// English fonts with Windows optimization
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body-en', 
  display: 'swap',
  fallback: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
  preload: true
});
const bebas = Bebas_Neue({ 
  subsets: ['latin'], 
  weight: '400', 
  variable: '--font-display-en', 
  display: 'swap',
  fallback: ['Impact', 'Arial Black', 'sans-serif'],
  preload: false
});
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-anime-en', 
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
  preload: false
});
const exo2 = Exo_2({ 
  subsets: ['latin'], 
  variable: '--font-tech-en', 
  display: 'swap',
  fallback: ['Segoe UI', 'Arial', 'sans-serif'],
  preload: false
});
const rajdhani = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], 
  variable: '--font-cartoon-en', 
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  preload: false
});
// Placeholder for Bitcount Prop Single Ink (use local later)
const bitcountFallback = Saira_Condensed({ 
  subsets: ['latin'], 
  weight: ['400'], 
  variable: '--font-bitcount', 
  display: 'swap',
  fallback: ['Arial Narrow', 'Arial', 'sans-serif'],
  preload: false
});

// Persian fonts with Windows optimization
const vazirmatn = Vazirmatn({ 
  subsets: ['arabic'], 
  variable: '--font-body-fa', 
  display: 'swap',
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
  preload: true
});
const lalezar = Lalezar({ 
  subsets: ['arabic'], 
  weight: '400', 
  variable: '--font-display-fa', 
  display: 'swap',
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
  preload: false
});

export const metadata: Metadata = {
  title: 'IEEE Association - Quchan University of Technology',
  description: 'Quchan University of Technology - Education - Research - Innovation',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png'
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Detect locale on the server to avoid RTL/LTR and font flash on first paint
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('hippo_language')?.value;
  const locale: 'en' | 'fa' = cookieLocale === 'fa' ? 'fa' : 'en';
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const langAttr = locale === 'fa' ? 'fa-IR' : 'en';
  return (
    <html lang={langAttr} dir={dir} suppressHydrationWarning className={`${inter.variable} ${bebas.variable} ${orbitron.variable} ${exo2.variable} ${rajdhani.variable} ${vazirmatn.variable} ${lalezar.variable} ${bitcountFallback.variable}`}>
      <head>
        {/* Windows font optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical font loading for Windows */
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: local('Inter'), local('Inter-Regular');
            }
            
            /* Windows-specific text rendering */
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
            }
            /* Apply language-specific body fonts without overriding globally */
            html[lang="en"] body {
              font-family: var(--font-body-en), 'Segoe UI', 'Tahoma', 'Arial', sans-serif !important;
            }
            html[lang="fa"] body {
              font-family: var(--font-body-fa), 'Tahoma', 'Arial', sans-serif !important;
            }
          `
        }} />
      </head>
      <body lang={locale}>
        <ErrorBoundary>
          <Providers>
            {children}
            <CookieConsentBanner />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
