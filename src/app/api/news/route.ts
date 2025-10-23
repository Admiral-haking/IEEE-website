import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { listNews, createNews } from '@/server/news/service';
import { AppError } from '@/server/errors';
import { CreateNewsSchema } from '@/server/news/validators';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const locale = (searchParams.get('locale') as 'en'|'fa') || undefined;
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined;
    const priority = searchParams.get('priority') || undefined;
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;
    
    const data = await listNews({ 
      q, 
      page, 
      pageSize, 
      locale, 
      type, 
      category, 
      status, 
      featured, 
      priority, 
      dateFrom, 
      dateTo 
    });
    return NextResponse.json(data);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const validatedData = CreateNewsSchema.parse(body);
    const news = await createNews(validatedData);
    return NextResponse.json(news);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
