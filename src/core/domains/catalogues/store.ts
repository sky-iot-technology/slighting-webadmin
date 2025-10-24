import { devtools } from 'zustand/middleware';
import { catalogueApi } from './api';
import { create } from 'zustand';
import { CatalogueListResponseDto } from './types';

type CatalogueState = {
  catalogues: CatalogueListResponseDto['devices'];
  total: number;
  isLoading: boolean;
  error: string | null;

  fetchCatalogues: () => Promise<void>;
  clear: () => void;
};

export const useCatalogueStore = create<CatalogueState>()(
  devtools<CatalogueState>((set) => ({
    catalogues: [],
    total: 0,
    isLoading: false,
    error: null,

    fetchCatalogues: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await catalogueApi.getAll();
        set({
          catalogues: response.devices,
          total: response.total,
          isLoading: false
        });
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || 'Lỗi khi tải danh mục thiết bị'
        });
      }
    },

    clear: () => set({ catalogues: [], total: 0, error: null })
  }))
);
