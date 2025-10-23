import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { getStats, updateStats, deleteStats } from '@/server/stats/service';
import { AppError } from '@/server/errors';
import { UpdateStatsSchema } from '@/server/stats/validators';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const stats = await getStats(id);
    if (!stats) {
      return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
    }
    return NextResponse.json(stats);
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
    const validatedData = UpdateStatsSchema.parse(body);
    const stats = await updateStats(id, validatedData);
    if (!stats) {
      return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
    }
    return NextResponse.json(stats);
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const stats = await deleteStats(id);
    if (!stats) {
      return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Stats deleted successfully' });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
