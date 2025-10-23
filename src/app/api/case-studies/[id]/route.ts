import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { updateCase, deleteCase } from '@/server/case-studies/service';
import { AppError } from '@/server/errors';
import { UpdateCaseSchema } from '@/server/case-studies/validators';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const json = await req.json();
    const input = UpdateCaseSchema.parse(json);
    const { id } = await params;
    const updated = await updateCase(id, input);
    return NextResponse.json({ case: updated });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteCase(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
