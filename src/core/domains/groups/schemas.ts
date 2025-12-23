import { z } from 'zod';

export const branchFormSchema = z.object({
  parent_id: z.string().optional().default(''),
  name: z.string().min(2, 'Tên chi nhánh không được để trống'),
  description: z.string().optional().default(''),
  metadata: z
    .object({
      lat: z.coerce
        .number()
        .min(-90, 'Vĩ độ phải ≥ -90')
        .max(90, 'Vĩ độ phải ≤ 90')
        .optional(),
      long: z.coerce
        .number()
        .min(-180, 'Kinh độ phải ≥ -180')
        .max(180, 'Kinh độ phải ≤ 180')
        .optional()
    })
    .optional()
});
