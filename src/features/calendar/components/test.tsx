import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/ui/components/ui/popover';
import { Button } from '@/ui/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { useMemo, useState } from 'react';
import { MultiRegionTree } from '@/ui/components/tree-test';
import { RegionNode } from '@/core/domains/groups';
import { useRegionTreeStore } from '@/core/domains/tree/store';

interface TreeMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TreeMultiSelect = ({
  value,
  onChange,
  placeholder = 'Chọn chi nhánh cha',
  className
}: TreeMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const { treeData } = useRegionTreeStore();

  const displayText = useMemo(() => {
    if (!value?.length) return placeholder;

    const findNodeName = (nodes: RegionNode[], id: string): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.name;
        if (node.children) {
          const found = findNodeName(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const names = value
      .map((id) => findNodeName(treeData, id))
      .filter(Boolean) as string[];
    return names.length > 0 ? names.join(', ') : placeholder;
  }, [value, treeData, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-auto min-h-[31px] w-full justify-between rounded-[4px] px-2 text-xs font-normal',
            className
          )}
        >
          <span className='flex-1 truncate text-left'>{displayText}</span>
          <ChevronDown className='ml-2 h-4 w-4 flex-shrink-0 opacity-60' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
        <CustomScrollbar className='max-h-[400px]'>
          <MultiRegionTree
            data={treeData}
            selectedIds={new Set(value ?? [])}
            onMultiSelect={(regions) => {
              const ids = regions.map((r) => r!.id);
              onChange(ids);
            }}
            height={400}
          />
        </CustomScrollbar>
      </PopoverContent>
    </Popover>
  );
};
