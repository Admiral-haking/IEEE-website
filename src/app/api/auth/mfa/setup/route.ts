import { NextRequest, NextResponse } from 'next/server';
import { generateMFASecret } from '@/server/auth/mfa';
import { getAccessTokenFromCookies } from '@/server/auth/jwt';
import { AppError } from '@/server/errors';
import { requireAdmin } from '@/server/auth/guard';
import { adminRateLimit } from '@/middleware/rateLimiter';

export async function POST(req: NextRequest) {
  // Apply rate limiting for admin endpoints
  const rateLimitResponse = adminRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  try {
    // Only admins can set up MFA
    const token = await requireAdmin();
    
    const result = await generateMFASecret(token.sub);
    
    return NextResponse.json({
      success: true,
      data: {
        qrCodeUrl: result.qrCodeUrl,
        backupCodes: result.backupCodes,
        tempToken: result.tempToken
      }
    });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
