'use client';

import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useEffect, useRef } from 'react';

export function BootstrapProviders() {
  const { fetchCatalogues } = useCatalogueStore();
  const { fetchTree } = useRegionTreeStore();

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    fetchCatalogues();
    fetchTree();
    hasFetched.current = true;
  }, [fetchCatalogues, fetchTree]);

  return null;
}
