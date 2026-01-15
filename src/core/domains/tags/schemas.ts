import { z } from 'zod';

export const tagFormSchema = z.object({
  name: z.string().min(2, 'tag.validation.name_required'),
  description: z.string().optional().default('')
});
