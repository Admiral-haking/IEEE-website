import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/server/auth/service';
import { 
  getAccessTokenCookieValue, 
  getRefreshTokenCookieValue, 
  AccessTokenCookie, 
  RefreshTokenCookie 
} from '@/server/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const accessToken = await getAccessTokenCookieValue();
    const refreshToken = await getRefreshTokenCookieValue();
    
    await logoutUser(accessToken, refreshToken);
    
    const res = NextResponse.json({ success: true });
    
    // Clear both cookies
    res.cookies.set(AccessTokenCookie.name, '', { 
      ...AccessTokenCookie.options, 
      maxAge: 0 
    });
    res.cookies.set(RefreshTokenCookie.name, '', { 
      ...RefreshTokenCookie.options, 
      maxAge: 0 
    });
    
    return res;
  } catch (err: any) {
    // Even if logout fails, clear cookies
    const res = NextResponse.json({ success: true });
    
    res.cookies.set(AccessTokenCookie.name, '', { 
      ...AccessTokenCookie.options, 
      maxAge: 0 
    });
    res.cookies.set(RefreshTokenCookie.name, '', { 
      ...RefreshTokenCookie.options, 
      maxAge: 0 
    });
    
    return res;
  }
}
