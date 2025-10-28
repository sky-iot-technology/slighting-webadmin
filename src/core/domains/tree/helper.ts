import { Group, RegionNode } from '../groups';
import slugify from 'slugify';

export function buildRegionTree(groups: Group[]): RegionNode[] {
  const map = new Map<string, RegionNode>();
  const roots: RegionNode[] = [];

  for (const g of groups) {
    map.set(String(g.id), {
      id: String(g.id),
      name: g.name,
      slug: slugify(g.name, { lower: true, strict: true }),
      children: []
    });
  }

  for (const g of groups) {
    const node = map.get(String(g.id))!;

    if (g.parent_id) {
      const parent = map.get(g.parent_id);
      if (parent) {
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}
