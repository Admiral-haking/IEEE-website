import { cookies } from 'next/headers';
import { COOKIE_CONFIGS, CookieConfig, CookieConsent, DEFAULT_CONSENT, COOKIE_CATEGORIES } from './cookies';

// Server-side cookie utilities
export class ServerCookieManager {
  static async getCookie(name: string): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
  }

  static async setCookie(name: string, value: string, options?: Partial<CookieConfig['options']>): Promise<void> {
    const cookieStore = await cookies();
    const config = COOKIE_CONFIGS[name];
    
    if (!config) {
      throw new Error(`Cookie configuration not found for: ${name}`);
    }

    const cookieOptions = {
      ...config.options,
      ...options
    };

    cookieStore.set(name, value, cookieOptions);
  }

  static async deleteCookie(name: string): Promise<void> {
    const cookieStore = await cookies();
    const config = COOKIE_CONFIGS[name];
    
    if (!config) {
      throw new Error(`Cookie configuration not found for: ${name}`);
    }

    cookieStore.set(name, '', {
      ...config.options,
      maxAge: 0,
      expires: new Date(0)
    });
  }

  static async getConsent(): Promise<CookieConsent> {
    const consentStr = await this.getCookie('hippo_cookie_consent');
    if (!consentStr) {
      return DEFAULT_CONSENT;
    }

    try {
      return JSON.parse(consentStr);
    } catch {
      return DEFAULT_CONSENT;
    }
  }

  static async setConsent(consent: CookieConsent): Promise<void> {
    await this.setCookie('hippo_cookie_consent', JSON.stringify(consent));
  }

  static async canSetCookie(name: string): Promise<boolean> {
    const consent = await this.getConsent();
    const category = COOKIE_CATEGORIES[name];
    
    if (!category) {
      return false; // Unknown cookie
    }

    return consent[category];
  }
}
