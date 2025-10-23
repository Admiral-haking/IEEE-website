import { z } from 'zod';

export const CreateStatsSchema = z.object({
  key: z.string().min(1, 'Key is required').max(100, 'Key too long'),
  value: z.union([z.number(), z.string()]),
  label: z.string().min(1, 'Label is required').max(100, 'Label too long'),
  labelEn: z.string().max(100, 'English label too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  descriptionEn: z.string().max(500, 'English description too long').optional(),
  category: z.enum(['members', 'projects', 'publications', 'events', 'achievements', 'general']),
  type: z.enum(['number', 'text', 'percentage', 'currency']),
  unit: z.string().max(20, 'Unit too long').optional(),
  unitEn: z.string().max(20, 'English unit too long').optional(),
  icon: z.string().max(100, 'Icon name too long').optional(),
  color: z.string().max(20, 'Color value too long').optional(),
  order: z.number().min(0, 'Order must be non-negative').optional(),
  visible: z.boolean().optional(),
  locale: z.enum(['fa', 'en']),
  createdBy: z.string().min(1, 'Created by is required'),
  updatedBy: z.string().min(1, 'Updated by is required')
});

export const UpdateStatsSchema = CreateStatsSchema.partial().omit({ createdBy: true });

export const ReorderStatsSchema = z.object({
  statIds: z.array(z.string().min(1, 'Stat ID is required'))
});

export type CreateStatsInput = z.infer<typeof CreateStatsSchema>;
export type UpdateStatsInput = z.infer<typeof UpdateStatsSchema>;
export type ReorderStatsInput = z.infer<typeof ReorderStatsSchema>;
