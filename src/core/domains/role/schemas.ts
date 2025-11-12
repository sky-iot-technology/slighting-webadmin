import { z } from 'zod';

export const roleSchema = z.object({
  id: z.string().uuid({ message: 'ID không hợp lệ' }),
  name: z.string().min(1, { message: 'Tên vai trò không được để trống' }),
  createdAt: z.string().datetime({ message: 'Thời gian tạo không hợp lệ' }),
  note: z.string().optional().default('')
});
