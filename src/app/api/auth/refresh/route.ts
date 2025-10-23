import { NextRequest, NextResponse } from 'next/server';
import { refreshUserTokens } from '@/server/auth/service';
import { getRefreshTokenCookieValue, AccessTokenCookie, RefreshTokenCookie } from '@/server/auth/jwt';
import { AppError } from '@/server/errors';
import { authRateLimit } from '@/middleware/rateLimiter';

export async function POST(req: NextRequest) {
  // Apply rate limiting for authentication endpoints
  const rateLimitResponse = authRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  try {
    const refreshToken = await getRefreshTokenCookieValue();
    const { user, accessToken, refreshToken: newRefreshToken } = await refreshUserTokens(refreshToken);
    
    const res = NextResponse.json({ user });
    
    // Set new tokens as HttpOnly cookies
    res.cookies.set(AccessTokenCookie.name, accessToken, AccessTokenCookie.options);
    res.cookies.set(RefreshTokenCookie.name, newRefreshToken, RefreshTokenCookie.options);
    
    return res;
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 401;
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status });
  }
}
