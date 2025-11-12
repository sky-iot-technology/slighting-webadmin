'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  useBreadcrumbsContext,
  useBreadcrumbsContextOptional
} from '../context/breadcrumbs-context';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  // Get custom breadcrumbs from context (optional - returns undefined if not in provider)
  const context = useBreadcrumbsContextOptional();
  const customBreadcrumbs = context?.customBreadcrumbs ?? null;

  const breadcrumbs = useMemo(() => {
    // If custom breadcrumbs are set, use them
    if (customBreadcrumbs !== null) {
      return customBreadcrumbs;
    }

    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname, customBreadcrumbs]);

  return breadcrumbs;
}

/**
 * Hook to replace the breadcrumbs component with custom content in the header.
 * Use this in your page component to render custom content instead of breadcrumbs.
 *
 * @example
 * ```tsx
 * const content = useMemo(() => (
 *   <div className="flex items-center gap-2">
 *     <Button variant="ghost" size="sm">Back</Button>
 *     <span>Custom Header Content</span>
 *   </div>
 * ), [dependencies]);
 * useCustomBreadcrumbContent(content);
 * ```
 */
export function useCustomBreadcrumbContent(content: ReactNode | null) {
  const { setCustomContent } = useBreadcrumbsContext();
  const contentRef = useRef<ReactNode | null>(null);

  useEffect(() => {
    // Only update if content actually changed (compare by reference)
    if (contentRef.current !== content) {
      contentRef.current = content;
      setCustomContent(content);
    }

    // Clear custom content when component unmounts
    return () => {
      setCustomContent(null);
      contentRef.current = null;
    };
  }, [content, setCustomContent]);
}

/**
 * Hook to set custom breadcrumbs for the current page.
 * Use this in your page component to customize breadcrumbs.
 *
 * @example
 * ```tsx
 * useSetBreadcrumbs([
 *   { title: 'Dashboard', link: '/dashboard' },
 *   { title: 'Product', link: '/dashboard/product' },
 *   { title: 'Device Details', link: '/dashboard/product/info/123' }
 * ]);
 * ```
 */
export function useSetBreadcrumbs(breadcrumbs: BreadcrumbItem[] | null) {
  const { setBreadcrumbs } = useBreadcrumbsContext();

  useEffect(() => {
    // Set breadcrumbs when component mounts
    setBreadcrumbs(breadcrumbs);

    // Clear breadcrumbs when component unmounts
    return () => {
      setBreadcrumbs(null);
    };
  }, [breadcrumbs, setBreadcrumbs]);
}
