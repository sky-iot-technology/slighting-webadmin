'use client';
import { RegionNode } from '@/core/domains/groups';
import { RegionTree, SelectedRegion } from '@/ui/components/tree-group';

type RegionTreeProps = {
  data: RegionNode[];
  onSelect: (item: SelectedRegion) => void;
  onToggle: (node: RegionNode) => void;
  selectedId?: string;
};

export function RegionTreeWrapper({
  data,
  onSelect,
  onToggle,
  selectedId
}: RegionTreeProps) {
  return (
    <RegionTree
      renderNode='icon'
      data={data}
      onSelect={onSelect}
      onToggle={onToggle}
      selectedId={selectedId}
      containerClassName='w-[217px] h-[171px] box-border pl-2'
      width={209}
      height={171}
      indent={25}
      rowHeight={36}
      overscanCount={1}
      paddingTop={10}
    />
  );
}
