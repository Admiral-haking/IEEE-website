import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addSecurityHeaders, handleCorsPreflight } from '@/middleware/security';

const locales = ['en', 'fa'] as const;
type Locale = (typeof locales)[number];

function getPreferredLocale(req: NextRequest): Locale {
  const header = req.headers.get('accept-language') || '';
  const parts = header.split(',').map((s) => s.trim());
  for (const part of parts) {
    const [tag] = part.split(';');
    if (!tag) continue;
    const base = tag.toLowerCase();
    if (base.startsWith('fa')) return 'fa';
    if (base.startsWith('en')) return 'en';
  }
  return 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle CORS preflight requests for API routes
  if (pathname.startsWith('/api')) {
    const corsResponse = handleCorsPreflight(request);
    if (corsResponse) {
      return corsResponse;
    }
  }
  
  // Ignore static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    const response = NextResponse.next();
    return addSecurityHeaders(response, request);
  }

  // Handle locale routing for non-API routes
  if (!pathname.startsWith('/api')) {
    const pathLocale = pathname.split('/').filter(Boolean)[0];
    const hasLocale = locales.includes(pathLocale as Locale);
    
    if (!hasLocale) {
      const pref = getPreferredLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${pref}${pathname}`;
      const res = NextResponse.redirect(url);
      res.cookies.set('hippo_language', pref, { path: '/' });
      return addSecurityHeaders(res, request);
    }
  }
  
  const response = NextResponse.next();
  // Persist locale cookie whenever a locale prefix exists in the URL
  const pathLocale = pathname.split('/').filter(Boolean)[0];
  if (pathLocale === 'en' || pathLocale === 'fa') {
    response.cookies.set('hippo_language', pathLocale, { path: '/' });
  }
  return addSecurityHeaders(response, request);
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
};
