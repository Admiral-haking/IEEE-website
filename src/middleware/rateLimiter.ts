import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.'
};

export function rateLimiter(config: Partial<RateLimitConfig> = {}) {
  const options = { ...defaultConfig, ...config };

  return (req: NextRequest): NextResponse | null => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of requestCounts.entries()) {
      if (now > value.resetTime) {
        requestCounts.delete(key);
      }
    }

    // Get or create request count for this IP
    const requestData = requestCounts.get(ip) || { count: 0, resetTime: now + options.windowMs };
    
    // Check if limit exceeded
    if (requestData.count >= options.maxRequests && now < requestData.resetTime) {
      return NextResponse.json(
        { error: options.message },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((requestData.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(requestData.resetTime).toISOString()
          }
        }
      );
    }

    // Increment counter
    requestData.count++;
    requestCounts.set(ip, requestData);

    return null; // Allow request to proceed
  };
}

// Pre-configured rate limiters for different endpoints
export const authRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.'
});

export const strictAuthRateLimit = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 login attempts per hour
  message: 'Too many failed authentication attempts, please try again later.'
});

export const apiRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API requests per 15 minutes
  message: 'Too many API requests, please try again later.'
});

export const strictApiRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20, // 20 API requests per 5 minutes
  message: 'Too many API requests, please slow down.'
});

export const uploadRateLimit = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 uploads per hour
  message: 'Too many file uploads, please try again later.'
});

export const passwordResetRateLimit = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 password reset attempts per hour
  message: 'Too many password reset attempts, please try again later.'
});

export const registrationRateLimit = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5, // 5 registration attempts per hour
  message: 'Too many registration attempts, please try again later.'
});

export const adminRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 50, // 50 admin requests per 5 minutes
  message: 'Too many admin requests, please slow down.'
});
