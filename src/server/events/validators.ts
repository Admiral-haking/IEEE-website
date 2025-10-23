import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  titleEn: z.string().max(200, 'English title too long').optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  descriptionEn: z.string().max(1000, 'English description too long').optional(),
  date: z.string().datetime().transform((str) => new Date(str)),
  time: z.string().min(1, 'Time is required').max(10, 'Time format invalid'),
  location: z.string().max(200, 'Location too long').optional(),
  locationEn: z.string().max(200, 'English location too long').optional(),
  type: z.enum(['workshop', 'seminar', 'conference', 'contest', 'meeting', 'other']),
  category: z.enum(['academic', 'research', 'social', 'professional', 'technical']),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
  maxParticipants: z.number().min(1, 'Max participants must be at least 1').optional(),
  registrationRequired: z.boolean().optional(),
  registrationDeadline: z.string().datetime().transform((str) => new Date(str)).optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactPhone: z.string().max(20, 'Phone number too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).optional(),
  contentHtml: z.string().optional(),
  contentHtmlEn: z.string().optional(),
  locale: z.enum(['fa', 'en']),
  createdBy: z.string().min(1, 'Created by is required'),
  updatedBy: z.string().min(1, 'Updated by is required')
});

export const UpdateEventSchema = CreateEventSchema.partial().omit({ createdBy: true });

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
