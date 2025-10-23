import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { listSolutions, createSolution } from '@/server/solutions/service';
import { AppError } from '@/server/errors';
import { CreateSolutionSchema } from '@/server/solutions/validators';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const locale = (searchParams.get('locale') as 'en'|'fa') || undefined;
    const data = await listSolutions({ q, page, pageSize, locale });
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
    const input = CreateSolutionSchema.parse(json);
    // auto-generate slug if not provided
    let { slug } = json as any;
    if (!slug && input.title) {
      const base = input.title.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      let candidate = base; let i = 1;
      while (await (await import('@/models/Solution')).default.findOne({ slug: candidate, locale: input.locale }).lean()) { i += 1; candidate = `${base}-${i}`; }
      slug = candidate;
    }
    const created = await createSolution({ ...input, slug } as any);
    return NextResponse.json({ solution: created }, { status: 201 });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
