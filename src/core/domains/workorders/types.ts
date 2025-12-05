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

export interface WorkOrderAttachment {
  file_name: string;
  file_url: string;
}

export interface WorkOrder {
  id: string;
  alarm_id: string;
  cause: string;
  measurement: string;
  work_order_name: string;
  source: string; // vd: "SYTEM"
  work_order_status: string; // vd: "open" | "process" | "completed" | "closed"
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
  action: string; // vd: "open" | "forward" | "comfirmed" | "cancel"
  attachments: WorkOrderAttachment[] | null;
  assignee_id: string;
  assigned_at: string;
  assigned_by: string;
  acknowledged_at: string;
  acknowledged_by: string;
  resolved_at: string;
}

export interface createWorkOrderDTO {
  alarm_id: string;
  assigned_by: string;
  assignee_id: string;
  description: string;
  work_order_name: string;
  source: string;
  department: string;
  work_order_status: string;
}
