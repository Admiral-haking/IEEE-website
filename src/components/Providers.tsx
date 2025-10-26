"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import I18nProvider from '@/components/I18nProvider';
import RtlProvider from '@/theme/rtl';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { configure } from 'axios-hooks';
import axios from '@/lib/axios';

// Defer non-critical UI to reduce initial JS and main-thread work
const SplashScreen = dynamic(() => import('@/components/SplashScreen'), { ssr: false });
const TopProgressBar = dynamic(() => import('@/components/TopProgressBar'), { ssr: false });
const FontOptimizer = dynamic(() => import('@/components/FontOptimizer'), { ssr: false });
const AIChatWidget = dynamic(() => import('@/components/AIChatWidget'), { ssr: false });

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
