export type Maintenance = {
  id: string;
  serial_number: string;
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | string;
  time: string | Date;
  timeSpend: string;
  sendBy: string;
  status: 'new' | 'in_progress' | 'resolved' | 'cancelled' | string;
  method: 'auto' | 'manual' | string;
  lat: number;
  lng: number;
};

export type WorkOrder = {
  id: string;
  jobName: string;
  alertName: string;
  priority: string;
  status: string;
  startTime: string;
  handlingUnit: string;
  executor: string;
  supervisionStatus: string;
};

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
}

export type AlarmStatus = 'active' | 'open' | 'cleared';

export enum AlarmSeverity {
  Low = 0,
  High = 1
}
