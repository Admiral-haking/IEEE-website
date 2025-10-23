import * as crypto from 'crypto';
import { cookies } from 'next/headers';

const CSRF_COOKIE_NAME = 'hippo_csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Set CSRF token in cookie
export async function setCSRFToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // CSRF token needs to be accessible to JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

// Get CSRF token from cookie
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null;
}

// Verify CSRF token
export async function verifyCSRFToken(headerToken: string): Promise<boolean> {
  const cookieToken = await getCSRFToken();
  if (!cookieToken || !headerToken) {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken, 'hex'),
    Buffer.from(headerToken, 'hex')
  );
}

// CSRF protection middleware
export async function requireCSRFToken(req: Request): Promise<boolean> {
  const method = req.method;
  
  // Only protect state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }
  
  const headerToken = req.headers.get(CSRF_HEADER_NAME);
  if (!headerToken) {
    return false;
  }
  
  return await verifyCSRFToken(headerToken);
}

// Generate and set CSRF token for new sessions
export async function initializeCSRF(): Promise<string> {
  const token = generateCSRFToken();
  await setCSRFToken(token);
  return token;
}

// CSRF token validation for API routes
export async function validateCSRFToken(req: Request): Promise<{ valid: boolean; token?: string }> {
  const method = req.method;
  
  // Skip CSRF for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }
  
  const headerToken = req.headers.get(CSRF_HEADER_NAME);
  if (!headerToken) {
    return { valid: false };
  }
  
  const isValid = await verifyCSRFToken(headerToken);
  if (isValid) {
    return { valid: true };
  }
  
  // Generate new token for retry
  const newToken = generateCSRFToken();
  await setCSRFToken(newToken);
  
  return { valid: false, token: newToken };
}
