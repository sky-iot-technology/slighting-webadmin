import { RegionNode } from '@/core/domains/groups';
import Image from 'next/image';
import { ReactNode, useCallback, useRef, useEffect, ChangeEvent } from 'react';
import { NodeRendererProps, Tree } from 'react-arborist';

export type SelectedRegion = { id: string; name: string } | null;
export type SelectedRegions = SelectedRegion[];

const getSubtreeIds = (node: RegionNode, allIds: Set<string> = new Set()) => {
  allIds.add(node.id);
  if (node.children) {
    node.children.forEach((child) => getSubtreeIds(child, allIds));
  }
  return allIds;
};

const isEntireSubtreeSelected = (
  node: RegionNode,
  selectedIds: Set<string>
): boolean => {
  if (!selectedIds.has(node.id)) return false;
  if (node.children) {
    return node.children.every((child) =>
      isEntireSubtreeSelected(child, selectedIds)
    );
  }
  return true;
};

const hasSomeSelectedInSubtree = (
  node: RegionNode,
  selectedIds: Set<string>
): boolean => {
  if (selectedIds.has(node.id)) return true;
  if (node.children) {
    return node.children.some((child) =>
      hasSomeSelectedInSubtree(child, selectedIds)
    );
  }
  return false;
};

type MultiRegionTreeProps = {
  data: RegionNode[];
  onMultiSelect: (items: SelectedRegions) => void;
  selectedIds?: Set<string>;
  classname?: string;
  width?: number | string;
  height?: number;
  indent?: number;
  rowHeight?: number;
  paddingTop?: number;
  padding?: number;
  overscanCount?: number;
};

export function MultiRegionTree({
  data,
  onMultiSelect,
  selectedIds = new Set<string>(),
  classname = 'text-xs [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-all [&::-webkit-thumb]:duration-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent',
  width = '100%',
  height,
  indent = 25,
  rowHeight,
  paddingTop,
  padding,
  overscanCount
}: MultiRegionTreeProps) {
  const handleSelect = useCallback(
    (payload: { id: string; name: string }, node: RegionNode) => {
      let newSelected = new Set(selectedIds);
      const isCurrentlySelected = newSelected.has(payload.id);

      const isChildOfSelectedParent = (nodeId: string): boolean => {
        const findParent = (
          nodes: RegionNode[],
          targetId: string
        ): RegionNode | null => {
          for (const n of nodes) {
            if (n.children) {
              for (const child of n.children) {
                if (child.id === targetId) return n;
                const found = findParent([child], targetId);
                if (found) return found;
              }
            }
          }
          return null;
        };

        const parent = findParent(data, nodeId);
        return parent ? newSelected.has(parent.id) : false;
      };

      if (isChildOfSelectedParent(payload.id)) {
        return;
      }

      if (isCurrentlySelected) {
        newSelected.delete(payload.id);
        if (node.children) {
          const childrenIds = getSubtreeIds(node);
          childrenIds.forEach((id) => {
            if (id !== payload.id) {
              newSelected.delete(id);
            }
          });
        }
      } else {
        newSelected.add(payload.id);
        if (node.children) {
          const childrenIds = getSubtreeIds(node);
          childrenIds.forEach((id) => {
            if (id !== payload.id) {
              newSelected.delete(id);
            }
          });
        }
      }

      const convertChildrenToParent = (
        nodes: RegionNode[],
        selectedSet: Set<string>
      ): Set<string> => {
        const newSet = new Set(selectedSet);
        let hasChanges = false;

        const processNode = (currentNode: RegionNode) => {
          // Nếu node có children
          if (currentNode.children && currentNode.children.length > 0) {
            // Đệ quy xử lý children trước
            currentNode.children.forEach(processNode);

            // Kiểm tra xem tất cả children có được chọn không
            const allChildrenSelected = currentNode.children.every((child) =>
              newSet.has(child.id)
            );

            // Nếu tất cả children được chọn VÀ parent chưa được chọn
            if (allChildrenSelected && !newSet.has(currentNode.id)) {
              // Xóa tất cả children, thêm parent
              currentNode.children.forEach((child) => {
                const childSubtreeIds = getSubtreeIds(child);
                childSubtreeIds.forEach((id) => newSet.delete(id));
              });
              newSet.add(currentNode.id);
              hasChanges = true;
            }

            // Nếu parent được chọn, đảm bảo children bị xóa
            if (newSet.has(currentNode.id)) {
              currentNode.children.forEach((child) => {
                const childSubtreeIds = getSubtreeIds(child);
                childSubtreeIds.forEach((id) => newSet.delete(id));
              });
            }
          }
        };

        nodes.forEach(processNode);

        // Nếu có thay đổi, tiếp tục kiểm tra lại (vì có thể tạo ra parent mới được chọn)
        if (hasChanges) {
          return convertChildrenToParent(nodes, newSet);
        }

        return newSet;
      };

      newSelected = convertChildrenToParent(data, newSelected);

      const selectedArray: SelectedRegions = Array.from(newSelected).map(
        (id) => ({
          id,
          name: id === payload.id ? payload.name : ''
        })
      );
      onMultiSelect(newSelected.size === 0 ? [] : selectedArray);
    },
    [selectedIds, onMultiSelect]
  );

  return (
    <Tree
      data={data}
      openByDefault={false}
      width={width}
      height={height}
      indent={indent}
      rowHeight={rowHeight}
      overscanCount={overscanCount}
      paddingTop={paddingTop}
      padding={padding}
      className={classname}
      onSelect={() => {}}
    >
      {(props) => (
        <MultiDefaultNode
          {...props}
          onMultiSelect={handleSelect}
          selectedIds={selectedIds}
        />
      )}
    </Tree>
  );
}

type MultiNodeProps = NodeRendererProps<RegionNode> & {
  onMultiSelect: (
    payload: { id: string; name: string },
    node: RegionNode
  ) => void;
  selectedIds?: Set<string>;
};

function MultiDefaultNode({
  node,
  style,
  dragHandle,
  onMultiSelect,
  selectedIds
}: MultiNodeProps) {
  const isSelected = selectedIds?.has(node.data.id) ?? false;
  const hasChildren = !!node.data.children?.length;

  const entireSubtreeSelected = hasChildren
    ? isEntireSubtreeSelected(node.data, selectedIds ?? new Set())
    : isSelected;

  const someSelectedInSubtree = hasChildren
    ? hasSomeSelectedInSubtree(node.data, selectedIds ?? new Set())
    : false;

  const indeterminate =
    hasChildren && someSelectedInSubtree && !entireSubtreeSelected;

  const displayChecked = isSelected || entireSubtreeSelected;

  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div
      style={{
        ...style,
        paddingLeft: node.level === 0 ? 8 : style.paddingLeft
      }}
      ref={dragHandle}
      className={`hover:bg-primary/5 mx-1 flex items-center gap-1 rounded-md px-2 py-1`}
    >
      {!node.isLeaf ? (
        <span
          className='w-[12px] cursor-pointer select-none'
          onClick={(e) => {
            e.stopPropagation();
            node.toggle();
          }}
        >
          {node.isOpen ? (
            <Image
              src={`/assets/icons/chevronDown.svg`}
              alt='chevronDown'
              width={9}
              height={9}
            />
          ) : (
            <Image
              src={`/assets/icons/chevronRight.svg`}
              alt='chevronRight'
              width={4.5}
              height={8.25}
            />
          )}
        </span>
      ) : (
        <span className='inline-block h-[9px] w-3' />
      )}

      <input
        type='checkbox'
        ref={checkboxRef}
        checked={displayChecked}
        onChange={(e) => {
          e.stopPropagation();
          onMultiSelect({ id: node.data.id, name: node.data.name }, node.data);
        }}
        className='mr-1'
      />

      <span
        className={`flex-1 cursor-pointer truncate text-left`}
        onClick={(e) => {
          e.stopPropagation();
          onMultiSelect({ id: node.data.id, name: node.data.name }, node.data);
        }}
      >
        {node.data.name}
      </span>
    </div>
  );
}
