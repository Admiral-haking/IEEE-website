import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { listFiles, saveBase64File } from '@/server/media/gridfs';
import { AppError } from '@/server/errors';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '100');
    const files = await listFiles(pageSize, (page - 1) * pageSize);
    return NextResponse.json({ items: files });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name, contentType, data } = await req.json();
    const file = await saveBase64File(name, contentType || 'application/octet-stream', data);
    return NextResponse.json({ file }, { status: 201 });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

