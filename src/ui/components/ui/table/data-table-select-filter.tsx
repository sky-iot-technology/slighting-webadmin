'use client';

import * as React from 'react';
import type { Column } from '@tanstack/react-table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/ui/components/ui/select';

interface Option {
  label: string;
  value: string;
}

interface DataTableSelectFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function DataTableSelectFilter<TData, TValue>({
  column,
  title,
  options,
  placeholder = 'Chọn...',
  className
}: DataTableSelectFilterProps<TData, TValue>) {
  const columnFilterValue = column?.getFilterValue() as string[] | undefined;
  const [value, setValue] = React.useState<string | undefined>(
    columnFilterValue?.[0]
  );

  React.useEffect(() => {
    setValue(columnFilterValue?.[0]);
  }, [columnFilterValue]);

  const onSelect = React.useCallback(
    (newValue: string) => {
      if (!column) return;

      if (newValue === columnFilterValue?.[0]) {
        setValue(undefined);
        column.setFilterValue(undefined);
      } else {
        setValue(newValue);
        column.setFilterValue([newValue]);
      }
    },
    [column, columnFilterValue]
  );

  return (
    <div className={className}>
      <div className='mb-1.5 flex items-center justify-between'>
        {title && <span className='text-xs font-bold text-black'>{title}</span>}
      </div>

      <Select onValueChange={onSelect} value={value}>
        <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-[10px] leading-[15px] shadow-none [&_[data-slot=select-value]]:text-black [&_[data-slot=select-value][data-placeholder]]:text-black'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className='[&_[data-slot=select-item]]:text-[10px]'>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
