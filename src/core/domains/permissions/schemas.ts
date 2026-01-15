import { z } from 'zod';

export const roleSchema = z.object({
  name: z.string().min(1, { message: 'role.validation.name_required' }),
  note: z.string().optional().default(''),
  permission: z.record(z.array(z.string())).default({})
});
