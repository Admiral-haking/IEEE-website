import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { getNews, updateNews, deleteNews, incrementViewCount } from '@/server/news/service';
import { AppError } from '@/server/errors';
import { UpdateNewsSchema } from '@/server/news/validators';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const increment = searchParams.get('increment') === 'true';
    
    if (increment) {
      await incrementViewCount(id);
    }
    
    const news = await getNews(id);
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const validatedData = UpdateNewsSchema.parse(body);
    const news = await updateNews(id, validatedData);
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const news = await deleteNews(id);
    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
