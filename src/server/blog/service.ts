import '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';
import { AppError } from '@/server/errors';
import { CreatePostInput, UpdatePostInput } from './validators';

export async function listPosts(opts: { q?: string; page?: number; pageSize?: number; locale?: 'en'|'fa' }) {
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 10));
  const query: any = {};
  if (opts.locale) query.locale = opts.locale;
  if (opts.q) {
    query.$or = [
      { title: { $regex: opts.q, $options: 'i' } },
      { excerpt: { $regex: opts.q, $options: 'i' } },
      { tags: { $in: [opts.q] } }
    ];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    BlogPost.countDocuments(query)
  ]);
  const safe = items.map((d) => ({ id: String(d._id), title: d.title, slug: d.slug, published: d.published, createdAt: d.createdAt }));
  return { items: safe, total, page, pageSize };
}

export async function createPost(input: CreatePostInput) {
  const exists = await BlogPost.findOne({ slug: input.slug }).lean();
  if (exists) throw new AppError('Slug already exists', 409);
  const created = await BlogPost.create(input);
  return { id: String(created._id), title: created.title, slug: created.slug, published: created.published };
}

export async function updatePost(id: string, input: UpdatePostInput) {
  if (input.slug) {
    const dup = await BlogPost.findOne({ slug: input.slug, _id: { $ne: id } }).lean();
    if (dup) throw new AppError('Slug already exists', 409);
  }
  const updated = await BlogPost.findByIdAndUpdate(id, { $set: input }, { new: true }).lean();
  if (!updated) throw new AppError('Post not found', 404);
  return { id: String(updated._id), title: updated.title, slug: updated.slug, published: updated.published };
}

export async function deletePost(id: string) {
  const res = await BlogPost.findByIdAndDelete(id).lean();
  if (!res) throw new AppError('Post not found', 404);
  return { ok: true };
}
