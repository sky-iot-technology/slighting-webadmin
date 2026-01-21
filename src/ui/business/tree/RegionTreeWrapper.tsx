'use client';
import { RegionNode } from '@/core/domains/groups';
import { RegionTree, SelectedRegion } from '@/ui/components/tree-group';

import { useTranslation } from '@/core/domains/language/useTranslation';
import { cn } from '@/lib/utils';

type RegionTreeProps = {
  data: RegionNode[];
  onSelect: (item: SelectedRegion) => void;
  selectedId?: string;
  filter?: boolean;
  classname?: string;
  showSelectAll?: boolean;
  onSelectAll?: () => void;
};

export function RegionTreeWrapper({
  data,
  onSelect,
  selectedId,
  filter,
  classname,
  showSelectAll,
  onSelectAll
}: RegionTreeProps) {
  const { t } = useTranslation();

  const handleSelect = (item: SelectedRegion) => {
    if (item?.id === '__all__') {
      onSelectAll?.();
    } else {
      onSelect(item);
    }
  };

  return (
    <RegionTree
      renderNode='default'
      data={data}
      onSelect={handleSelect}
      selectedId={selectedId}
      width={'100%'}
      height={171}
      indent={30}
      rowHeight={36}
      overscanCount={1}
      paddingTop={4}
      filter={filter}
      classname={classname}
      showSelectAll={showSelectAll}
    />
  );
}
