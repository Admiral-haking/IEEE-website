import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import TeamMember from '@/models/TeamMember';
import { AppError } from '@/server/errors';
import { UpdateMemberSchema } from '@/server/team/validators';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const json = await req.json();
    const input = UpdateMemberSchema.parse(json);
    const updated = await TeamMember.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();
    if (!updated) throw new AppError('Member not found', 404);
    return NextResponse.json({ member: { ...updated, id: String(updated._id) } });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const res = await TeamMember.findByIdAndDelete(id).lean();
    if (!res) throw new AppError('Member not found', 404);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Bad Request' }, { status });
  }
}

