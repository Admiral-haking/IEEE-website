import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { getPage, updatePage } from '@/server/pages/service';
import { AppError } from '@/server/errors';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const key = (searchParams.get('key') as 'privacy'|'terms'|'contact') || 'privacy';
    const locale = (searchParams.get('locale') as 'en'|'fa') || 'en';
    const page = await getPage(key, locale);
    return NextResponse.json(page);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const key = (searchParams.get('key') as 'privacy'|'terms'|'contact') || 'privacy';
    const locale = (searchParams.get('locale') as 'en'|'fa') || 'en';
    const json = await req.json();
    const page = await updatePage(key, locale, json);
    return NextResponse.json(page);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

