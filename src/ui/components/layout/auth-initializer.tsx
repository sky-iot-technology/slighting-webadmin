'use client';

import { useAuthInit } from '@/core/domains/auth';

export function AuthInitializer() {
  useAuthInit();
  return null; // This component doesn't render anything
}
