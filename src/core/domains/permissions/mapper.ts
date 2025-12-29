import { UIRawPermission } from './types';
import { UIModuleValue } from '@/core/domains/permissions/ui-modules';

export const toBackendPayload = (
  permissions: Record<string, string[]>
): UIRawPermission => {
  return {
    ui: Object.entries(permissions).map(([id, actions]) => ({
      id: id as UIModuleValue,
      actions: actions as any
    }))
  };
};
