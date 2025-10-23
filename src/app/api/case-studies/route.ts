import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { listCases, createCase } from '@/server/case-studies/service';
import { AppError } from '@/server/errors';
import { CreateCaseSchema } from '@/server/case-studies/validators';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const locale = (searchParams.get('locale') as 'en'|'fa') || undefined;
    const data = await listCases({ q, page, pageSize, locale });
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
    const input = CreateCaseSchema.parse(json);
    const created = await createCase(input);
    return NextResponse.json({ case: created }, { status: 201 });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
