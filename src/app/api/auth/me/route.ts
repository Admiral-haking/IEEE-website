import { NextResponse } from 'next/server';
import { getTokenFromCookies } from '@/server/auth/jwt';
import { UnauthorizedError } from '@/server/errors';
import User from '@/models/User';

export async function GET() {
  try {
    const token = await getTokenFromCookies();
    const user = await User.findById(token.sub).lean();
    if (!user) throw new UnauthorizedError();
    return NextResponse.json({ user: { id: String(user._id), email: user.email, name: user.name, role: user.role } });
  } catch (err: any) {
    const status = err.status || 401;
    return NextResponse.json({ error: 'Unauthorized' }, { status });
  }
}

