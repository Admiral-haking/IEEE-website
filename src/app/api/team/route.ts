import { NextRequest, NextResponse } from 'next/server';
import '@/lib/mongoose';
import TeamMember from '@/models/TeamMember';
import { requireAdmin } from '@/server/auth/guard';
import { AppError } from '@/server/errors';
import { CreateMemberSchema } from '@/server/team/validators';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const locale = searchParams.get('locale') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '20');
    const query: any = {};
    if (locale) query.locale = locale;
    if (q) query.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { role: { $regex: q, $options: 'i' } }];
    const [members, total] = await Promise.all([
      TeamMember.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
      TeamMember.countDocuments(query)
    ]);
    return NextResponse.json({ items: members.map((m) => ({ ...m, id: String(m._id) })), total, page, pageSize });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

function slugify(base: string) {
  return base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const json = await req.json();
    const input = CreateMemberSchema.parse(json);
    let slug = (json as any).slug as string | undefined;
    if (!slug && input.name) {
      const base = slugify(input.name);
      let candidate = base;
      let i = 1;
      // ensure unique per locale
      while (await TeamMember.findOne({ slug: candidate, locale: input.locale }).lean()) {
        i += 1;
        candidate = `${base}-${i}`;
      }
      slug = candidate;
    }
    const created = await TeamMember.create({ ...input, slug });
    return NextResponse.json({ member: { ...created.toObject(), id: String(created._id) } }, { status: 201 });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json({ error: err.message || 'Failed to create member' }, { status });
  }
}
