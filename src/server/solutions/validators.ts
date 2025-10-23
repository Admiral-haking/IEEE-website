import { z } from 'zod';

// Treat empty string slug as undefined to avoid writing ''
const OptionalSlug = z.preprocess((v) => {
  if (typeof v === 'string') {
    const t = v.trim();
    return t.length ? t : undefined;
  }
  return v;
}, z.string().min(1).optional());

export const SolutionCategory = z.enum(['software', 'hardware', 'networking']);

export const CreateSolutionSchema = z.object({
  title: z.string().min(1),
  slug: OptionalSlug,
  category: SolutionCategory,
  summary: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  imageFileId: z.string().optional(),
  locale: z.enum(['en','fa']),
  published: z.boolean().optional().default(false)
});

export const UpdateSolutionSchema = z.object({
  title: z.string().min(1).optional(),
  slug: OptionalSlug,
  category: SolutionCategory.optional(),
  summary: z.string().optional(),
  contentHtml: z.string().optional(),
  imageFileId: z.string().optional(),
  locale: z.enum(['en','fa']).optional(),
  published: z.boolean().optional()
});

export type CreateSolutionInput = z.infer<typeof CreateSolutionSchema>;
export type UpdateSolutionInput = z.infer<typeof UpdateSolutionSchema>;
