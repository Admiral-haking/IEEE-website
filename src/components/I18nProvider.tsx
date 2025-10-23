"use client";

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ensureI18n } from '@/i18n';
import { usePathname } from 'next/navigation';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const i18n = ensureI18n();
  const pathname = usePathname();
  
  // Ensure the i18n language matches URL after render to avoid hydration mismatch
  useEffect(() => {
    if (pathname) {
      const seg = pathname.split('/').filter(Boolean)[0];
      const validLocale = seg === 'en' || seg === 'fa' ? seg : 'en';
      
      // Only change language if it's different to avoid unnecessary re-renders
      if (i18n.language !== validLocale) {
        i18n.changeLanguage(validLocale);
      }
    }
  }, [pathname, i18n]);
  
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
