import { useRegionTreeStore } from '@/core/domains/tree/store';
import { RegionTree, SelectedRegion } from '@/ui/components/tree-group';
import { MultiRegionTree, SelectedRegions } from '@/ui/components/tree-test';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { memo, useEffect, useState } from 'react';

function CalendarTree({
  selectedRegion,
  onRegionChange
}: {
  selectedRegion: SelectedRegion | null;
  onRegionChange: (r: SelectedRegion) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { treeData } = useRegionTreeStore();
  console.log(treeData);
  // const handleMulti = (regions: SelectedRegions) => {
  //   const newSet = new Set(regions.map((r) => r!.id));
  //   setSelectedIds(newSet);

  //   if (regions.length > 0) {
  //     onRegionChange(regions[0]);
  //   }
  // };

  // useEffect(() => {
  //   console.log(selectedIds);
  // }, [selectedIds, setSelectedIds])

  return (
    <RegionTree
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
  // return (<MultiRegionTree
  //   data={treeData}
  //   selectedIds={selectedIds}
  //   onMultiSelect={handleMulti}
  //   onToggle={(node) => setExpandedNodeId(node.id)}
  //   height={500}
  // />)
}

export default memo(CalendarTree);
