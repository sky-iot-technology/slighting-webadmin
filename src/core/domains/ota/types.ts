import { QueryParams } from '@/core/shared';

export interface GetOtasParamsDto
  extends Omit<
    QueryParams,
    'order' | 'sort' | 'status' | 'search' | 'categories'
  > {
  category_type?: string;
  name?: string;
}

export interface OtaListResponseDto {
  data: OtaItem[];
  limit: number;
  offset: number;
  total: number;
}

export interface OtaItem {
  id: string;
  domain: string;
  name: string;
  tag: string;
  category_type: string;
  version: string;
  description: string;
  url: string;
  file_name: string;
  file_size: number;
  checksum_algorithm: string;
  checksum: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface OtaData {
  id: string;
  name: string;
  info: OtaFileInfo;
}

export interface CreateOtaDTO {
  name: string;
  category_type: string;
  version: string;
  url: string;
  file_name: string;
  checksum_algorithm: string;
  description?: string;
  file_size?: number;
  checksum?: string;
  updated_at?: string;
}

export interface UpdateOtaDto extends Partial<CreateOtaDTO> {}

//Apply OTA request
export interface OtaFileInfo {
  url: string;
  version: string;
  size: number;
  checksum: string;
  checksum_algorithm: string;
}

export interface OtaCommandParams {
  ota: OtaFileInfo;
}

export interface OtaExecutionCommand {
  command: 'lms.devices.commands.Ota';
  params: OtaCommandParams;
}

export interface ExecuteOtaRequest {
  device_ids: string[];
  command: {
    execution: OtaExecutionCommand[];
  };
}

//Response apply OTA
export interface OtaRequestMapping {
  id: string; // device_id
  request_id: string; // correlation_id
}

export interface OtaCommandError {
  device_id: string;
  status: 'SUCCESS' | 'FAILED';
  error_message?: string;
}

export interface ExecuteOtaResponse {
  request_ids: OtaRequestMapping[];
  poll_interval: number; // seconds
  command_errors: OtaCommandError[];
}

export type OtaProgressStatus = 'processing' | 'completed' | 'failed';
export interface OtaProgressPayload {
  process: number; // %
  speed: number; // bytes/sec
}
export interface OtaProgressResult {
  client_id: string;
  command: 'executeOta';
  correlation_id: string;
  payload: OtaProgressPayload;
}
//response of get RequestID
export interface OtaProgressResponse {
  status: OtaProgressStatus;
  result: OtaProgressResult | null;
  error: string;
  created_at: string; // ISO string
}
