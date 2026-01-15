import { z } from 'zod';

const FileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'maintenance.validation.file_size_max'
  );

export const workOrderFormSchema = z
  .object({
    assigned_by: z
      .string()
      .min(1, 'maintenance.validation.assigned_by_required'),
    assignee_id: z
      .string()
      .min(1, 'maintenance.validation.assignee_id_required'),

    work_order_name: z
      .string()
      .min(1, 'maintenance.validation.work_order_name_required'),
    remarks: z.string().min(1, 'maintenance.validation.remarks_required'),

    department: z.string().min(1, 'maintenance.validation.department_required'),

    start_date: z.string().min(1, 'maintenance.validation.start_date_required'),
    end_date: z.string().min(1, 'maintenance.validation.end_date_required'),

    admin_attachments: z
      .array(FileSchema)
      .max(5, 'maintenance.validation.file_max')
      .optional()
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'maintenance.validation.end_date_invalid',
    path: ['end_date']
  });

export type WorkOrderFormSchema = z.infer<typeof workOrderFormSchema>;

export const maintenanceProgressSchema = z
  .object({
    id: z.string().min(1, { message: 'maintenance.validation.id_required' }),
    /* -------- Thông tin thiết bị -------- */
    work_order_name: z
      .string()
      .min(1, 'maintenance.validation.work_order_name_required'),

    assignee_id: z
      .string()
      .min(1, 'maintenance.validation.assignee_id_required'),

    department: z.string().min(1, 'maintenance.validation.department_required'),

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
            message: 'maintenance.validation.file_max'
          });
        }
        const totalSize = val.new.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'maintenance.validation.total_size_max',
            path: []
          });
        }
      }),

    /* -------- Cập nhật tiến độ -------- */
    work_order_status: z
      .string()
      .min(1, 'maintenance.validation.status_required'),

    assignee_content: z.string().optional().default(''),

    start_date: z.string().min(1, 'maintenance.validation.start_date_required'),
    end_date: z.string().min(1, 'maintenance.validation.end_date_required'),

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
            message: 'maintenance.validation.image_max'
          });
        }
        const totalSize = val.new.reduce((sum, file) => sum + file.size, 0);

        if (totalSize > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'maintenance.validation.total_size_max',
            path: []
          });
        }
      }),

    /* -------- Xác nhận tiến độ -------- */
    action: z.string().min(1, 'maintenance.validation.action_required'),

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
      message: 'maintenance.validation.end_date_invalid'
    }
  );

export type MaintenanceProgressFormValues = z.infer<
  typeof maintenanceProgressSchema
>;
