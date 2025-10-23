import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UnauthorizedError } from '@/server/errors';
import * as crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in your .env.local file.');
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required. Please set it in your .env.local file.');
}

// Ensure secrets are defined for TypeScript
const SECRET = JWT_SECRET as string;
const REFRESH_SECRET = JWT_REFRESH_SECRET as string;

const ACCESS_TOKEN_COOKIE = 'hippo_access_token';
const REFRESH_TOKEN_COOKIE = 'hippo_refresh_token';

export type TokenPayload = { 
  sub: string; 
  role: 'member' | 'user' | 'admin'; 
  email: string;
  jti?: string; // JWT ID for token tracking
  scope: string[]; // Array of permissions/scopes
};

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
  type: 'refresh';
};

// Generate secure random JTI
export function generateJTI(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { 
    expiresIn: '15m', // Short-lived access token
    issuer: 'hippogriff',
    audience: 'hippogriff-app'
  });
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { 
    expiresIn: '7d', // Longer-lived refresh token
    issuer: 'hippogriff',
    audience: 'hippogriff-app'
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, SECRET, {
    issuer: 'hippogriff',
    audience: 'hippogriff-app'
  });
  return decoded as TokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, REFRESH_SECRET, {
    issuer: 'hippogriff',
    audience: 'hippogriff-app'
  });
  return decoded as RefreshTokenPayload;
}

export async function getAccessTokenFromCookies() {
  const token = await getAccessTokenCookieValue();
  return verifyAccessToken(token);
}

export async function getRefreshTokenFromCookies() {
  const token = await getRefreshTokenCookieValue();
  return verifyRefreshToken(token);
}

// Import cookie configurations
import { COOKIE_CONFIGS } from '@/lib/cookies';

export const AccessTokenCookie = {
  name: ACCESS_TOKEN_COOKIE,
  options: COOKIE_CONFIGS.accessToken.options
};

export const RefreshTokenCookie = {
  name: REFRESH_TOKEN_COOKIE,
  options: COOKIE_CONFIGS.refreshToken.options
};

export async function getAccessTokenCookieValue(): Promise<string> {
  const token = (await cookies()).get(AccessTokenCookie.name)?.value;
  if (!token) {
    throw new UnauthorizedError();
  }
  return token;
}

export async function getRefreshTokenCookieValue(): Promise<string> {
  const token = (await cookies()).get(RefreshTokenCookie.name)?.value;
  if (!token) {
    throw new UnauthorizedError();
  }
  return token;
}

// Token blacklist for logout functionality
const tokenBlacklist = new Set<string>();

export function blacklistToken(jti: string) {
  tokenBlacklist.add(jti);
}

export function isTokenBlacklisted(jti: string): boolean {
  return tokenBlacklist.has(jti);
}

export function clearExpiredBlacklist() {
  // In production, use Redis with TTL instead of in-memory Set
  // This is a simple implementation for development
}

// Alias for getAccessTokenFromCookies for backward compatibility
export const getTokenFromCookies = getAccessTokenFromCookies;
