import { z } from 'zod';

export const CreateCaseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  client: z.string().optional(),
  industry: z.string().optional(),
  date: z.string().optional(),
  coverFileId: z.string().optional(),
  published: z.boolean().optional().default(false),
  locale: z.enum(['en','fa'])
});

export const UpdateCaseSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  summary: z.string().optional(),
  contentHtml: z.string().optional(),
  client: z.string().optional(),
  industry: z.string().optional(),
  date: z.string().optional(),
  coverFileId: z.string().optional(),
  published: z.boolean().optional(),
  locale: z.enum(['en','fa']).optional()
});

export type CreateCaseInput = z.infer<typeof CreateCaseSchema>;
export type UpdateCaseInput = z.infer<typeof UpdateCaseSchema>;
