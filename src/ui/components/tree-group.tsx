import { RegionNode } from '@/core/domains/groups';
import { useTranslation } from '@/core/domains/language/useTranslation';
import Image from 'next/image';
import { ReactNode } from 'react';
import { NodeRendererProps, Tree } from 'react-arborist';

export type SelectedRegion = { id: string; name: string; icon?: string } | null;

type RegionTreeProps = {
  data: RegionNode[];
  onSelect: (item: SelectedRegion) => void;
  selectedId?: string;
  renderNode?:
    | ((
        props: NodeRendererProps<RegionNode> & {
          onSelect: (payload: { id: string; name: string }) => void;
          selectedId?: string | null;
        }
      ) => ReactNode)
    | 'default'
    | 'icon';
  classname?: string;
  width?: number | string;
  height?: number;
  indent?: number;
  rowHeight?: number;
  paddingTop?: number;
  padding?: number;
  overscanCount?: number;
  searchTerm?: string;
  searchMatch?: (node: any, term: string) => boolean;
  filter?: boolean;
  showSelectAll?: boolean;
};

const nodeRenderers = {
  default: DefaultNode,
  icon: IconNode
};

export function RegionTree({
  data,
  onSelect,
  selectedId,
  renderNode = DefaultNode,
  classname = 'text-xs [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-all [&::-webkit-scrollbar-thumb]:duration-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent',
  width = '100%',
  height,
  indent = 25,
  rowHeight,
  paddingTop,
  padding,
  overscanCount,
  searchTerm = '',
  searchMatch,
  filter = false,
  showSelectAll = false
}: RegionTreeProps) {
  const { t } = useTranslation();

  const enhancedData: RegionNode[] =
    filter || showSelectAll
      ? [
          {
            id: '__all__',
            slug: 'all',
            name: t('branch.all'),
            children: []
          },
          ...data
        ]
      : data;

  const renderFn =
    typeof renderNode === 'string' ? nodeRenderers[renderNode] : renderNode;

  return (
    <Tree
      data={enhancedData}
      searchTerm={searchTerm}
      searchMatch={searchMatch}
      openByDefault={false}
      width={width}
      height={height}
      indent={indent}
      rowHeight={rowHeight}
      overscanCount={overscanCount}
      paddingTop={paddingTop}
      padding={padding}
      className={classname}
    >
      {(props) => renderFn({ ...props, onSelect, selectedId })}
    </Tree>
  );
}

type NodeProps = NodeRendererProps<RegionNode> & {
  onSelect: (payload: { id: string; name: string; icon?: string }) => void;
  selectedId?: string | null;
};

function DefaultNode({
  node,
  style,
  dragHandle,
  onSelect,
  selectedId
}: NodeProps) {
  const isSelected =
    (selectedId == null && node.data.id === '__all__') ||
    node.data.id === selectedId;
  const hasChildren =
    Array.isArray(node.data.children) && node.data.children.length > 0;

  return (
    <div
      style={{
        ...style,
        paddingLeft: node.level === 0 ? 8 : style.paddingLeft
      }}
      ref={dragHandle}
      className={`hover:bg-primary/5 mx-1 flex items-center gap-1 rounded-md px-2 py-1 ${isSelected ? 'bg-tree-select text-primary' : 'hover:bg-tree-hover'}`}
    >
      {hasChildren ? (
        <span
          className='w-[12px] cursor-pointer select-none'
          onClick={() => {
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
      <button
        type='button'
        className={`flex-1 cursor-pointer appearance-none truncate text-left`}
        onClick={() => onSelect({ id: node.data.id, name: node.data.name })}
      >
        {node.data.name}
      </button>
    </div>
  );
}

function IconNode({
  node,
  style,
  dragHandle,
  onSelect,
  selectedId
}: NodeProps) {
  const isSelected = node.data.id === selectedId;

  const getIconForLevel = (level: number) => {
    switch (level) {
      case 0:
        return '/assets/icons/tree-city.svg';
      case 1:
        return '/assets/icons/tree-location.svg';
      case 2:
        return '/assets/icons/tree-circle.svg';
      case 3:
        return '/assets/icons/tree-dot.svg';
      default:
        return '/assets/icons/tree-dot.svg';
    }
  };

  const hasChildren =
    Array.isArray(node.data.children) && node.data.children.length > 0;

  return (
    <div
      style={{
        ...style,
        paddingLeft: node.level === 0 ? 8 : style.paddingLeft
      }}
      ref={dragHandle}
      className={`hover:bg-primary/5 mx-1 flex items-center gap-1 rounded px-2 py-1 ${isSelected ? 'bg-tree-select text-primary' : 'hover:bg-tree-hover'}`}
    >
      {hasChildren ? (
        <span
          className='w-[12px] cursor-pointer select-none'
          onClick={() => {
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
      <button
        type='button'
        className={`flex flex-1 cursor-pointer appearance-none items-center gap-1 truncate text-left`}
        onClick={() =>
          onSelect({
            id: node.data.id,
            name: node.data.name,
            icon: getIconForLevel(node.level)
          })
        }
      >
        <Image
          src={getIconForLevel(node.level)}
          alt='icon'
          width={10}
          height={10}
          className='h-[10px] w-[10px]'
        />
        {node.data.name}
      </button>
    </div>
  );
}
