import { z } from 'zod';

export const unitSchema = z.object({
  id: z.string().uuid({ message: 'ID không hợp lệ' }),
  name: z.string().min(1, { message: 'Tên đơn vị không được để trống' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  note: z.string().optional().default('')
});

export const departmentSchema = z.object({
  id: z.string().uuid({ message: 'ID không hợp lệ' }),
  name: z.string().min(1, { message: 'Tên phòng ban không được để trống' }),
  unitId: z.string().uuid({ message: 'Unit ID không hợp lệ' }),
  note: z.string().optional().default('')
});
