import { z } from 'zod';

export const branchFormSchema = z.object({
  parent_id: z.string().optional().default(''),
  name: z.string().min(2, 'Tên chi nhánh không được để trống'),
  description: z.string().optional().default(''),
  metadata: z
    .object({
      lat: z.number().min(-90).max(90),
      long: z.number().min(-180).max(180)
    })
    .partial()
    .optional()
});
