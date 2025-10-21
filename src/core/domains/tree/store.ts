import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { groupsApi, type RegionNode } from '@/core/domains/groups';
import { buildRegionTree } from './helper';

type RegionTreeState = {
  treeData: RegionNode[];
  isLoading: boolean;
  error: string | null;
  fetchTree: () => Promise<void>;
  clear: () => void;
};

export const useRegionTreeStore = create<RegionTreeState>()(
  devtools((set) => ({
    treeData: [],
    isLoading: false,
    error: null,

    fetchTree: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await groupsApi.getAll();
        const tree = buildRegionTree(res.groups);
        set({ treeData: tree, isLoading: false });
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || 'Lỗi khi tải danh sách khu vực'
        });
      }
    },

    clear: () => set({ treeData: [], error: null })
  }))
);
