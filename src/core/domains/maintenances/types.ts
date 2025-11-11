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
