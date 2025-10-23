import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

// Generic validation middleware
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (req: NextRequest): Promise<{ data: T; error: NextResponse | null }> => {
    try {
      const body = await req.json();
      const data = schema.parse(body);
      return { data, error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          },
          { status: 400 }
        );
        return { data: null as any, error: errorResponse };
      }
      
      const errorResponse = NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
      return { data: null as any, error: errorResponse };
    }
  };
}

// Query parameter validation
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: NextRequest): { data: T; error: NextResponse | null } => {
    try {
      const url = new URL(req.url);
      const params = Object.fromEntries(url.searchParams.entries());
      const data = schema.parse(params);
      return { data, error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = NextResponse.json(
          {
            error: 'Query validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          },
          { status: 400 }
        );
        return { data: null as any, error: errorResponse };
      }
      
      const errorResponse = NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
      return { data: null as any, error: errorResponse };
    }
  };
}

// Headers validation
export function validateHeaders<T>(schema: ZodSchema<T>) {
  return (req: NextRequest): { data: T; error: NextResponse | null } => {
    try {
      const headers: Record<string, string> = {};
      req.headers.forEach((value, key) => {
        headers[key] = value;
      });
      const data = schema.parse(headers);
      return { data, error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = NextResponse.json(
          {
            error: 'Header validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          },
          { status: 400 }
        );
        return { data: null as any, error: errorResponse };
      }
      
      const errorResponse = NextResponse.json(
        { error: 'Invalid headers' },
        { status: 400 }
      );
      return { data: null as any, error: errorResponse };
    }
  };
}

// Input sanitization for security
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags
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

// Rate limiting based on validation failures
const validationFailures = new Map<string, { count: number; resetTime: number }>();

export function trackValidationFailure(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxFailures = 10; // Max validation failures per window
  
  const existing = validationFailures.get(ip);
  if (existing && now < existing.resetTime) {
    existing.count++;
    if (existing.count > maxFailures) {
      return true; // Should be rate limited
    }
  } else {
    validationFailures.set(ip, { count: 1, resetTime: now + windowMs });
  }
  
  return false;
}
