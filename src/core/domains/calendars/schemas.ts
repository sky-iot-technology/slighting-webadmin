import { z } from 'zod';
export const TraitKeyEnum = z.enum([
  'lms.devices.traits.OnOff',
  'lms.devices.traits.Brightness'
  //Volume, Mute, ColorSetting...
]);

export type TraitKey = z.infer<typeof TraitKeyEnum>;

const scheduleActionSchema = z.object({
  trait: TraitKeyEnum,
  value: z.any()
});

export const subScheduleSchema = z
  .object({
    time: z.string().min(1, 'Thời gian không được để trống'),
    action: scheduleActionSchema.optional(),
    enabled: z.boolean().default(true)
  })
  .superRefine((data, ctx) => {
    if (!data.action) return;

    const { trait, value } = data.action;

    if (trait === 'lms.devices.traits.Brightness') {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        ctx.addIssue({
          path: ['action', 'value'],
          message: 'Độ sáng phải từ 0–100',
          code: z.ZodIssueCode.custom
        });
      }
    }

    if (trait === 'lms.devices.traits.OnOff') {
      if (typeof value !== 'boolean') {
        ctx.addIssue({
          path: ['action', 'value'],
          message: 'Giá trị bật/tắt không hợp lệ',
          code: z.ZodIssueCode.custom
        });
      }
    }
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
        message: 'Loại thiết bị không hợp lệ'
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

    if (date?.from && date?.to && date.to < date.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'Ngày kết thúc phải sau ngày bắt đầu'
      });
    }

    if (recurring === 'weekly' && !weekly?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekly'],
        message: 'Vui lòng chọn ít nhất 1 ngày trong tuần'
      });
    }

    if (recurring === 'monthly' && !monthly?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthly'],
        message: 'Vui lòng chọn ít nhất 1 ngày trong tháng'
      });
    }
  });
