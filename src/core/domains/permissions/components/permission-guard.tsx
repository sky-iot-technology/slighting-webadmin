import { ReactNode } from 'react';

interface PermissionGuardProps {
  module: string;
  action: string | string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({
  module,
  action,
  requireAll = false,
  children,
  fallback = null
}: PermissionGuardProps) {
  const actions = Array.isArray(action) ? action : [action];

  // We can't use the hook in a loop meaningfully if the hook depends on static module/action.
  // However, useCan takes arguments.
  // IMPORTANT: The existing useCan hook implementation:
  // export const useCan = (module: string, action: string) =>
  //   usePermissionStore((state) => state.ui[module]?.has(action) ?? false);
  // It uses the store directly. We can replicate the logic here to support arrays without calling hooks in loops.

  // Actually, better to import the store hook directly and select what we need to avoid multiple subscriptions if possible,
  // or just use the store state.

  const hasPermission = useCanCheck(module, actions, requireAll);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Helper hook to check permissions with array support
import { usePermissionStore } from '../store';

function useCanCheck(module: string, actions: string[], requireAll: boolean) {
  return usePermissionStore((state) => {
    if (requireAll) {
      return actions.every((act) => state.can(module, act));
    } else {
      return actions.some((act) => state.can(module, act));
    }
  });
}
