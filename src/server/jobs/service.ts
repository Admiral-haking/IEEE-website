import '@/lib/mongoose';
import Job from '@/models/Job';
import { AppError } from '@/server/errors';
import { CreateJobInput, UpdateJobInput } from './validators';

export async function listJobs(opts: { q?: string; page?: number; pageSize?: number; locale?: 'en'|'fa' }) {
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 10));
  const query: any = {};
  if (opts.locale) query.locale = opts.locale;
  if (opts.q) {
    query.$or = [
      { title: { $regex: opts.q, $options: 'i' } },
      { location: { $regex: opts.q, $options: 'i' } }
    ];
  }
  const [items, total] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Job.countDocuments(query)
  ]);
  const safe = items.map((d) => ({ id: String(d._id), title: d.title, slug: d.slug, type: d.type, location: d.location, published: d.published }));
  return { items: safe, total, page, pageSize };
}

export async function createJob(input: CreateJobInput) {
  const exists = await Job.findOne({ slug: input.slug }).lean();
  if (exists) throw new AppError('Slug already exists', 409);
  const created = await Job.create(input);
  return { id: String(created._id), title: created.title, slug: created.slug, published: created.published };
}

export async function updateJob(id: string, input: UpdateJobInput) {
  if (input.slug) {
    const dup = await Job.findOne({ slug: input.slug, _id: { $ne: id } }).lean();
    if (dup) throw new AppError('Slug already exists', 409);
  }
  const updated = await Job.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();
  if (!updated) throw new AppError('Job not found', 404);
  return { id: String(updated._id), title: updated.title, slug: updated.slug, published: updated.published };
}

export async function deleteJob(id: string) {
  const res = await Job.findByIdAndDelete(id).lean();
  if (!res) throw new AppError('Job not found', 404);
  return { ok: true };
}
