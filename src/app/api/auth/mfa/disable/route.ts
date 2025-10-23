import { NextRequest, NextResponse } from 'next/server';
import { disableMFA } from '@/server/auth/mfa';
import { AppError } from '@/server/errors';
import { requireAdmin } from '@/server/auth/guard';
import { adminRateLimit } from '@/middleware/rateLimiter';
import { z } from 'zod';

const DisableMFASchema = z.object({
  password: z.string().min(1, 'Password is required')
});

export async function POST(req: NextRequest) {
  // Apply rate limiting for admin endpoints
  const rateLimitResponse = adminRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  try {
    // Only admins can disable MFA
    const token = await requireAdmin();
    
    const json = await req.json();
    const { password } = DisableMFASchema.parse(json);
    
    const disabled = await disableMFA(token.sub, password);
    
    if (disabled) {
      return NextResponse.json({
        success: true,
        message: 'MFA has been successfully disabled'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to disable MFA'
      }, { status: 400 });
    }
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
