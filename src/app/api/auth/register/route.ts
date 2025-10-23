import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema } from '@/server/auth/validators';
import { registerUser } from '@/server/auth/service';
import { AppError } from '@/server/errors';
import { AccessTokenCookie, RefreshTokenCookie } from '@/server/auth/jwt';
import { authRateLimit } from '@/middleware/rateLimiter';

export async function POST(req: NextRequest) {
  // Apply rate limiting for authentication endpoints
  const rateLimitResponse = authRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  try {
    const json = await req.json();
    const input = RegisterSchema.parse(json);
    const { user, accessToken, refreshToken } = await registerUser(input);
    const res = NextResponse.json({ user }, { status: 201 });
    
    // Set both access and refresh tokens as HttpOnly cookies
    res.cookies.set(AccessTokenCookie.name, accessToken, AccessTokenCookie.options);
    res.cookies.set(RefreshTokenCookie.name, refreshToken, RefreshTokenCookie.options);
    
    return res;
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

