import { z } from 'zod';

const FileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File không vượt quá 5MB');

export const workOrderFormSchema = z
  .object({
    assigned_by: z.string().min(1, 'Người giám sát không được để trống'),
    assignee_id: z.string().min(1, 'Người được giao không được để trống'),

    work_order_name: z.string().min(1, 'Tên công việc không được để trống'),
    remarks: z.string().optional().default(''),

    department: z.string().min(1, 'Đơn vị không được để trống'),

    assignee_content: z.string().optional().default(''),

    start_date: z.string().min(1, 'Vui lòng nhập ngày bắt đầu'),
    end_date: z.string().min(1, 'Vui lòng nhập ngày hoàn thành'),

    admin_attachments: z
      .array(FileSchema)
      .max(3, 'Chỉ được tải lên tối đa 3 tập tin')
      .optional()
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'Ngày hoàn thành phải lớn hơn hoặc bằng ngày bắt đầu',
    path: ['end_date']
  });

export type WorkOrderFormSchema = z.infer<typeof workOrderFormSchema>;

export const maintenanceProgressSchema = z
  .object({
    /* -------- Thông tin thiết bị -------- */
    work_order_name: z.string().min(1, 'Vui lòng nhập tên công việc'),

    assignee_id: z.string().min(1, 'Vui lòng chọn người xử lý'),

    remarks: z.string().optional().default(''),

    attachments: z
      .array(FileSchema)
      .max(3, 'Chỉ được tải lên tối đa 3 tập tin')
      .optional(),

    /* -------- Cập nhật tiến độ -------- */
    work_order_status: z.string().min(1, 'Vui lòng chọn trạng thái thiết bị'),

    description: z.string().optional().default(''),

    start_date: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),

    end_date: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),

    images: z.array(FileSchema).max(5, 'Tối đa 5 hình ảnh').optional(),

    /* -------- Xác nhận tiến độ -------- */
    action: z.string().min(1, 'Vui lòng chọn trạng thái xử lý'),

    confirm_note: z.string().optional().default('')
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    path: ['end_date'],
    message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'
  });

export type MaintenanceProgressFormValues = z.infer<
  typeof maintenanceProgressSchema
>;
