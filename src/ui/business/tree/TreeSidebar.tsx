import { useRegionTreeStore } from '@/core/domains/tree/store';
import { RegionTree, SelectedRegion } from '@/ui/components/tree-group';
import { memo, useEffect, useState } from 'react';

function TreeSidebar({
  selectedRegion,
  onRegionChange,
  searchTerm
}: {
  selectedRegion: SelectedRegion | null;
  onRegionChange: (r: SelectedRegion) => void;
  searchTerm?: string;
}) {
  const { treeData } = useRegionTreeStore();

  return (
    <RegionTree
      searchTerm={searchTerm}
      renderNode='icon'
      data={treeData}
      selectedId={selectedRegion?.id}
      onSelect={onRegionChange}
      width='100%'
      height={550}
      indent={25}
      rowHeight={36}
    />
  );
}

export default memo(TreeSidebar);
