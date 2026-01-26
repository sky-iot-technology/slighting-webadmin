//trait data for device catalogues
export type TraitKey =
  | 'lms.devices.traits.OnOff'
  | 'lms.devices.traits.Brightness'
  | 'lms.devices.traits.Volume'
  | 'lms.devices.traits.Mute';
// | "lms.devices.traits.Media"
// | "lms.devices.traits.MediaActivityState"
// | "lms.devices.traits.Schedule"
// | 'lms.devices.traits.ColorSetting'

export type ActionValue =
  | { trait: 'lms.devices.traits.OnOff'; value: boolean }
  | { trait: 'lms.devices.traits.Brightness'; value: number };

export type ScheduleAction = ActionValue;

export const TRAIT_LABELS: Record<string, string> = {
  'lms.devices.traits.Brightness': 'Độ sáng',
  'lms.devices.traits.OnOff': 'Bật/Tắt'
};

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

export const COMMAND_TO_TRAIT: Record<string, TraitKey> = {
  'lms.devices.commands.OnOff': 'lms.devices.traits.OnOff',
  'lms.devices.commands.BrightnessAbsolute': 'lms.devices.traits.Brightness'
};

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
