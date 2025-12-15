import {
  Calendar,
  calendarFormSchema,
  CreateCalendarDto,
  ScheduleAction,
  SchedulePriority,
  SubSchedule,
  subScheduleSchema
} from '@/core/domains/calendars';
import {
  PRIORITY_LABELS_NUMS,
  PRIORITY_LABELS_STRINGS
} from '@/core/domains/calendars/constant';
import { RegionNode } from '@/core/domains/groups';
import { z } from 'zod';

export function utcToLocal(dateStr?: string | Date): Date | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

function formatLocalToFakeISO(date: Date, endOfDay = false): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = endOfDay ? '23' : '00';
  const minutes = endOfDay ? '59' : '00';
  const seconds = endOfDay ? '59' : '00';
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

export const formatDateString = (dateString?: string | null): string => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export function parseLocalDate(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const cleaned = dateStr.replace('Z', '');
  const [datePart, timePart = '00:00:00'] = cleaned.split(/[T ]/);
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm, ss] = timePart.split(':').map(Number);
  return new Date(y, m - 1, d, hh ?? 0, mm ?? 0, ss ?? 0);
}

export function mapFormToCreateCalendarDto(
  formData: z.infer<typeof calendarFormSchema>
): CreateCalendarDto {
  const isUrgent = formData.priority === 1;
  const isNonRecurring = formData.recurring === 'none';

  let fromISO: string;
  let toISO: string;

  if (isUrgent) {
    const now = new Date();
    fromISO = formatLocalToFakeISO(now);
    toISO = formatLocalToFakeISO(now, true);
  } else if (isNonRecurring) {
    const from = formData.date?.from!;
    fromISO = formatLocalToFakeISO(from);
    toISO = formatLocalToFakeISO(from, true);
  } else {
    const from = formData.date?.from;
    const to = formData.date?.to ?? from;
    fromISO = from
      ? formatLocalToFakeISO(from)
      : formatLocalToFakeISO(new Date());
    toISO = to ? formatLocalToFakeISO(to, true) : fromISO;
  }
  return {
    name: formData.name,
    description: formData.description,
    output_channel: formData.output_channel,
    output_topic: formData.output_topic,
    device_type: formData.device_type,
    group_ids: formData.group_ids ?? [],
    client_id: formData.client_id,
    priority: PRIORITY_LABELS_NUMS[formData.priority] as SchedulePriority,
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
        actionType: undefined,
        brightness: undefined,
        onOff: undefined,
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

    const onOff =
      s.payload?.params?.on !== undefined
        ? Boolean(s.payload.params.on)
        : undefined;

    const actionType = brightness !== undefined ? 'brightness' : 'onOff';

    return {
      time: s.time,
      actionType,
      brightness,
      onOff,
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
  const from = parseLocalDate(firstSchedule?.start_datetime);
  const to = parseLocalDate(firstSchedule?.end_datetime);

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
    priority: PRIORITY_LABELS_STRINGS[initialData.priority ?? 'normal'],
    action: initialData.action ?? 'PLAY',
    recurring,
    weekly,
    monthly,
    date: { from, to },
    schedules: mapSchedulesToForm(initialData.schedules ?? [])
  };
}

export const findNodeName = (
  nodes: RegionNode[],
  id: string
): string | null => {
  for (const node of nodes) {
    if (node.id === id) return node.name;
    if (node.children) {
      const found = findNodeName(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findNodeById = (
  nodes: RegionNode[],
  id: string
): RegionNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findNodeSlug = (
  nodes: RegionNode[],
  id: string
): string | null => {
  for (const node of nodes) {
    if (node.id === id) return node.slug;
    if (node.children) {
      const found = findNodeSlug(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export function flattenTree(nodes: RegionNode[]): RegionNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(node.children?.length ? flattenTree(node.children) : [])
  ]);
}

export const findNodeId = (
  nodes: RegionNode[],
  slug: string
): string | null => {
  for (const node of nodes) {
    if (node.slug === slug) return node.id;
    if (node.children) {
      const found = findNodeId(node.children, slug);
      if (found) return found;
    }
  }
  return null;
};

export const findParentNode = (
  nodes: RegionNode[],
  id: string
): RegionNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children?.some((child) => child.id === id)) {
      return node;
    }
    if (node.children) {
      const found = findParentNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};
