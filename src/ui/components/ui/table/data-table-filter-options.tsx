'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/ui/components/ui/button';
// (No command palette used in this popover)
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/ui/components/ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { ListFilter } from 'lucide-react';
import { Input } from '@/ui/components/ui/input';
import {
  Select,
  SelectClear,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { Label } from '@/ui/components/ui/label';

interface DataTableFilterOptionsProps<TData> {
  table: Table<TData>;
  initialValues?: Record<string, string>;
  onApply?: (values: Record<string, string>) => void;
  onCancel?: () => void;
}

export function DataTableFilterOptions<TData>({
  table,
  initialValues,
  onApply,
  onCancel
}: DataTableFilterOptionsProps<TData>) {
  const [open, setOpen] = React.useState(false);

  const filterOptions = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => column.getCanFilter())
        .map((x) => ({ id: x.columnDef.id!, ...x.columnDef.meta })),
    [table]
  );

  const [filterValues, setFilterValues] = React.useState<
    Record<string, string>
  >({});

  // Sorting controls
  // (Optional) You can extend with sorting controls later if needed

  React.useEffect(() => {
    // Seed local state from provided initial values or table column filters
    const seed: Record<string, string> = {};
    for (const opt of filterOptions) {
      const col = table.getColumn(opt.id);
      const tableVal = (col?.getFilterValue() as string) ?? '';
      seed[opt.id] = initialValues?.[opt.id] ?? tableVal ?? '';
    }
    setFilterValues(seed);
  }, [filterOptions, initialValues, table]);

  const handleApply = React.useCallback(() => {
    // Push values into table column filters when matching column exists
    Object.entries(filterValues).forEach(([id, val]) => {
      const col = table.getColumn(id);
      if (!col) return;
      if (!val) col.setFilterValue(undefined);
      else {
        if (col.columnDef.meta?.options) {
          col.setFilterValue([val]);
        } else {
          col.setFilterValue(val);
        }
      }
    });
    onApply?.(filterValues);
    setOpen(false);
  }, [filterValues, table, onApply]);

  // Cancel currently just closes + optional callback
  const handleCancel = React.useCallback(() => {
    onCancel?.();
    setOpen(false);
  }, [onCancel]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label='Toggle filters'
          role='combobox'
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <ListFilter />
          Filters
          <CaretSortIcon className='ml-auto opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        <div className='flex flex-col gap-1.5 p-3'>
          {/* Filters from props */}
          {filterOptions
            .filter((opt) => opt.variant !== 'text')
            .map((opt) => {
              const value = filterValues[opt.id] ?? '';
              return (
                <div key={opt.id} className='space-y-1'>
                  <Label>{opt.label}</Label>
                  {opt.variant === 'text' && (
                    <Input
                      placeholder='Tất cả'
                      value={value}
                      onChange={(e) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [opt.id]: e.target.value
                        }))
                      }
                      className='h-9'
                    />
                  )}
                  {opt.variant === 'select' && (
                    <Select
                      value={
                        Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
                      }
                      onValueChange={(v) =>
                        setFilterValues((prev) => ({ ...prev, [opt.id]: v }))
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectClear>Tất cả</SelectClear>
                        {(opt.options ?? []).map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}

          {/* Actions */}
          <div className='flex items-center justify-between pt-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                // reset local and table filters
                const resetValues: Record<string, string> = {};
                for (const opt of filterOptions) {
                  resetValues[opt.id] = '';
                  const col = table.getColumn(opt.id);
                  col?.setFilterValue(undefined);
                }
                setFilterValues(resetValues);
                table.setSorting([]);
                handleCancel();
              }}
            >
              Đặt lại
            </Button>
            <Button size='sm' onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
