export const UIActions = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  SYNC: 'sync'
} as const;

export type UIAction = (typeof UIActions)[keyof typeof UIActions];
