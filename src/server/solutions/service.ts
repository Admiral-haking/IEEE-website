import '@/lib/mongoose';
import Solution from '@/models/Solution';
import { AppError } from '@/server/errors';
import { CreateSolutionInput, UpdateSolutionInput } from './validators';

export async function listSolutions(opts: { q?: string; page?: number; pageSize?: number; locale?: 'en'|'fa' }) {
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 10));
  const query: any = {};
  if (opts.locale) query.locale = opts.locale;
  if (opts.q) {
    query.$or = [
      { title: { $regex: opts.q, $options: 'i' } },
      { summary: { $regex: opts.q, $options: 'i' } }
    ];
  }
  const [items, total] = await Promise.all([
    Solution.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Solution.countDocuments(query)
  ]);
  return { items: items.map(toDto), total, page, pageSize };
}

export async function createSolution(input: CreateSolutionInput) {
  const created = await Solution.create(input);
  return toDto(created.toObject());
}

export async function updateSolution(id: string, input: UpdateSolutionInput) {
  const updated = await Solution.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();
  if (!updated) throw new AppError('Solution not found', 404);
  return toDto(updated);
}

export async function deleteSolution(id: string) {
  const res = await Solution.findByIdAndDelete(id).lean();
  if (!res) throw new AppError('Solution not found', 404);
  return { ok: true };
}

function toDto(doc: any) {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    summary: doc.summary || '',
    contentHtml: doc.contentHtml || '',
    imageFileId: doc.imageFileId,
    locale: doc.locale,
    published: !!doc.published
  };
}
