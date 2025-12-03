export interface DeviceSummary {
  total_devices: number;
  online_devices: number;
  offline_devices: number;
  error_devices: number;
}

export interface GroupSummary {
  total_group: number;
}

export interface AlertSeverity {
  severity: string;
  severity_name: string;
  count: number;
  color: string;
}

export interface CriticalAlert {
  id: string;
  device_id: string;
  device_name: string;
  area_name: string;
  message: string;
  severity: string;
  timestamp: string;
}

export interface AlertSummary {
  total_active_alerts: number;
  alerts_by_severity: AlertSeverity[];
  recent_critical_alerts: CriticalAlert[];
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface DeviceDistributionByType {
  type: string;
  type_name: string;
  count: number;
  online: number;
  icon: string;
}

export interface DashboardOverview {
  device_summary: DeviceSummary;
  group_summary: GroupSummary;
  device_distribution_by_type: DeviceDistributionByType[];
  alert_summary: AlertSummary;
  recent_activities: RecentActivity[];
}
