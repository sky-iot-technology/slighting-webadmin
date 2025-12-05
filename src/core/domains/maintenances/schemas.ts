import { z } from 'zod';

export const maintenanceWorkFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Tên công việc phải có ít nhất 3 ký tự')
    .max(100, 'Tên công việc không được vượt quá 100 ký tự'),

  description: z
    .string()
    .max(1000, 'Mô tả quá dài (tối đa 1000 ký tự)')
    .optional(),

  handlingUnit: z.string().min(1, 'Vui lòng chọn đơn vị xử lý'),

  supervisor: z.string().min(1, 'Vui lòng chọn người giám sát'),

  executors: z.string().min(1, 'Vui lòng chọn ít nhất một người thực hiện'),

  expectedStartDate: z
    .string()
    .min(1, 'Vui lòng chọn ngày bắt đầu dự kiến')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Ngày bắt đầu không hợp lệ'
    }),

  expectedMethod: z
    .string()
    .min(3, 'Phương án xử lý dự kiến phải có ít nhất 3 ký tự'),

  expectedEndDate: z
    .string()
    .min(1, 'Vui lòng chọn ngày hoàn thành dự kiến')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Ngày hoàn thành không hợp lệ'
    }),

  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url('Đường dẫn tệp không hợp lệ').optional(),
        file: z.instanceof(File).optional()
      })
    )
    .optional()
});

export type MaintenanceWorkFormSchema = z.infer<
  typeof maintenanceWorkFormSchema
>;
