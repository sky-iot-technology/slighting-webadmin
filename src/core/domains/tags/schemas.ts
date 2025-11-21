import { z } from 'zod';

export const tagFormSchema = z.object({
  name: z.string().min(2, 'Tên nhóm chi nhánh không được để trống'),
  description: z.string().optional().default('')
});
