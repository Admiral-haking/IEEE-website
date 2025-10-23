import { z } from 'zod';

// Accept absolute URLs (http/https) or site-relative paths (e.g., /api/media/123)
const UrlOrRelativePath = z.union([z.string().url(), z.string().regex(/^\//)]);
const OptionalUrlOrRelativePath = z.preprocess((v) => {
  if (typeof v === 'string' && v.trim() === '') return undefined;
  return v;
}, UrlOrRelativePath).optional();

export const DisciplineEnum = z.enum(['software','hardware','networking']);

// Optional slug: empty string -> undefined, otherwise non-empty string
const OptionalSlug = z.preprocess((v) => {
  if (typeof v === 'string') {
    const t = v.trim();
    return t.length ? t : undefined;
  }
  return v;
}, z.string().min(1).optional());

export const CreateMemberSchema = z.object({
  name: z.string().min(1),
  slug: OptionalSlug,
  role: z.string().min(1),
  discipline: DisciplineEnum,
  email: z.string().email().optional(),
  avatarUrl: OptionalUrlOrRelativePath,
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  socials: z.object({ github: z.string().url().or(z.literal('')).optional(), linkedin: z.string().url().or(z.literal('')).optional(), twitter: z.string().url().or(z.literal('')).optional(), website: z.string().url().or(z.literal('')).optional() }).partial().optional(),
  portfolioLink: z.string().url().optional(),
  resumeFileId: z.string().optional(),
  locale: z.enum(['en','fa'])
});

export const UpdateMemberSchema = z.object({
  name: z.string().min(1).optional(),
  slug: OptionalSlug,
  role: z.string().min(1).optional(),
  discipline: DisciplineEnum.optional(),
  email: z.string().email().optional(),
  avatarUrl: OptionalUrlOrRelativePath,
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  socials: z.object({ github: z.string().url().or(z.literal('')).optional(), linkedin: z.string().url().or(z.literal('')).optional(), twitter: z.string().url().or(z.literal('')).optional(), website: z.string().url().or(z.literal('')).optional() }).partial().optional(),
  portfolioLink: z.string().url().optional(),
  resumeFileId: z.string().optional(),
  locale: z.enum(['en','fa']).optional()
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
