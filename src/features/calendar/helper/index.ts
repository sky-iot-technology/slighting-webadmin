import {
  Calendar,
  calendarFormSchema,
  CreateCalendarDto,
  ScheduleAction,
  SchedulePriority,
  SubSchedule,
  subScheduleSchema
} from '@/core/domains/calendars';
import { z } from 'zod';

export const formatDateString = (dateString?: string | null): string => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export function mapFormToCreateCalendarDto(
  formData: z.infer<typeof calendarFormSchema>
): CreateCalendarDto {
  const isUrgent = formData.priority === 1;
  const isNonRecurring = formData.recurring === 'none';

  let fromISO: string;
  let toISO: string;

  if (isUrgent) {
    // ⚡ Lịch khẩn cấp: bắt đầu ngay bây giờ, kết thúc cuối ngày hiện tại
    const now = new Date();
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    fromISO = now.toISOString();
    toISO = endOfToday.toISOString();
  } else if (isNonRecurring) {
    // 📅 Không lặp lại: chỉ có from → to = cuối ngày đó
    const from = formData.date?.from;
    if (from) {
      fromISO = new Date(
        from.getFullYear(),
        from.getMonth(),
        from.getDate(),
        0,
        0,
        0
      ).toISOString();

      const endOfDay = new Date(
        from.getFullYear(),
        from.getMonth(),
        from.getDate(),
        23,
        59,
        59
      );
      toISO = endOfDay.toISOString();
    } else {
      // fallback nếu user chưa chọn ngày
      const now = new Date();
      fromISO = now.toISOString();
      toISO = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      ).toISOString();
    }
  } else {
    const from = formData.date?.from;
    const to = formData.date?.to;

    fromISO = from
      ? new Date(
          from.getFullYear(),
          from.getMonth(),
          from.getDate(),
          0,
          0,
          0
        ).toISOString()
      : new Date().toISOString();

    toISO = to
      ? new Date(
          to.getFullYear(),
          to.getMonth(),
          to.getDate(),
          23,
          59,
          59
        ).toISOString()
      : fromISO;
  }

  return {
    name: formData.name,
    description: formData.description,
    output_channel: formData.output_channel,
    output_topic: formData.output_topic,
    device_type: formData.device_type,
    group_ids: formData.group_ids ?? [],
    client_id: formData.client_id,
    priority: formData.priority as SchedulePriority,
    action: formData.action as ScheduleAction,
    schedules: formData.schedules.map((s) => {
      let payload: { command: string; params: Record<string, any> };

      if (s.actionType === 'onOff') {
        payload = {
          command: 'lms.devices.commands.OnOff',
          params: { on: s.onOff ?? false }
        };
      } else if (s.actionType === 'brightness') {
        payload = {
          command: 'lms.devices.commands.BrightnessAbsolute',
          params: { brightness: s.brightness ?? 0 }
        };
      } else {
        payload = { command: '', params: {} };
      }

      let day = {};
      if (formData.recurring === 'weekly') {
        day = { day_of_week: formData.weekly?.map((d) => Number(d)) ?? [] };
      } else if (formData.recurring === 'monthly') {
        day = { day_of_month: formData.monthly?.map((d) => Number(d)) ?? [] };
      }
      return {
        start_datetime: fromISO,
        end_datetime: toISO,
        ids: formData.ids ?? [],
        time: s.time,
        recurring: formData.recurring ?? 'none',
        recurring_period: day ?? {},
        enabled: true,
        payload
      };
    })
  } as CreateCalendarDto;
}

export const mapSchedulesToForm = (
  schedules: SubSchedule[]
): z.infer<typeof subScheduleSchema>[] => {
  if (!schedules?.length) {
    return [
      {
        time: '',
        actionType: null,
        enabled: true,
        payload: { command: 'default-command', params: {} }
      }
    ];
  }

  return schedules.map((s) => {
    const brightness =
      s.payload?.params?.brightness !== undefined
        ? Number(s.payload.params.brightness)
        : undefined;

    const actionType = brightness !== undefined ? 'brightness' : 'onOff';

    return {
      time: s.time,
      actionType,
      brightness,
      onOff: undefined,
      enabled: s.enabled ?? true,
      payload: {
        command: s.payload?.command ?? 'default-command',
        params: s.payload?.params ?? {}
      }
    };
  });
};

export function mapCalendarToFormData(
  initialData: Partial<Calendar>
): z.infer<typeof calendarFormSchema> {
  const firstSchedule = initialData.schedules?.[0];

  const recurring = firstSchedule?.recurring ?? 'none';
  const from = firstSchedule?.start_datetime
    ? new Date(firstSchedule.start_datetime)
    : undefined;
  const to = firstSchedule?.end_datetime
    ? new Date(firstSchedule.end_datetime)
    : undefined;

  const weekly =
    recurring === 'weekly'
      ? (firstSchedule?.recurring_period?.day_of_week ?? []).map(String)
      : [];
  const monthly =
    recurring === 'monthly'
      ? (firstSchedule?.recurring_period?.day_of_month ?? []).map(String)
      : [];

  return {
    name: initialData.name ?? '',
    description: initialData.description ?? '',
    output_channel: Array.isArray(initialData.output_channels)
      ? initialData.output_channels[0]
      : (initialData.output_channels ?? 'alerts'),
    output_topic: initialData.output_topic ?? 'schedule',
    client_id: initialData.client_id ?? 'default',
    device_type: initialData.device_type ?? '',
    group_ids: initialData.group_ids ?? [],
    ids: firstSchedule?.ids ?? [],
    priority: initialData.priority ?? 2,
    action: initialData.action ?? 'PLAY',
    recurring,
    weekly,
    monthly,
    date: { from, to },
    schedules: mapSchedulesToForm(initialData.schedules ?? [])
  };
}
