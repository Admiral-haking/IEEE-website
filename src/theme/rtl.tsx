"use client";

import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useTranslation } from 'react-i18next';
import stylisRTLPlugin from '@mui/stylis-plugin-rtl';

function createRtlCache() {
  return createCache({ key: 'mui-rtl', stylisPlugins: [stylisRTLPlugin] });
}

export default function RtlProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith('fa');
  const cache = React.useMemo(() => (isRtl ? createRtlCache() : null), [isRtl]);

  React.useEffect(() => {
    const dir = isRtl ? 'rtl' : 'ltr';
    const lang = isRtl ? 'fa' : 'en';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
    }
  }, [isRtl]);

  if (isRtl && cache) {
    return <CacheProvider value={cache}>{children}</CacheProvider>;
  }
  return <>{children}</>;
}
