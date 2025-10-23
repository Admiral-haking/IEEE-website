import '@/lib/mongoose';
import User from '@/models/User';
import { AppError } from '@/server/errors';
import { CreateUserInput, UpdateUserInput } from './validators';
import { hashPassword } from '@/server/auth/hash';

export async function listUsers(opts: { q?: string; page?: number; pageSize?: number }) {
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 10));
  const query: any = {};
  if (opts.q) {
    query.$or = [
      { name: { $regex: opts.q, $options: 'i' } },
      { email: { $regex: opts.q, $options: 'i' } }
    ];
  }
  const [items, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    User.countDocuments(query)
  ]);
  const safe = items.map((u) => ({ id: String(u._id), email: u.email, name: u.name, role: u.role, createdAt: u.createdAt }));
  return { items: safe, total, page, pageSize };
}

export async function createUser(input: CreateUserInput) {
  const exists = await User.findOne({ email: input.email }).lean();
  if (exists) throw new AppError('Email already exists', 409);
  const passwordHash = await hashPassword(input.password);
  const created = await User.create({ email: input.email, name: input.name, passwordHash, role: input.role });
  return { id: String(created._id), email: created.email, name: created.name, role: created.role, createdAt: created.createdAt };
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const doc: any = {};
  if (input.name !== undefined) doc.name = input.name;
  if (input.email !== undefined) doc.email = input.email;
  if (input.role !== undefined) doc.role = input.role;
  if (input.password) doc.passwordHash = await hashPassword(input.password);
  if (doc.email) {
    const dup = await User.findOne({ email: doc.email, _id: { $ne: id } }).lean();
    if (dup) throw new AppError('Email already exists', 409);
  }
  const updated = await User.findByIdAndUpdate(id, { $set: doc }, { new: true }).lean();
  if (!updated) throw new AppError('User not found', 404);
  return { id: String(updated._id), email: updated.email, name: updated.name, role: updated.role };
}

export async function deleteUser(id: string) {
  const res = await User.findByIdAndDelete(id).lean();
  if (!res) throw new AppError('User not found', 404);
  return { ok: true };
}

