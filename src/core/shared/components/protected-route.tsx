'use client';

import {
  useAuthLoading,
  useIsAuthenticated,
  useAuthStore
} from '@/core/domains/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth/sign-in'
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const domainId = useAuthStore((s) => s.domainId);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    } else if (
      !isLoading &&
      isAuthenticated &&
      !domainId &&
      !pathname.startsWith('/auth/')
    ) {
      router.push('/auth/select-domain');
    }
  }, [isAuthenticated, isLoading, domainId, router, redirectTo, pathname]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isAuthenticated && !domainId && !pathname.startsWith('/auth/')) {
    return null;
  }

  return <>{children}</>;
}
