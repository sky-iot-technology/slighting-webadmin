'use client';
import { RegionNode } from '@/core/domains/groups';
import { RegionTree, SelectedRegion } from '@/ui/components/tree-group';

type RegionTreeProps = {
  data: RegionNode[];
  onSelect: (item: SelectedRegion) => void;
  selectedId?: string;
  filter?: boolean;
  classname?: string;
};

export function RegionTreeWrapper({
  data,
  onSelect,
  selectedId,
  filter,
  classname
}: RegionTreeProps) {
  return (
    <RegionTree
      renderNode='default'
      data={data}
      onSelect={onSelect}
      selectedId={selectedId}
      width={'100%'}
      height={171}
      indent={30}
      rowHeight={36}
      overscanCount={1}
      paddingTop={4}
      filter={filter}
      classname={classname}
    />
  );
}
