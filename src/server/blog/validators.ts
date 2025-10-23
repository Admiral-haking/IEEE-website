import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  coverFileId: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  author: z.string().optional(),
  locale: z.enum(['en','fa'])
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  contentHtml: z.string().optional(),
  coverFileId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  author: z.string().optional(),
  locale: z.enum(['en','fa']).optional()
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
