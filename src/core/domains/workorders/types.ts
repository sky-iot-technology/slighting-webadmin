import { QueryParams } from '@/core/shared/types';

export interface GetWorkOrderParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  dir?: 'asc' | 'desc';
  status?: string;
  alarm_id?: string;
  maintanance_personnel?: string;
  work_order_name?: string;
  department?: string;
}

export interface WorkOrderListResponse {
  offset: number;
  limit: number;
  total: number;

  woker_orders: WorkOrder[];
}

export interface Attachment {
  file_name: string;
  file_url: string;
}

export interface WorkOrder {
  id: string;
  alarm_id: string;
  cause: string;
  measurement: string;
  severity: WorkOrderSeverity;
  work_order_name: string;
  source: string; // vd: "SYTEM"
  work_order_status: WorkOrderStatus; // vd: "open" | "process" | "completed" | "closed"
  assignee_content: string;
  description: string;
  department: string; // vd: "team:support"
  remarks: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  action: WorkOrderAction; // vd: "open" | "forward" | "comfirmed" | "cancel"
  attachments: Attachment[] | null;
  admin_attachments: Attachment[] | null;
  assignee_id: string;
  assigned_at: string;
  assigned_by: string;
  acknowledged_at: string;
  acknowledged_by: string;
  resolved_at: string;
}

export enum WorkOrderSeverity {
  Low = 0,
  Medium = 1,
  High = 2
}

export const WorkOderSeverityLabel: Record<WorkOrderSeverity, string> = {
  [WorkOrderSeverity.High]: 'Cao',
  [WorkOrderSeverity.Medium]: 'Trung bình',
  [WorkOrderSeverity.Low]: 'Thấp'
};

export enum WorkOrderStatus {
  OPEN = 'open',
  PROCESS = 'process',
  COMPLETED = 'completed',
  CLOSED = 'closed'
}

export const WorkOrderStatusLabel: Record<WorkOrderStatus, string> = {
  [WorkOrderStatus.OPEN]: 'Chưa xử lý',
  [WorkOrderStatus.PROCESS]: 'Đang xử lý',
  [WorkOrderStatus.COMPLETED]: 'Đã xử lý',
  [WorkOrderStatus.CLOSED]: 'Đã đóng'
};

export enum WorkOrderAction {
  OPEN = 'open',
  FORWARD = 'forward',
  CONFIRMED = 'confirmed',
  CANCEL = 'cancel'
}

export const WorkOrderActionLabel: Record<WorkOrderAction, string> = {
  [WorkOrderAction.OPEN]: 'Chưa xử lý',
  [WorkOrderAction.FORWARD]: 'Chuyển giao',
  [WorkOrderAction.CONFIRMED]: 'Xác nhận hoàn thành',
  [WorkOrderAction.CANCEL]: 'Đã hủy'
};

export interface createWorkOrderDTO {
  alarm_id: string;
  assigned_by: string;
  assignee_id: string;
  remarks: string;
  work_order_name: string;
  source: string;
  department: string;
  work_order_status: WorkOrderStatus;
  assignee_content: string;
  start_date: string;
  end_date: string;
  admin_attachments?: Attachment[] | null;
}
