import { z } from 'zod';

export const branchFormSchema = z.object({
  parent_id: z.string().optional().default(''),
  name: z.string().min(2, 'branch.validation.name_required'),
  description: z.string().optional().default(''),
  metadata: z
    .object({
      lat: z.coerce
        .number()
        .min(-90, 'branch.validation.lat_min')
        .max(90, 'branch.validation.lat_max')
        .optional(),
      long: z.coerce
        .number()
        .min(-180, 'branch.validation.long_min')
        .max(180, 'branch.validation.long_max')
        .optional()
    })
    .optional()
});
