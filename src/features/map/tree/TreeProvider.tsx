'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  RegionNode,
  useGetGroupHierarchy,
  useGetGroups
} from '@/core/domains/groups';
import {
  mapGroupHierarchyToRegionNodes,
  mapGroupsToRegionNodes,
  mergeHierarchyIntoRoots
} from '../helper';
import { SelectedRegion } from '@/ui/components/tree-group';
import { RegionTreeWrapper } from './RegionTreeWrapper';

type TreeProviderProps = {
  selectedRegion?: SelectedRegion;
  onRegionChange: (region: SelectedRegion) => void;
};

export function TreeProvider({
  selectedRegion,
  onRegionChange
}: TreeProviderProps) {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [treeData, setTreeData] = useState<RegionNode[]>([]);

  const {
    data: regions,
    isLoading: isRegionsLoading,
    error: regionError
  } = useGetGroups({ root_group: true });
  const { data: hierarchy } = useGetGroupHierarchy(
    expandedNodeId ?? '',
    undefined,
    {
      enabled: !!expandedNodeId
    }
  );

  useEffect(() => {
    if (regions) {
      const tree = mapGroupsToRegionNodes(regions);
      setTreeData(tree);
    }
  }, [regions]);

  useEffect(() => {
    if (hierarchy && expandedNodeId) {
      setTreeData((prev) => {
        const newTree = mergeHierarchyIntoRoots(
          prev,
          expandedNodeId,
          mapGroupHierarchyToRegionNodes(hierarchy.groups)
        );
        return newTree;
      });
    }
  }, [hierarchy, expandedNodeId]);

  if (isRegionsLoading || !regions) return null;

  return (
    <div className='relative h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]'>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='border-input bg-background flex h-full w-full items-center justify-between rounded-md border px-3 py-[2px] text-left focus:outline-none sm:py-[4px] md:py-[6px]'
      >
        <span
          className={
            selectedRegion?.name ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {selectedRegion?.name || 'Chọn khu vực'}
        </span>

        <Image
          src={
            open
              ? '/assets/icons/chevronRight.svg'
              : '/assets/icons/chevronDown.svg'
          }
          alt='toggle'
          width={12}
          height={12}
          className='h-3 w-3'
        />
      </button>
      {open && (
        <div className='bg-popover absolute z-10 mt-0.5 w-[160px] overflow-x-hidden overflow-y-auto rounded-md border sm:w-[180px] md:w-[217px]'>
          <RegionTreeWrapper
            data={treeData}
            onSelect={(item) => {
              onRegionChange(item);
              setOpen(false);
            }}
            onToggle={(node) => setExpandedNodeId(node.id)}
            selectedId={selectedRegion?.id}
          />
        </div>
      )}
    </div>
  );
}
