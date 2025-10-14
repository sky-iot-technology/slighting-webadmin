'use client';
import { useState, useEffect } from 'react';
import {
  useGetGroups,
  useGetGroupHierarchy,
  RegionNode
} from '@/core/domains/groups';
import {
  mapGroupsToRegionNodes,
  mapGroupHierarchyToRegionNodes,
  mergeHierarchyIntoRoots
} from '@/features/map/helper';

export function useRegionTreeData() {
  const [treeData, setTreeData] = useState<RegionNode[]>([]);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const { data: regions, isLoading } = useGetGroups({ root_group: true });
  const { data: hierarchy } = useGetGroupHierarchy(
    expandedNodeId ?? '',
    undefined,
    {
      enabled: !!expandedNodeId
    }
  );

  useEffect(() => {
    if (regions) setTreeData(mapGroupsToRegionNodes(regions));
  }, [regions]);

  useEffect(() => {
    if (hierarchy && expandedNodeId) {
      setTreeData((prev) =>
        mergeHierarchyIntoRoots(
          prev,
          expandedNodeId,
          mapGroupHierarchyToRegionNodes(hierarchy.groups)
        )
      );
    }
  }, [hierarchy, expandedNodeId]);

  return { treeData, setExpandedNodeId, isLoading };
}
