import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent
} from '@/ui/components/ui/select';
import { cn } from '@/lib/utils';
import { MultiRegionTree } from '@/ui/components/tree-test';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { useMemo, useState } from 'react';
import { findNodeName } from '../helper';

interface TreeSelectProps {
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
}: TreeSelectProps) => {
  const { treeData } = useRegionTreeStore();
  const [open, setOpen] = useState(false);

  const selectedText = useMemo(() => {
    if (!value?.length) return null;

    const names = value
      .map((id) => findNodeName(treeData, id))
      .filter(Boolean) as string[];

    return names.length > 0 ? names.join(', ') : null;
  }, [value, treeData]);

  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger
        className={cn(
          'h-auto min-h-[31px] w-full justify-between rounded-[4px] px-2 text-xs font-normal',
          className
        )}
      >
        <span
          className={cn(
            'flex-1 truncate text-left',
            selectedText ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {selectedText || placeholder}
        </span>
      </SelectTrigger>

      <SelectContent
        position='popper'
        className='z-[9999] w-[var(--radix-select-trigger-width)] p-0'
      >
        <MultiRegionTree
          data={treeData}
          selectedIds={new Set(value ?? [])}
          onMultiSelect={(regions) => {
            const ids = regions.map((r) => r!.id);
            onChange(ids);
          }}
          height={100}
        />
      </SelectContent>
    </Select>
  );
};
