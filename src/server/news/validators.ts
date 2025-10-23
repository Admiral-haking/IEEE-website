import { z } from 'zod';

export const CreateNewsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  titleEn: z.string().max(200, 'English title too long').optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
  excerptEn: z.string().max(500, 'English excerpt too long').optional(),
  content: z.string().min(1, 'Content is required'),
  contentEn: z.string().optional(),
  contentHtml: z.string().min(1, 'HTML content is required'),
  contentHtmlEn: z.string().optional(),
  type: z.enum(['news', 'achievement', 'announcement', 'publication', 'award', 'event']),
  category: z.enum(['academic', 'research', 'social', 'professional', 'technical', 'general']),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  imageAlt: z.string().max(200, 'Image alt text too long').optional(),
  imageAltEn: z.string().max(200, 'English image alt text too long').optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).optional(),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  authorEn: z.string().max(100, 'English author name too long').optional(),
  publishedAt: z.string().datetime().transform((str) => new Date(str)).optional(),
  locale: z.enum(['fa', 'en']),
  createdBy: z.string().min(1, 'Created by is required'),
  updatedBy: z.string().min(1, 'Updated by is required')
});

export const UpdateNewsSchema = CreateNewsSchema.partial().omit({ createdBy: true });

export type CreateNewsInput = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsInput = z.infer<typeof UpdateNewsSchema>;
