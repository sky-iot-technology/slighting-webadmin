'use client';

import NotFound from '@/app/not-found';
import {
  getFirstAccessibleRoute,
  ROUTE_PERMISSION_MAP,
  usePermissionStore
} from '@/core/domains/permissions';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

interface RBACGuardProps {
  children: React.ReactNode;
}

export function RBACGuard({ children }: RBACGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ui = usePermissionStore((state) => state.ui);
  const can = usePermissionStore((state) => state.can);

  const isAllowed = useMemo(() => {
    const matchingRoute = ROUTE_PERMISSION_MAP.filter(
      (route) =>
        pathname === route.path || pathname.startsWith(`${route.path}/`)
    ).sort((a, b) => b.path.length - a.path.length)[0];

    if (!matchingRoute) {
      return true;
    }

    const { module, action } = matchingRoute.permission;
    return can(module, action);
  }, [pathname, can, ui]);

  useEffect(() => {
    if (!isAllowed) {
      // Determine where to redirect
      const nextRoute = getFirstAccessibleRoute(ui);
      console.log(nextRoute);
      if (nextRoute && nextRoute !== pathname) {
        router.replace(nextRoute);
      }
    }
  }, [isAllowed, router, ui, pathname]);

  if (!isAllowed) {
    return null; // Render blank page
  }

  return <>{children}</>;
}
