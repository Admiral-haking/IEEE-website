import '@/lib/mongoose';
import Capability from '@/models/Capability';
import { AppError } from '@/server/errors';
import { CreateCapabilityInput, UpdateCapabilityInput } from './validators';

export async function listCapabilities(opts: { q?: string; page?: number; pageSize?: number; locale?: 'en'|'fa' }) {
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 10));
  const query: any = {};
  if (opts.locale) query.locale = opts.locale;
  if (opts.q) {
    query.$or = [
      { title: { $regex: opts.q, $options: 'i' } },
      { description: { $regex: opts.q, $options: 'i' } }
    ];
  }
  const [items, total] = await Promise.all([
    Capability.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Capability.countDocuments(query)
  ]);
  return { items: items.map(toDto), total, page, pageSize };
}

export async function createCapability(input: CreateCapabilityInput) {
  const created = await Capability.create(input);
  return toDto(created.toObject());
}

export async function updateCapability(id: string, input: UpdateCapabilityInput) {
  const updated = await Capability.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();
  if (!updated) throw new AppError('Capability not found', 404);
  return toDto(updated);
}

export async function deleteCapability(id: string) {
  const res = await Capability.findByIdAndDelete(id).lean();
  if (!res) throw new AppError('Capability not found', 404);
  return { ok: true };
}

function toDto(doc: any) {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    area: doc.area,
    description: doc.description || '',
    contentHtml: doc.contentHtml || '',
    imageFileId: doc.imageFileId,
    locale: doc.locale
  };
}
