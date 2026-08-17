import { devtools } from 'zustand/middleware';
import { catalogueApi } from './api';
import { create } from 'zustand';
import { CatalogueListResponseDto } from './types';

type CatalogueState = {
  catalogues: CatalogueListResponseDto['devices'];
  descriptors: any[];
  total: number;
  isLoading: boolean;
  isDescriptorsLoading: boolean;
  error: string | null;

  fetchCatalogues: () => Promise<void>;
  fetchDescriptors: () => Promise<void>;
  clear: () => void;
};

export const useCatalogueStore = create<CatalogueState>()(
  devtools<CatalogueState>((set, get) => ({
    catalogues: [],
    descriptors: [],
    total: 0,
    isLoading: false,
    isDescriptorsLoading: false,
    error: null,

    fetchCatalogues: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await catalogueApi.getAll();
        set({
          catalogues: response.devices ?? [],
          total: response.total,
          isLoading: false
        });
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || 'Lỗi khi tải danh mục thiết bị'
        });
      }
    },

    fetchDescriptors: async () => {
      // Avoid refetching if already loaded
      if (get().descriptors.length > 0) return;
      set({ isDescriptorsLoading: true });
      try {
        const response = await catalogueApi.getTraitDescriptors();
        set({
          descriptors: response.descriptors ?? [],
          isDescriptorsLoading: false
        });
      } catch (err) {
        set({ isDescriptorsLoading: false });
        console.error('Lỗi khi tải descriptors:', err);
      }
    },

    clear: () => set({ catalogues: [], descriptors: [], total: 0, error: null })
  }))
);

// Dynamic Helpers
export function getTraitByCommand(commandName: string): string | undefined {
  const descriptors = useCatalogueStore.getState().descriptors;
  if (!descriptors.length || !commandName) return undefined;

  const desc = descriptors.find(
    (d) => d.commands && d.commands.some((c: any) => c.name === commandName)
  );

  return desc?.trait;
}

export function getDescriptorByTrait(traitKey: string): any | undefined {
  const descriptors = useCatalogueStore.getState().descriptors;
  if (!descriptors.length || !traitKey) return undefined;

  return descriptors.find((d) => d.trait === traitKey);
}

export function getDynamicValueFromParams(
  traitKey: string,
  params: Record<string, any>
): any {
  const descriptor = getDescriptorByTrait(traitKey);
  if (!descriptor || !descriptor.attributes || !params) return undefined;

  const primaryAttr = descriptor.attributes[0];
  if (!primaryAttr) return undefined;

  const attrName = primaryAttr.name;
  let rawValue = params[attrName];

  if (rawValue === undefined || rawValue === null) return undefined;

  // Strip unit if present (e.g. "30%" -> "30")
  if (
    primaryAttr.unit &&
    typeof rawValue === 'string' &&
    rawValue.endsWith(primaryAttr.unit)
  ) {
    rawValue = rawValue.substring(0, rawValue.length - primaryAttr.unit.length);
  }

  // Type casting based on descriptor definitions
  switch (primaryAttr.type) {
    case 'bool':
    case 'boolean':
      return Boolean(rawValue);
    case 'uint8':
    case 'int':
    case 'int32':
    case 'float32':
    case 'number':
      return Number(rawValue);
    default:
      return rawValue;
  }
}

export function buildDynamicPayload(
  traitKey: string,
  value: any
): { command: string; params: Record<string, any> } {
  const descriptor = getDescriptorByTrait(traitKey);
  if (!descriptor) return { command: '', params: {} };

  const command = descriptor.commands?.[0];
  if (!command) return { command: '', params: {} };

  const primaryAttr = descriptor.attributes?.[0];
  if (!primaryAttr) return { command: command.name, params: {} };

  const attrName = primaryAttr.name;

  let castedValue = value;

  // 1. Process basic types and min/max constraints
  switch (primaryAttr.type) {
    case 'bool':
    case 'boolean':
      castedValue = Boolean(value);
      break;
    case 'uint8':
    case 'int':
    case 'int32':
    case 'float32':
    case 'number':
      castedValue = Number(value);
      if (primaryAttr.min !== null && primaryAttr.min !== undefined) {
        castedValue = Math.max(primaryAttr.min, castedValue);
      }
      if (primaryAttr.max !== null && primaryAttr.max !== undefined) {
        castedValue = Math.min(primaryAttr.max, castedValue);
      }
      break;
  }

  // 2. Validate enum if specified
  if (Array.isArray(primaryAttr.enum) && primaryAttr.enum.length > 0) {
    if (!primaryAttr.enum.includes(castedValue)) {
      console.warn(
        `Value "${castedValue}" is not valid for enum [${primaryAttr.enum.join(', ')}]`
      );
    }
  }

  // 3. Format value with unit (e.g. 30 -> "30%")
  if (primaryAttr.unit && castedValue !== undefined && castedValue !== null) {
    castedValue = `${castedValue}${primaryAttr.unit}`;
  }

  return {
    command: command.name,
    params: {
      [attrName]: castedValue
    }
  };
}
