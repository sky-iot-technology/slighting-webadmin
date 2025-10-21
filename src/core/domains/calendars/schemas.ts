import { z } from 'zod';

export const subScheduleSchema = z.object({
  time: z.string().min(1, 'Thời gian không được để trống'),
  actionType: z.enum(['brightness', 'onOff']).nullable().optional(),
  brightness: z.number().min(0).max(100).optional(),
  onOff: z.boolean().optional(),
  enabled: z.boolean().default(true),
  payload: z
    .object({
      command: z.string(),
      params: z.record(z.any())
    })
    .default({ command: 'default-command', params: {} })
});

export const calendarFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Tên lịch phải ít nhất 2 ký tự' }),
    description: z.string().optional(),
    output_channel: z.string().default('alerts'),
    output_topic: z.string().default('schedule'),
    device_type: z
      .string()
      .refine((val) => val.startsWith('lms.devices.types.'), {
        message: 'Device type không hợp lệ'
      }),
    group_ids: z.array(z.string()).optional(),
    client_id: z.string().default('default'),
    priority: z.number().int().min(1).max(2).default(2),
    action: z.string().default('PLAY'),
    recurring: z
      .enum(['none', 'daily', 'weekly', 'monthly', 'custom'])
      .default('none'),
    schedules: z.array(subScheduleSchema).min(1, 'Phải có ít nhất 1 lịch con'),
    date: z.object({
      from: z.date().optional(),
      to: z.date().optional()
    }),
    ids: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 thiết bị'),
    weekly: z.array(z.string()).optional(),
    monthly: z.array(z.string()).optional()
  })
  .superRefine((data, ctx) => {
    const { priority, recurring, date, weekly, monthly } = data;

    if (priority === 1) return;
    if (!date?.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'Vui lòng chọn ngày bắt đầu'
      });
      return;
    }

    if (recurring !== 'none' && !date?.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'Vui lòng chọn ngày kết thúc'
      });
    }

    if (recurring === 'weekly' && (!weekly || weekly.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekly'],
        message: 'Vui lòng chọn ít nhất 1 ngày trong tuần'
      });
    }

    if (recurring === 'monthly' && (!monthly || monthly.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthly'],
        message: 'Vui lòng chọn ít nhất 1 ngày trong tháng'
      });
    }
  });
