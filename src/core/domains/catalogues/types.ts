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

export interface DeviceAlias {
  alias: string;
  name: string;
  type: CatalogueDeviceType;
}

export interface CatalogueAttributes {
  icon?: string;
  device_aliases?: DeviceAlias[];
  [key: string]: unknown;
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

export interface DescriptorAttributes {
  name: string;
  type: string;
  writable: boolean;
  reportable: boolean;
  unit: string;
  min: number | null;
  max: number | null;
  enum: string[] | null;
}

export interface Command {
  name: string;
  internal_cmd: string;
  trait: string;
  kind: string;
  required_traits?: string[];
  attr_triggers?: string[];
}

export interface Event {
  name: string;
  cluster: string;
  matter_cluster_id: number;
  priority: number;
}

export interface Descriptor {
  name: string;
  trait: string;
  full_name: string;
  matter_cluster_id: number;
  matter_cluster_name: string;
  attributes: DescriptorAttributes[];
  commands: Command[];
  events?: Event[];
}

export interface DescriptorListResponseDto {
  descriptors: Descriptor[];
}

export interface CatalogueListResponseDto {
  limit: number;
  offset: number;
  total: number;
  devices: Catalogue[];
}

export const normalizeTraitKey = (trait: string): string => {
  if (!trait) return '';
  if (trait.startsWith('lms.devices.traits.')) {
    return trait;
  }
  return `lms.devices.traits.${trait}`;
};
