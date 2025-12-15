import { z } from 'zod';

const FileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File không vượt quá 5MB');

export const workOrderFormSchema = z
  .object({
    assigned_by: z.string().min(1, 'Người giám sát không được để trống'),
    assignee_id: z.string().min(1, 'Người được giao không được để trống'),

    work_order_name: z.string().min(1, 'Tên công việc không được để trống'),
    remarks: z.string().min(1, 'Mô tả không được để trống'),

    department: z.string().min(1, 'Đơn vị không được để trống'),

    start_date: z.string().min(1, 'Vui lòng nhập ngày bắt đầu'),
    end_date: z.string().min(1, 'Vui lòng nhập ngày hoàn thành'),

    admin_attachments: z
      .array(FileSchema)
      .max(5, 'Chỉ được tải lên tối đa 5 tập tin')
      .optional()
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'Ngày hoàn thành phải lớn hơn hoặc bằng ngày bắt đầu',
    path: ['end_date']
  });

export type WorkOrderFormSchema = z.infer<typeof workOrderFormSchema>;

export const maintenanceProgressSchema = z
  .object({
    id: z.string().min(1, { message: 'Mã không được bỏ trống' }),
    /* -------- Thông tin thiết bị -------- */
    work_order_name: z.string().min(1, 'Vui lòng nhập tên công việc'),

    assignee_id: z.string().min(1, 'Vui lòng chọn người xử lý'),

    department: z.string().min(1, 'Đơn vị không được để trống'),

    description: z.string().optional().default(''),

    admin_attachments: z
      .object({
        new: z.array(FileSchema).default([]),
        keep: z.array(z.any()).optional().default([]),
        delete: z.array(z.any()).optional().default([])
      })
      .superRefine((val, ctx) => {
        const total = val.new.length + val.keep.length;

        if (total > 5) {
          ctx.addIssue({
            path: [],
            code: z.ZodIssueCode.custom,
            message: 'Chỉ được tối đa 5 tập tin (bao gồm cả file cũ và mới)'
          });
        }
        const totalSize = val.new.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tổng dung lượng file tải lên không vượt quá 5MB',
            path: []
          });
        }
      }),

    /* -------- Cập nhật tiến độ -------- */
    work_order_status: z.string().min(1, 'Vui lòng chọn trạng thái thiết bị'),

    assignee_content: z.string().optional().default(''),

    start_date: z.string().min(1, 'Vui lòng nhập ngày bắt đầu'),
    end_date: z.string().min(1, 'Vui lòng nhập ngày hoàn thành'),

    attachments: z
      .object({
        new: z.array(FileSchema).default([]),
        keep: z.array(z.any()).optional().default([]),
        delete: z.array(z.any()).optional().default([])
      })
      .superRefine((val, ctx) => {
        const total = val.new.length + val.keep.length;

        if (total > 5) {
          ctx.addIssue({
            path: [],
            code: z.ZodIssueCode.custom,
            message: 'Chỉ được tối đa 5 hình ảnh (bao gồm cả file cũ và mới)'
          });
        }
        const totalSize = val.new.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Tổng dung lượng file tải lên không vượt quá 5MB',
            path: []
          });
        }
      }),

    /* -------- Xác nhận tiến độ -------- */
    action: z.string().min(1, 'Vui lòng chọn trạng thái xử lý'),

    remarks: z.string().optional().default('')
  })
  .refine(
    (data) => {
      const start = data.start_date.split('T')[0];
      const end = data.end_date.split('T')[0];

      return end >= start;
    },
    {
      path: ['end_date'],
      message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'
    }
  );

export type MaintenanceProgressFormValues = z.infer<
  typeof maintenanceProgressSchema
>;
