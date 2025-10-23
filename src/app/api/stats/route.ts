import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { listStats, createStats, getVisibleStats, reorderStats } from '@/server/stats/service';
import { AppError } from '@/server/errors';
import { CreateStatsSchema, ReorderStatsSchema } from '@/server/stats/validators';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicAccess = searchParams.get('public') === 'true';
    const locale = (searchParams.get('locale') as 'en'|'fa') || undefined;
    
    console.log('Stats route called with publicAccess:', publicAccess, 'locale:', locale);
    
    if (publicAccess) {
      // Public access - only visible stats
      try {
        const stats = await getVisibleStats(locale);
        console.log('Stats fetched successfully:', stats.length);
        const res = NextResponse.json({ items: stats });
        console.log('Response created successfully');
        res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        console.log('Headers set successfully');
        return res;
      } catch (error: any) {
        console.error('Error in getVisibleStats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats', details: error.message }, { status: 500 });
      }
    }
    
    // Admin access
    await requireAdmin();
    const q = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category') || undefined;
    const visible = searchParams.get('visible') === 'true' ? true : searchParams.get('visible') === 'false' ? false : undefined;
    
    const data = await listStats({ 
      q, 
      page, 
      pageSize, 
      locale, 
      category, 
      visible 
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
    
    // Check if it's a reorder request
    if (body.statIds) {
      const validatedData = ReorderStatsSchema.parse(body);
      await reorderStats(validatedData.statIds);
      return NextResponse.json({ message: 'Stats reordered successfully' });
    }
    
    // Regular create request
    const validatedData = CreateStatsSchema.parse(body);
    const stats = await createStats(validatedData);
    return NextResponse.json(stats);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
