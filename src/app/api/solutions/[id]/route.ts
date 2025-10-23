import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { updateSolution, deleteSolution } from '@/server/solutions/service';
import { AppError } from '@/server/errors';
import { UpdateSolutionSchema } from '@/server/solutions/validators';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const json = await req.json();
    const input = UpdateSolutionSchema.parse(json);
    const { id } = await params;
    const updated = await updateSolution(id, input);
    return NextResponse.json({ solution: updated });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteSolution(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
