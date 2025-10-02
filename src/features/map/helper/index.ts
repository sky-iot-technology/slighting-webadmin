import { Device } from '@/core/domains/devices';
import {
  GroupListResponseDto,
  GroupNode,
  RegionNode
} from '@/core/domains/groups';

export function getSensorAttributes(data: Device) {
  if (!data || !Array.isArray(data.devices)) {
    return null;
  }
  const sensor = data.devices.find(
    (d) => d.type === 'lms.devices.types.SENSOR'
  );
  if (!sensor?.last_state) return null;
  return {
    electric: sensor.last_state.active_e,
    temperature: sensor.last_state.temperature
  };
}

export function diffTimeHMS(updatedAt: string) {
  const end = new Date().getTime();
  const start = new Date(updatedAt).getTime();

  const diffMs = end - start;
  const minutes = Math.floor(diffMs / 1000 / 60);

  return minutes;
}

export function mapGroupsToRegionNodes(
  apiResponse: GroupListResponseDto
): RegionNode[] {
  return apiResponse.groups.map((g) => ({
    id: String(g.id),
    name: g.name,
    children: []
  }));
}

export function mapGroupHierarchyToRegionNodes(
  groups: GroupNode[]
): RegionNode[] {
  return groups.map((g) => ({
    id: String(g.id),
    name: g.name,
    children: g.children
      ? mapGroupHierarchyToRegionNodes(g.children)
      : undefined
  }));
}

export function mergeHierarchyIntoRoots(
  roots: RegionNode[],
  selectId: string,
  hierarchyGroups: RegionNode[]
): RegionNode[] {
  const selectedRoot = hierarchyGroups.find((g) => g.id === selectId);
  return roots.map((root) => {
    if (root.id === selectId && selectedRoot) {
      return {
        ...root,
        children: selectedRoot?.children ?? []
      };
    }
    return root;
  });
}
