import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@/server/auth/validators';
import { loginUser } from '@/server/auth/service';
import { isMFAEnabled } from '@/server/auth/mfa';
import { AppError } from '@/server/errors';
import { AccessTokenCookie, RefreshTokenCookie } from '@/server/auth/jwt';
import { authRateLimit } from '@/middleware/rateLimiter';
import { z } from 'zod';

const LoginWithMFASchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  mfaToken: z.string().optional(),
  rememberMe: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  // Apply rate limiting for authentication endpoints
  const rateLimitResponse = authRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  try {
    const json = await req.json();
    const input = LoginWithMFASchema.parse(json);
    
    // First, verify credentials
    const { user, accessToken, refreshToken } = await loginUser({
      email: input.email,
      password: input.password
    });
    
    // Check if MFA is enabled for this user
    const mfaEnabled = await isMFAEnabled(user.id);
    
    if (mfaEnabled) {
      if (!input.mfaToken) {
        // MFA is required but token not provided
        return NextResponse.json({
          success: false,
          mfaRequired: true,
          message: 'MFA token is required'
        }, { status: 200 }); // 200 because credentials are valid
      }
      
      // Verify MFA token
      const { verifyMFAToken } = await import('@/server/auth/mfa');
      const mfaValid = await verifyMFAToken(user.id, input.mfaToken);
      
      if (!mfaValid) {
        return NextResponse.json({
          success: false,
          error: 'Invalid MFA token'
        }, { status: 401 });
      }
    }
    
    // All checks passed, set cookies and return user
    const res = NextResponse.json({ 
      success: true,
      user 
    });
    
    // Set cookie options based on remember me preference
    const cookieOptions = {
      ...AccessTokenCookie.options,
      maxAge: input.rememberMe ? 30 * 24 * 60 * 60 : undefined // 30 days if remember me
    };
    const refreshCookieOptions = {
      ...RefreshTokenCookie.options,
      maxAge: input.rememberMe ? 30 * 24 * 60 * 60 : undefined // 30 days if remember me
    };
    
    res.cookies.set(AccessTokenCookie.name, accessToken, cookieOptions);
    res.cookies.set(RefreshTokenCookie.name, refreshToken, refreshCookieOptions);
    
    return res;
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

