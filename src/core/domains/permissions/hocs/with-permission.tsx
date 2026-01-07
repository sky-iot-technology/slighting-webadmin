import React, { ComponentType } from 'react';
import { PermissionGuard } from '../components/permission-guard';

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  module: string,
  action: string | string[],
  requireAll: boolean = false,
  fallback: React.ReactNode = null
) {
  return function WithPermissionComponent(props: P) {
    return (
      <PermissionGuard
        module={module}
        action={action}
        requireAll={requireAll}
        fallback={fallback}
      >
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}
