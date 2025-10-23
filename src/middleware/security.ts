import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityLogger } from '@/lib/securityLogger';

// Security headers configuration
export function addSecurityHeaders(response: NextResponse, req?: NextRequest): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - Start with report-only mode for monitoring
  const isProduction = process.env.NODE_ENV === 'production';
  const cspMode = process.env.CSP_MODE || 'report-only'; // 'enforce' or 'report-only'
  
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com 'strict-dynamic'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.example.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "media-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
    "require-trusted-types-for 'script'",
    "trusted-types 'none'"
  ];
  
  if (isProduction && cspMode === 'enforce') {
    response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  } else {
    // Report-only mode for monitoring
    response.headers.set('Content-Security-Policy-Report-Only', cspDirectives.join('; '));
  }
  
  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // Additional security headers for enhanced protection
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Cache control for sensitive pages
  if (req && (req.nextUrl.pathname.includes('/admin') || req.nextUrl.pathname.includes('/api/auth'))) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  // Strict Transport Security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

// Security monitoring function
export function monitorSecurityEvent(req: NextRequest, eventType: string, details: Record<string, any> = {}): void {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  securityLogger.logEvent({
    type: eventType as any,
    severity: 'medium',
    ip,
    userAgent,
    endpoint: req.nextUrl.pathname,
    method: req.method,
    details
  });
}

// CORS configuration
export function corsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add your production domains here
    // 'https://yourdomain.com'
  ];

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  if (isAllowedOrigin && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
    // Do not set Allow-Credentials when using wildcard per CORS spec
  }

  return headers;
}

// Handle preflight requests
export function handleCorsPreflight(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const headers = corsHeaders(origin || undefined);
    
    const response = new NextResponse(null, { status: 200 });
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return addSecurityHeaders(response, request);
  }
  
  return null;
}

// Input sanitization helper
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// SQL injection prevention (for MongoDB, this is mainly for future compatibility)
export function preventInjection(input: string): string {
  // Remove common SQL injection patterns
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(--|\/\*|\*\/)/g,
    /(;|\|)/g
  ];
  
  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}
