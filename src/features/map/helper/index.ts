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

export function diffTimeHMS(updatedAt: string): string {
  const end = Date.now();
  const start = new Date(updatedAt).getTime();
  const diffMs = end - start;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // gần đúng
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 5) return `${weeks} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${years} năm trước`;
}

export function mapGroupsToRegionNodes(
  apiResponse: GroupListResponseDto
): RegionNode[] {
  if (!apiResponse?.groups || !Array.isArray(apiResponse.groups)) return [];
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
    children: Array.isArray(g.children)
      ? g.children.length > 0
        ? mapGroupHierarchyToRegionNodes(g.children)
        : []
      : undefined
  }));
}

export function mergeHierarchyIntoRoots(
  roots: RegionNode[],
  selectId: string,
  hierarchyGroups: RegionNode[]
): RegionNode[] {
  return roots.map((root) => {
    if (root.id === selectId) {
      const matched = hierarchyGroups.find((h) => h.id === selectId);
      return {
        ...root,
        children: matched?.children ?? []
      };
    }

    if (root.children?.length) {
      return {
        ...root,
        children: mergeHierarchyIntoRoots(
          root.children,
          selectId,
          hierarchyGroups
        )
      };
    }

    return root;
  });
}
