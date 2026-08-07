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
  const { can, ui } = usePermissionStore();

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
  }, [pathname, can]);

  useEffect(() => {
    if (!isAllowed) {
      toast.error('Bạn không có quyền truy cập trang này');

      // Determine where to redirect
      const nextRoute = getFirstAccessibleRoute(ui);
      console.log(nextRoute);
      if (nextRoute && nextRoute !== pathname) {
        router.replace(nextRoute);
      } else {
        router.replace('/not-found');
      }
    }
  }, [isAllowed, router, ui, pathname]);

  if (!isAllowed) {
    return <NotFound />;
  }

  return <>{children}</>;
}
