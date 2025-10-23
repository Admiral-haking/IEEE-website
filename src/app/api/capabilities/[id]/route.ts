import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { updateCapability, deleteCapability } from '@/server/capabilities/service';
import { AppError } from '@/server/errors';
import { UpdateCapabilitySchema } from '@/server/capabilities/validators';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const json = await req.json();
    const input = UpdateCapabilitySchema.parse(json);
    const { id } = await params;
    const updated = await updateCapability(id, input);
    return NextResponse.json({ capability: updated });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteCapability(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}
