import { z } from 'zod';
export const TraitKeyEnum = z.enum([
  'lms.devices.traits.OnOff',
  'lms.devices.traits.Brightness'
  //Volume, Mute, ColorSetting...
]);

export type TraitKey = z.infer<typeof TraitKeyEnum>;

const scheduleActionSchema = z.object({
  trait: TraitKeyEnum.optional(),
  value: z.any()
});

export const subScheduleSchema = z
  .object({
    time: z.string().nullish(),
    action: scheduleActionSchema.nullish(),
    enabled: z.boolean().default(true)
  })
  .superRefine((data, ctx) => {
    const { time, action } = data;

    // Check if both are missing
    if ((!time || time.length === 0) && (!action || !action.trait)) {
      ctx.addIssue({
        path: ['time'],
        message: 'calendar.validation.time_and_action_required',
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (!time || time.length === 0) {
      ctx.addIssue({
        path: ['time'],
        message: 'calendar.validation.time_required',
        code: z.ZodIssueCode.custom
      });
    }

    if (!action || !action.trait) {
      ctx.addIssue({
        path: ['action', 'trait'],
        message: 'calendar.validation.action_required',
        code: z.ZodIssueCode.custom
      });
      return;
    }

    const { trait, value } = action;

    if (trait === 'lms.devices.traits.Brightness') {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        ctx.addIssue({
          path: ['action', 'value'],
          message: 'calendar.validation.brightness_range',
          code: z.ZodIssueCode.custom
        });
      }
    }

    if (trait === 'lms.devices.traits.OnOff') {
      if (typeof value !== 'boolean') {
        ctx.addIssue({
          path: ['action', 'value'],
          message: 'calendar.validation.invalid_on_off',
          code: z.ZodIssueCode.custom
        });
      }
    }
  });

export const calendarFormSchema = z
  .object({
    name: z.string().min(2, { message: 'calendar.validation.name_min' }),
    description: z.string().optional(),
    output_channel: z.string().default('alerts'),
    output_topic: z.string().default('schedule'),
    device_type: z
      .string()
      .refine((val) => val.startsWith('lms.devices.types.'), {
        message: 'calendar.validation.device_type_invalid'
      }),
    group_ids: z.array(z.string()).optional(),
    client_id: z.string().default('default'),
    priority: z.number().int().min(1).max(2).default(2),
    action: z.string().default('PLAY'),
    recurring: z
      .enum(['none', 'daily', 'weekly', 'monthly', 'custom'])
      .default('none'),
    schedules: z
      .array(subScheduleSchema)
      .min(1, 'calendar.validation.schedule_min'),
    date: z.object({
      from: z.date().optional(),
      to: z.date().optional()
    }),
    ids: z.array(z.string()).min(1, 'calendar.validation.ids_min'),
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
        message: 'calendar.validation.start_date_required'
      });
      return;
    }

    if (recurring !== 'none' && !date?.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'calendar.validation.end_date_required'
      });
    }

    if (date?.from && date?.to && date.to < date.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'calendar.validation.end_date_after_start'
      });
    }

    if (recurring === 'weekly' && !weekly?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekly'],
        message: 'calendar.validation.weekly_required'
      });
    }

    if (recurring === 'monthly' && !monthly?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthly'],
        message: 'calendar.validation.monthly_required'
      });
    }
  });
