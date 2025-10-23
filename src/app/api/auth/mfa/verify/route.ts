import { NextRequest, NextResponse } from 'next/server';
import { verifyMFASetup } from '@/server/auth/mfa';
import { getAccessTokenFromCookies } from '@/server/auth/jwt';
import { AppError } from '@/server/errors';
import { requireAdmin } from '@/server/auth/guard';
import { adminRateLimit } from '@/middleware/rateLimiter';
import { z } from 'zod';

const VerifyMFASchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
  tempToken: z.string().min(1, 'Temporary token is required')
});

export async function POST(req: NextRequest) {
  // Apply rate limiting for admin endpoints
  const rateLimitResponse = adminRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  try {
    // Only admins can verify MFA
    const token = await requireAdmin();
    
    const json = await req.json();
    const { token: mfaToken, tempToken } = VerifyMFASchema.parse(json);
    
    const verified = await verifyMFASetup(token.sub, mfaToken, tempToken);
    
    if (verified) {
      return NextResponse.json({
        success: true,
        message: 'MFA has been successfully enabled'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid MFA token'
      }, { status: 400 });
    }
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
