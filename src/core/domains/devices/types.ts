import type { BaseEntity, QueryParams } from '@/core/shared/types';

//Device type

export interface Device {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  online: boolean;
}
