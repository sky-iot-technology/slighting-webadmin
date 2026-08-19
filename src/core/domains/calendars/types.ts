import type { PaginationParams } from '@/core/shared/types';

export type CalendarRepeat = 'Không' | 'Hàng ngày' | 'Hàng tuần' | 'Hàng tháng';

export type ScheduleStatus = 'active' | 'inactive';
export type ScheduleSync = 'waiting' | 'synced';
export type ScheduleAction = 'PLAY' | 'STOP';
export type SchedulePriority = 'emergency' | 'normal' | 'lower';

export type ScheduleRecurring =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

export type DeviceType =
  | 'lms.devices.types.LIGHT'
  | 'lms.devices.types.SWITCH'
  | 'lms.devices.types.SENSOR'
  | string;

export type ScheduleSyncStatus = 'waiting' | 'synced';

export interface Calendar {
  id: string;
  name: string;
  description: string;
  domain_id: string;
  client_id: string;
  group_ids: string[] | null;
  level: number;
  priority: SchedulePriority;
  device_type: DeviceType;
  action: ScheduleAction;
  output_channels: string[];
  output_topic: string;
  status: ScheduleStatus;
  dual_mode: string;
  execute_on_device: string;
  last_execution_status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  device_sync: string;
  is_deleted: boolean;
  schedules: SubSchedule[];
}

export interface SubSchedule {
  id: number;
  schedule_id: string;
  client_id: string;
  enabled: boolean;
  ids: string[];
  start_datetime: string;
  end_datetime: string;
  last_execution_at?: string;
  error_message?: string;
  cron_expression: string;
  payload: {
    command: string;
    params: Record<string, any>;
  };
  time: string;
  recurring: ScheduleRecurring;
  recurring_period: Record<string, any>;
  second: string;
  minute: string;
  hour: string;
  day_of_month: string;
  month: string;
  day_of_week: string;
  created_at: string;
}

export interface GetCalendarsParamsDto extends PaginationParams {
  name?: string;
  groups?: string;
  start_range?: string;
  end_range?: string;
  status?: ScheduleStatus;
  device_sync?: ScheduleSync;
  client_id?: string;
}

export interface GetDeivceCalendarsParamsDto
  extends Omit<GetCalendarsParamsDto, 'client_id' | 'groups'> {
  device_sync?: ScheduleSyncStatus;
  is_deleted?: boolean;
  schedule_id?: string;
  group?: string;
}

export interface CalendarListResponseDto {
  schedules: Calendar[];
  limit: number;
  offset: number;
  total: number;
}

export interface CalendarDetailResponseDto {
  calendar: Calendar;
}

export interface CreateSubScheduleDto {
  start_datetime: string;
  end_datetime: string;
  ids: string[];
  time: string;
  recurring: ScheduleRecurring;
  recurring_period: {};
  enabled: boolean;
  payload: {
    command: string;
    params: Record<string, any>;
  };
}

export interface CreateCalendarDto {
  name: string;
  description?: string;
  output_channel: string;
  output_topic: string;
  device_type: DeviceType;
  group_ids?: string[];
  client_id?: string;
  priority: SchedulePriority;
  action: ScheduleAction;
  schedules: CreateSubScheduleDto[];
}

export interface UpdateCalendarDto extends Partial<CreateCalendarDto> {}

export interface ScheduleExecution {
  schedule_id: string;
  cron_job_id: number;
  execution_id: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | string;
  executed_at: string;
}

export interface GetScheduleHistoryResponseDto {
  limit: number;
  offset: number;
  total: number;
  executions: ScheduleExecution[];
}

export interface GetScheduleHistoryParamsDto {
  offset?: number;
  limit?: number;
  page?: number;
}
