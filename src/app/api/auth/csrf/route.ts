import { NextRequest, NextResponse } from 'next/server';
import { initializeCSRF } from '@/server/auth/csrf';
import { apiRateLimit } from '@/middleware/rateLimiter';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = apiRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  try {
    const token = await initializeCSRF();
    
    return NextResponse.json({
      success: true,
      csrfToken: token
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
