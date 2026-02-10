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
  'client.sync': 'journals.operation.client_sync',
  'client.query': 'journals.operation.client_query',
  'client.execute': 'journals.operation.client_execute',
  'client.schedule.sync': 'journals.operation.client_schedule_sync',
  'client.schedule.sync_all': 'journals.operation.client_schedule_sync_all',
  'client.schedule.clean': 'journals.operation.client_schedule_clean',
  'client.schedule.add': 'journals.operation.client_schedule_add',
  'client.schedule.update': 'journals.operation.client_schedule_update',
  'client.schedule.remove': 'journals.operation.client_schedule_remove'
};

// Command name mapping to Vietnamese descriptions
export const COMMAND_LABELS: Record<string, string> = {
  'lms.devices.commands.OnOff': 'journals.command.on_off',
  'lms.devices.commands.BrightnessAbsolute': 'journals.command.brightness',
  'lms.devices.commands.Ota': 'journals.command.ota'
};
