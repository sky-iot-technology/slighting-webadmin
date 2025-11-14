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

export const toFrontendState = (list: UIRawPermission) => {
  const selectedModules = list.ui.map((x) => x.id);
  const permissions: Record<string, string[]> = {};

  list.ui.forEach((p) => {
    permissions[p.id] = p.actions;
  });

  return { selectedModules, permissions };
};
