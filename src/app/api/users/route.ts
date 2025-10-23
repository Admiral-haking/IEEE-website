import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { listUsers, createUser } from '@/server/users/service';
import { AppError } from '@/server/errors';
import { CreateUserSchema } from '@/server/users/validators';
import { apiRateLimit } from '@/middleware/rateLimiter';

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = apiRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const data = await listUsers({ q, page, pageSize });
    return NextResponse.json(data);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const json = await req.json();
    const input = CreateUserSchema.parse(json);
    const created = await createUser(input);
    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

