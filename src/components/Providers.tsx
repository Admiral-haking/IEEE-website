"use client";

import React, { Suspense } from 'react';
import I18nProvider from '@/components/I18nProvider';
import RtlProvider from '@/theme/rtl';
import ThemeRegistry from '@/theme/ThemeRegistry';
import SplashScreen from '@/components/SplashScreen';
import TopProgressBar from '@/components/TopProgressBar';
import FontOptimizer from '@/components/FontOptimizer';
import AIChatWidget from '@/components/AIChatWidget';
import { configure } from 'axios-hooks';
import axios from '@/lib/axios';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Configure axios-hooks to use our axios instance with baseURL
  // and disable SSR data fetching to avoid server-side auth/cookie issues.
  configure({ axios, defaultOptions: { ssr: false } });
  return (
    <I18nProvider>
      <RtlProvider>
        <ThemeRegistry>
          <FontOptimizer />
          <Suspense fallback={null}>
            <TopProgressBar />
          </Suspense>
          {children}
          <AIChatWidget />
          <SplashScreen />
        </ThemeRegistry>
      </RtlProvider>
    </I18nProvider>
  );
}
