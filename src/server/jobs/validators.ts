import { z } from 'zod';

export const CreateJobSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  location: z.string().optional().default('Remote'),
  type: z.enum(['full-time','part-time','contract','internship']).optional().default('full-time'),
  descriptionHtml: z.string().optional().default(''),
  requirements: z.array(z.string()).optional().default([]),
  applyLink: z.string().url().optional(),
  imageFileId: z.string().optional(),
  published: z.boolean().optional().default(false),
  locale: z.enum(['en','fa'])
});

export const UpdateJobSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  location: z.string().optional(),
  type: z.enum(['full-time','part-time','contract','internship']).optional(),
  descriptionHtml: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  applyLink: z.string().url().optional(),
  imageFileId: z.string().optional(),
  published: z.boolean().optional(),
  locale: z.enum(['en','fa']).optional()
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
