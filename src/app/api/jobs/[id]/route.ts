import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { updateJob, deleteJob } from '@/server/jobs/service';
import { AppError } from '@/server/errors';
import { UpdateJobSchema } from '@/server/jobs/validators';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const json = await req.json();
    const input = UpdateJobSchema.parse(json);
    const { id } = await params;
    const updated = await updateJob(id, input);
    return NextResponse.json({ job: updated });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteJob(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
