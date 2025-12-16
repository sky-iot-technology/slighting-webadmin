import { QueryParams } from '@/core/shared/types';

export interface GetAlarmsParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  dir?: 'asc' | 'desc';
  client_id?: string;
  created_from?: string;
  created_to?: string;
  measurement?: string;
  status?: string;
}

export interface AlarmResponse {
  offset: number;
  limit: number;
  total: number;
  alarms: Alarm[];
}

export interface Alarm {
  id: string;
  rule_id: string;
  domain_id: string;
  channel_id: string;
  client_id: string;
  subtopic: string;
  status: AlarmStatus;
  measurement: string;
  value: string;
  unit: string;
  threshold: string;
  cause: string;
  severity: AlarmSeverity;
  assignee_id: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  assigned_at: string;
  assigned_by?: string;
  acknowledged_at: string;
  acknowledged_by: string;
  resolved_at: string;
  metadata: Metadata;
}

export interface Metadata {
  client_name: string;
  imei: string;
  model: string;
  parent_group_id: string;
  parent_group_path: string;
}

export type AlarmStatus = 'active' | 'open' | 'resolved' | 'ignored';

export enum AlarmSeverity {
  Low = 0,
  Medium = 1,
  High = 2
}

export const AlarmSeverityLabel: Record<AlarmSeverity, string> = {
  [AlarmSeverity.High]: 'Cao',
  [AlarmSeverity.Medium]: 'Trung bình',
  [AlarmSeverity.Low]: 'Thấp'
};

export const AlarmStatusLabel: Record<AlarmStatus, string> = {
  active: 'Đang xử lý',
  open: 'Chưa xử lý',
  resolved: 'Đã xử lý',
  ignored: 'Bỏ qua'
};

export interface AcknowledgedAlarm {
  status: AlarmStatus;
  acknowledged_by: string;
  acknowledged_at: string;
  updated_by: string;
  updated_at: string;
}

export interface CompletedAlarm {
  status: AlarmStatus;
  updated_by: string;
  updated_at: string;
  resolved_at: string;
}
