export type CatalogueDeviceType =
  | 'lms.devices.types.LIGHT'
  | 'lms.devices.types.SWITCH'
  | 'lms.devices.types.SENSOR'
  | 'lms.devices.types.CAMERA'
  | 'lms.devices.types.SOCKET'
  | 'lms.devices.types.RADIO'
  | 'lms.devices.types.TV'
  | 'lms.devices.types.WATER_HEATER'
  | 'lms.devices.types.STL_SMART'
  | 'lms.devices.types.STL_CABINET'
  | 'lms.devices.types.DIGITAL'
  | 'lms.devices.types.DIGITAL_SIGNATURE'
  | string;

export interface SubCatalogueDevice {
  device_id: string;
  name: string;
  traits: string[];
  type: CatalogueDeviceType;
}

export interface CatalogueAttributes {
  icon?: string;
  [key: string]: string | SubCatalogueDevice | undefined;
}

export interface Catalogue {
  id: string;
  type: CatalogueDeviceType;
  name: string;
  description: string;
  traits: string[];
  attributes: CatalogueAttributes;
  created_at: string;
  updated_at: string;
}

export interface CatalogueListResponseDto {
  limit: number;
  offset: number;
  total: number;
  devices: Catalogue[];
}
