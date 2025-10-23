import { NextRequest, NextResponse } from 'next/server';

// Cookie configuration types
export interface CookieConfig {
  name: string;
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
  };
}

// Cookie categories for consent management
export enum CookieCategory {
  ESSENTIAL = 'essential',
  FUNCTIONAL = 'functional',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PREFERENCES = 'preferences'
}

// Cookie consent preferences
export interface CookieConsent {
  essential: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

// Default cookie consent (only essential cookies)
export const DEFAULT_CONSENT: CookieConsent = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  preferences: false
};

// Cookie configurations
export const COOKIE_CONFIGS: Record<string, CookieConfig> = {
  // Authentication cookies (Essential)
  accessToken: {
    name: 'hippo_access_token',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15 // 15 minutes
    }
  },
  refreshToken: {
    name: 'hippo_refresh_token',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  },
  
  // User preferences (Preferences)
  theme: {
    name: 'hippo_theme',
    options: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    }
  },
  language: {
    name: 'hippo_language',
    options: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    }
  },
  
  // Cookie consent (Essential)
  consent: {
    name: 'hippo_cookie_consent',
    options: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    }
  },
  
  // Analytics cookies (Analytics)
  analytics: {
    name: 'hippo_analytics',
    options: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    }
  },
  
  // Session cookies (Essential)
  session: {
    name: 'hippo_session',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    }
  },
  
  // CSRF token (Essential)
  csrf: {
    name: 'hippo_csrf_token',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    }
  }
};

// Cookie category mapping
export const COOKIE_CATEGORIES: Record<string, CookieCategory> = {
  'hippo_access_token': CookieCategory.ESSENTIAL,
  'hippo_refresh_token': CookieCategory.ESSENTIAL,
  'hippo_session': CookieCategory.ESSENTIAL,
  'hippo_csrf_token': CookieCategory.ESSENTIAL,
  'hippo_cookie_consent': CookieCategory.ESSENTIAL,
  'hippo_theme': CookieCategory.PREFERENCES,
  'hippo_language': CookieCategory.PREFERENCES,
  'hippo_analytics': CookieCategory.ANALYTICS
};

// Server-side utilities are now in ./server-cookies.ts

// Client-side cookie utilities (for use in client components)
export class ClientCookieManager {
  static getCookie(name: string): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
      return null;
    } catch (error) {
      console.warn(`Error reading cookie ${name}:`, error);
      return null;
    }
  }

  static setCookie(name: string, value: string, options?: Partial<CookieConfig['options']>): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const config = COOKIE_CONFIGS[name];
      if (!config) {
        console.error(`Cookie configuration not found for: ${name}`);
        return;
      }

      const cookieOptions = {
        ...config.options,
        ...options
      };

      let cookieString = `${name}=${value}`;

      if (cookieOptions.maxAge) {
        cookieString += `; max-age=${cookieOptions.maxAge}`;
      }

      if (cookieOptions.expires) {
        cookieString += `; expires=${cookieOptions.expires.toUTCString()}`;
      }

      if (cookieOptions.path) {
        cookieString += `; path=${cookieOptions.path}`;
      }

      if (cookieOptions.domain) {
        cookieString += `; domain=${cookieOptions.domain}`;
      }

      if (cookieOptions.sameSite) {
        cookieString += `; samesite=${cookieOptions.sameSite}`;
      }

      if (cookieOptions.secure) {
        cookieString += `; secure`;
      }

      if (cookieOptions.httpOnly) {
        cookieString += `; httponly`;
      }

      document.cookie = cookieString;
    } catch (error) {
      console.warn(`Error setting cookie ${name}:`, error);
    }
  }

  static deleteCookie(name: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const config = COOKIE_CONFIGS[name];
    if (!config) {
      console.error(`Cookie configuration not found for: ${name}`);
      return;
    }

    this.setCookie(name, '', {
      ...config.options,
      maxAge: 0,
      expires: new Date(0)
    });
  }

  static getConsent(): CookieConsent {
    try {
      const consentStr = this.getCookie('hippo_cookie_consent');
      if (!consentStr) {
        return DEFAULT_CONSENT;
      }

      return JSON.parse(consentStr);
    } catch (error) {
      console.warn('Error reading cookie consent:', error);
      return DEFAULT_CONSENT;
    }
  }

  static setConsent(consent: CookieConsent): void {
    try {
      this.setCookie('hippo_cookie_consent', JSON.stringify(consent));
    } catch (error) {
      console.warn('Error setting cookie consent:', error);
    }
  }

  static canSetCookie(name: string): boolean {
    const consent = this.getConsent();
    const category = COOKIE_CATEGORIES[name];
    
    if (!category) {
      return false; // Unknown cookie
    }

    return consent[category];
  }

  static getAllCookies(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }

    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }

  static clearAllCookies(): void {
    if (typeof window === 'undefined') {
      return;
    }

    Object.keys(COOKIE_CONFIGS).forEach(name => {
      this.deleteCookie(name);
    });
  }
}

// Response cookie utilities (for API routes)
export class ResponseCookieManager {
  static setCookie(response: NextResponse, name: string, value: string, options?: Partial<CookieConfig['options']>): void {
    const config = COOKIE_CONFIGS[name];
    
    if (!config) {
      throw new Error(`Cookie configuration not found for: ${name}`);
    }

    const cookieOptions = {
      ...config.options,
      ...options
    };

    response.cookies.set(name, value, cookieOptions);
  }

  static deleteCookie(response: NextResponse, name: string): void {
    const config = COOKIE_CONFIGS[name];
    
    if (!config) {
      throw new Error(`Cookie configuration not found for: ${name}`);
    }

    response.cookies.set(name, '', {
      ...config.options,
      maxAge: 0,
      expires: new Date(0)
    });
  }
}

// Cookie validation utilities
export class CookieValidator {
  static isValidCookieName(name: string): boolean {
    // RFC 6265 cookie name validation
    return /^[a-zA-Z0-9!#$%&'*+\-.^_`|~]+$/.test(name);
  }

  static isValidCookieValue(value: string): boolean {
    // Basic cookie value validation
    return value.length <= 4096; // Max cookie size
  }

  static sanitizeCookieValue(value: string): string {
    // Remove potentially dangerous characters
    return value.replace(/[;,\s]/g, '');
  }
}

// Export commonly used cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'hippo_access_token',
  REFRESH_TOKEN: 'hippo_refresh_token',
  THEME: 'hippo_theme',
  LANGUAGE: 'hippo_language',
  CONSENT: 'hippo_cookie_consent',
  ANALYTICS: 'hippo_analytics',
  SESSION: 'hippo_session',
  CSRF: 'hippo_csrf_token'
} as const;
