import '@/lib/mongoose';
import CaseStudy from '@/models/CaseStudy';
import { AppError } from '@/server/errors';
import { CreateCaseInput, UpdateCaseInput } from './validators';

export async function listCases(opts: { q?: string; page?: number; pageSize?: number; locale?: 'en'|'fa' }) {
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 10));
  const query: any = {};
  if (opts.locale) query.locale = opts.locale;
  if (opts.q) {
    query.$or = [
      { title: { $regex: opts.q, $options: 'i' } },
      { summary: { $regex: opts.q, $options: 'i' } },
      { client: { $regex: opts.q, $options: 'i' } }
    ];
  }
  const [items, total] = await Promise.all([
    CaseStudy.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    CaseStudy.countDocuments(query)
  ]);
  const safe = items.map((d) => ({ id: String(d._id), title: d.title, slug: d.slug, published: d.published, client: d.client }));
  return { items: safe, total, page, pageSize };
}

export async function createCase(input: CreateCaseInput) {
  const exists = await CaseStudy.findOne({ slug: input.slug }).lean();
  if (exists) throw new AppError('Slug already exists', 409);
  const created = await CaseStudy.create({ ...input, date: input.date ? new Date(input.date) : undefined });
  return { id: String(created._id), title: created.title, slug: created.slug, published: created.published };
}

export async function updateCase(id: string, input: UpdateCaseInput) {
  if (input.slug) {
    const dup = await CaseStudy.findOne({ slug: input.slug, _id: { $ne: id } }).lean();
    if (dup) throw new AppError('Slug already exists', 409);
  }
  const updated = await CaseStudy.findByIdAndUpdate(id, { $set: { ...input, date: input.date ? new Date(input.date) : undefined } }, { new: true }).lean();
  if (!updated) throw new AppError('Case not found', 404);
  return { id: String(updated._id), title: updated.title, slug: updated.slug, published: updated.published };
}

export async function deleteCase(id: string) {
  const res = await CaseStudy.findByIdAndDelete(id).lean();
  if (!res) throw new AppError('Case not found', 404);
  return { ok: true };
}
