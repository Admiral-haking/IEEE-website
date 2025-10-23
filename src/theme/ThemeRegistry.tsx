"use client";

import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline as JoyCssBaseline } from "@mui/joy";
import { CssVarsProvider, extendTheme, getInitColorSchemeScript, useColorScheme } from "@mui/joy/styles";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline as MaterialCssBaseline } from "@mui/material";
import materialTheme, { createMaterialTheme } from "./theme";
import { useTranslation } from "react-i18next";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("fa");

  const themed = React.useMemo(() => {
    return extendTheme({
      direction: isRtl ? "rtl" : "ltr",
      colorSchemes: {
        light: { palette: { background: { body: "#ffffff" } } },
        dark: { palette: { background: { body: "#0a0a0a" } } },
      },
    });
  }, [isRtl]);

  function MaterialThemeBridge({ children }: { children: React.ReactNode }) {
    const { mode } = useColorScheme();
    const { i18n } = useTranslation();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const effectiveMode = (mounted ? (mode ?? 'light') : 'light') as 'light' | 'dark';
    const direction = i18n.language?.startsWith('fa') ? 'rtl' : 'ltr';
    const materialThemed = React.useMemo(
      () => createMaterialTheme(effectiveMode, direction),
      [effectiveMode, direction]
    );
    return (
      <ThemeProvider theme={materialThemed}>
        <MaterialCssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <>
      {getInitColorSchemeScript()}
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <CssVarsProvider theme={themed} defaultMode="system">
          <JoyCssBaseline />
          <MaterialThemeBridge>
            {children}
          </MaterialThemeBridge>
        </CssVarsProvider>
      </AppRouterCacheProvider>
    </>
  );
}
