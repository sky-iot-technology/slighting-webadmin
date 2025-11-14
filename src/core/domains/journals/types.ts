export interface JournalExecution {
  command: string;
  params: Record<string, any>;
}

export interface JournalAttributes {
  children_clients: string[];
  domain: string;
  execution: JournalExecution[];
  id: string;
  request_id: string;
  success: boolean;
  super_admin: boolean;
  token_type: string;
  user_id: string;
}

export interface Journal {
  domain: string;
  operation: string;
  occurred_at: string;
  attributes: JournalAttributes;
}

export interface JournalListResponseDto {
  total: number;
  offset: number;
  limit: number;
  journals: Journal[];
}

export interface GetJournalsParamsDto {
  operation?: string;
  with_attributes?: boolean;
  with_metadata?: boolean;
  offset?: number;
  limit?: number;
}

// Operation name mapping to Vietnamese descriptions
export const OPERATION_LABELS: Record<string, string> = {
  'client.sync': 'Đồng bộ với thiết bị',
  'client.query': 'Query xuống thiết bị',
  'client.execute': 'Điều khiển xuống thiết bị',
  'client.schedule.sync': 'Đồng bộ lịch với thiết bị',
  'client.schedule.sync_all':
    'Gửi lại toàn bộ lịch đang có trên server cho thiết bị',
  'client.schedule.clean': 'Xoá toàn bộ lịch xuống thiết bị',
  'client.schedule.add': 'Thêm lịch xuống thiết bị',
  'client.schedule.update': 'Cập nhật lịch xuống thiết bị',
  'client.schedule.remove': 'Xoá lịch xuống thiết bị'
};

// Command name mapping to Vietnamese descriptions
export const COMMAND_LABELS: Record<string, string> = {
  'lms.devices.commands.OnOff': 'Bật/Tắt',
  'lms.devices.commands.BrightnessAbsolute': 'Độ sáng'
};
