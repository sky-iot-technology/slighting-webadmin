import type { PaginateQuery } from '@/core/shared/types';

type KeyParams = {
  [key: string]: any;
};

export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// for infinite query pages to flatList data
export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages
    ? pages.reduce((prev: T[], current) => [...prev, ...current.results], [])
    : [];
}

// a function that accept a url and return params as an object
export function getUrlParameters(
  url: string | null
): { [k: string]: string } | null {
  if (url === null) {
    return null;
  }
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    if (match[1] !== null) {
      //@ts-ignore
      params[match[1]] = match[2];
    }
  }
  return params;
}

// For TanStack Query, TPageParam is string | undefined
export const getNextPageParam = (
  lastPage: PaginateQuery<unknown>
): string | undefined => {
  const params = getUrlParameters(lastPage.next);
  return params?.offset ?? undefined;
};

export const getPreviousPageParam = (
  firstPage: PaginateQuery<unknown>
): string | undefined => {
  const params = getUrlParameters(firstPage.previous);
  return params?.offset ?? undefined;
};

// Query keys factory for better organization
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
  sales: {
    all: ['sales'] as const,
    recent: () => [...queryKeys.sales.all, 'recent'] as const,
    stats: () => [...queryKeys.sales.all, 'stats'] as const,
  },
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
} as const;
