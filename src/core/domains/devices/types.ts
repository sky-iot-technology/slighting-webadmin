import type { BaseEntity, QueryParams } from '@/core/shared/types';

//Device types
export interface Device extends BaseEntity {
  type: string;
  name: string;
  cfg_id: string;
  ctrl_channel_id: string;
  data_channel_id: string;
  credentials: Credentials;
  domain_id: string;
  parent_group_id: string;
  device_info: DeviceInfo;
  device_asset: DeviceAsset;
  product_info: ProductInfo[];
  devices: SubDevice[];
  updated_by: string;
  status: string;
  warning: string;
}

export interface Credentials {
  secret: string;
}

export interface DeviceInfo {
  manufacturer: string;
  model: string;
  hw_version: string;
  sw_version: string;
  online: boolean;
  imei: string;
  serial_number: string;
  purchase_date: number;
  installation_date: number;
  expiration_date: number;
  expiration_of_tariff: number;
  service_life: number;
  lat: number;
  lon: number;
  region: string;
  optional: {
    rssi: 'unknown' | 'very_weak' | 'weak' | 'medium' | 'strong';
    ccid: string;
    net_mode: string;
    network_operator: string;
  };
}

export interface DeviceAsset {
  id: string;
  name: string;
  group?: string;
  organization?: string;
  category_type?: string;
  asset_status?: string;
  asset_number?: string;
  asset_attribute?: AssetAttribute[];
  created_at?: string;
  created_by?: string;
  updated_at?: string;
}

export interface AssetAttribute {
  index: number;
  is_disabled: boolean;
  identify: string;
  attr: string;
  type: number;
  content: string | number | null;
  reminder_ids?: string[];
}

export interface ProductInfo {
  name: string;
  value: string;
  type: string;
  unit: string;
}

export interface SubDeviceLastState {
  [key: string]: number | string | boolean;
}

export interface SubDevice {
  device_id: string;
  type: string;
  name: string;
  traits: string[];
  attributes?: Record<
    string,
    {
      n: string; //name
      u: string; //unit
    }
  >;
  last_state?: SubDeviceLastState;
}

export interface GetDevicesParamsDto
  extends Omit<QueryParams, 'order' | 'sort' | 'status'> {
  dir?: 'asc' | 'desc';
  order?: string;
  metadata?: any;
  group?: string | undefined;
  name?: string;
  status?: 'enabled' | 'disabled' | 'deleted' | 'all' | 'unknown';
  type?: string;
  serial_number?: string;
  only_total?: boolean;
}

export interface DeviceListResponseDto {
  devices: Device[];
  limit: number;
  offset: number;
  total: number;
}

export interface DeviceFeatureProps {
  id: string | number;
  lon: number;
  lat: number;
  online: string;
}

type Execution =
  | { command: 'lms.devices.commands.OnOff'; params: { on: boolean } }
  | {
      command: 'lms.devices.commands.BrightnessAbsolute';
      params: { brightness: number };
    };

export interface DeviceCommandRequest {
  device_id: string;
  command: {
    devices: string[];
    execution: Execution[];
  };
  channel_route: string;
}

export interface DeviceTurnOnOffRequest {
  device_id: string;
  channel_route: string;
  devices: string[];
  status: boolean;
}

export interface DeviceSetBrightnessRequest
  extends Omit<DeviceTurnOnOffRequest, 'status'> {
  brightness: number;
}

export type DeviceCommandResult = {
  device_id: string;
  state: SubDeviceLastState;
  status: string;
};

export type RequestResult = {
  client_id: string;
  command: string;
  devices: DeviceCommandResult[];
};

export type DeviceRequestResponse = {
  status: string;
  result: RequestResult;
  error: string;
  created_at: string;
};

export type DeviceExecuteResponse = {
  request_id: string;
  poll_interval: number;
};

export type SetDevicesParentGroup = {
  parent_group_id: string;
  device_ids: string[];
};
