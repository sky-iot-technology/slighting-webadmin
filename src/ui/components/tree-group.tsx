import { RegionNode } from '@/core/domains/groups';
import Image from 'next/image';
import { ReactNode } from 'react';
import { NodeRendererProps, Tree } from 'react-arborist';

export type SelectedRegion = { id: string; name: string } | null;

type RegionTreeProps = {
  data: RegionNode[];
  onSelect: (item: SelectedRegion) => void;
  onToggle: (node: RegionNode) => void;
  selectedId?: string;
  renderNode?:
    | ((
        props: NodeRendererProps<RegionNode> & {
          onSelect: (payload: { id: string; name: string }) => void;
          onToggle: (node: RegionNode) => void;
          selectedId?: string | null;
        }
      ) => ReactNode)
    | 'default'
    | 'icon';
  containerClassName?: string;
  classname?: string;
  width?: number;
  height?: number;
  indent?: number;
  rowHeight?: number;
  paddingTop?: number;
  overscanCount?: number;
};

const nodeRenderers = {
  default: DefaultNode,
  icon: IconNode
};

export function RegionTree({
  data,
  onSelect,
  onToggle,
  selectedId,
  renderNode = DefaultNode,
  containerClassName = 'w-[217px] h-[171px] box-border pl-2',
  classname = 'text-xs [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-all [&::-webkit-scrollbar-thumb]:duration-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent',
  width,
  height,
  indent,
  rowHeight,
  paddingTop,
  overscanCount
}: RegionTreeProps) {
  const renderFn =
    typeof renderNode === 'string' ? nodeRenderers[renderNode] : renderNode;

  return (
    <div className={containerClassName}>
      <Tree
        data={data}
        openByDefault={false}
        width={width}
        height={height}
        indent={indent}
        rowHeight={rowHeight}
        overscanCount={overscanCount}
        paddingTop={paddingTop}
        className={classname}
      >
        {(props) => renderFn({ ...props, onSelect, onToggle, selectedId })}
      </Tree>
    </div>
  );
}

type NodeProps = NodeRendererProps<RegionNode> & {
  onSelect: (payload: { id: string; name: string }) => void;
  onToggle: (node: RegionNode) => void;
  selectedId?: string | null;
};

function DefaultNode({
  node,
  style,
  dragHandle,
  onSelect,
  onToggle,
  selectedId
}: NodeProps) {
  const isSelected = node.data.id === selectedId;
  return (
    <div
      style={{ ...style, maxWidth: '209px' }}
      ref={dragHandle}
      className={`flex w-full items-center gap-1 rounded px-2 py-1`}
    >
      {!node.isLeaf && (
        <span
          className='cursor-pointer select-none'
          onClick={() => {
            node.toggle();
            onToggle(node.data);
          }}
        >
          {node.isOpen ? (
            <Image
              src={`/assets/icons/chevronDown.svg`}
              alt='chevronDown'
              width={12}
              height={12}
              className='h-3 w-3'
            />
          ) : (
            <Image
              src={`/assets/icons/chevronRight.svg`}
              alt='chevronRight'
              width={12}
              height={12}
              className='h-3 w-3'
            />
          )}
        </span>
      )}
      <button
        type='button'
        className={`cursor-pointer appearance-none truncate text-left ${isSelected ? 'font-bold' : 'hover:bg-primary/10'}`}
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
  onToggle,
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

  return (
    <div
      style={{ ...style, maxWidth: '209px' }}
      ref={dragHandle}
      className={`flex w-full items-center gap-1 rounded px-2 py-1`}
    >
      {!node.isLeaf && (
        <span
          className='cursor-pointer select-none'
          onClick={() => {
            node.toggle();
            onToggle(node.data);
          }}
        >
          {node.isOpen ? (
            <Image
              src={`/assets/icons/chevronDown.svg`}
              alt='chevronDown'
              width={12}
              height={12}
              className='h-3 w-3'
            />
          ) : (
            <Image
              src={`/assets/icons/chevronRight.svg`}
              alt='chevronRight'
              width={12}
              height={12}
              className='h-3 w-3'
            />
          )}
        </span>
      )}
      <button
        type='button'
        className={`flex cursor-pointer appearance-none items-center gap-1 truncate text-left ${isSelected ? 'font-bold' : 'hover:bg-primary/10'}`}
        onClick={() => onSelect({ id: node.data.id, name: node.data.name })}
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
