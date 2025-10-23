import { z } from 'zod';

const OptionalSlug = z.preprocess((v) => {
  if (typeof v === 'string') {
    const t = v.trim();
    return t.length ? t : undefined;
  }
  return v;
}, z.string().min(1).optional());

export const CapabilityArea = z.enum(['software', 'hardware', 'networking', 'devops']);

export const CreateCapabilitySchema = z.object({
  title: z.string().min(1),
  slug: OptionalSlug,
  area: CapabilityArea,
  description: z.string().optional().default(''),
  contentHtml: z.string().optional().default(''),
  imageFileId: z.string().optional(),
  locale: z.enum(['en','fa'])
});

export const UpdateCapabilitySchema = z.object({
  title: z.string().min(1).optional(),
  slug: OptionalSlug,
  area: CapabilityArea.optional(),
  description: z.string().optional(),
  contentHtml: z.string().optional(),
  imageFileId: z.string().optional(),
  locale: z.enum(['en','fa']).optional()
});

export type CreateCapabilityInput = z.infer<typeof CreateCapabilitySchema>;
export type UpdateCapabilityInput = z.infer<typeof UpdateCapabilitySchema>;
