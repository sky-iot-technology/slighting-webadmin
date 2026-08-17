'use client';

import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useEffect } from 'react';

export function BootstrapProviders() {
  const { fetchCatalogues, fetchDescriptors } = useCatalogueStore();
  const { fetchTree } = useRegionTreeStore();

  useEffect(() => {
    fetchCatalogues();
    fetchDescriptors();
    fetchTree();
  }, [fetchCatalogues, fetchDescriptors, fetchTree]);

  return null;
}
