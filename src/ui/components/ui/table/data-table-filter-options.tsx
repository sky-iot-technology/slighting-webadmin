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
import { useRegionTreeStore } from '@/core/domains/tree/store';
import {
  findNodeName,
  findNodeSlug,
  flattenTree
} from '@/features/calendar/helper';
import Image from 'next/image';
import { TreeProvider } from '@/ui/business/tree/TreeProvider';

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
  const { treeData } = useRegionTreeStore();

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

  const resetColumn = React.useCallback(
    (id: string) => {
      const col = table.getColumn(id);
      col?.setFilterValue(undefined);
      setFilterValues((prev) => ({ ...prev, [id]: '' }));
    },
    [table]
  );

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
    const cleaned: Record<string, any> = {};
    const currentFilters = table.getState().columnFilters;
    const managedFilterIds = new Set(filterOptions.map((opt) => opt.id));

    // Keep filters that are NOT managed by this component (e.g., text, dateRange)
    const newFilters = currentFilters.filter(
      (filter) => !managedFilterIds.has(filter.id)
    );

    // Add or update filters managed by this component
    Object.entries(filterValues).forEach(([id, val]) => {
      const col = table.getColumn(id);
      if (!col) return;

      const isEmpty =
        val === '' || val == null || (Array.isArray(val) && val.length === 0);

      if (!isEmpty) {
        const hasOptions = !!col.columnDef.meta?.options;
        const filterValue = hasOptions ? [val] : val;
        newFilters.push({ id, value: filterValue });
        cleaned[id] = val;
      }
      // If isEmpty, we don't add it to newFilters, which removes it
      // This will trigger onColumnFiltersChange to clear the URL parameter
    });

    // Set the new filters array - this will trigger onColumnFiltersChange
    // which will properly clear URL parameters for removed filters
    table.setColumnFilters(newFilters);

    setFilterValues(cleaned);
    onApply?.(cleaned);
    setOpen(false);
  }, [filterValues, table, onApply, filterOptions]);

  // Cancel currently just closes + optional callback

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    setOpen(false);
  }, [onCancel]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='rounded-[4px]'>
        <Button
          aria-label='Toggle filters'
          role='combobox'
          variant='outline'
          size='sm'
          className='!bg-gray-2 ml-auto hidden h-7.5 w-7.5 border-none p-0 lg:flex'
        >
          {/* <ListFilter /> */}
          <Image
            src={'/assets/icons/filter.svg'}
            alt='filter'
            width={16}
            height={16}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        <div className='flex flex-col gap-1.5 p-3'>
          {/* Filters from props */}
          {filterOptions
            .filter(
              (opt) =>
                opt.variant && !['text', 'dateRange'].includes(opt.variant)
            )
            .map((opt) => {
              const value = filterValues[opt.id] ?? '';
              return (
                <div key={opt.id} className='space-y-1'>
                  <Label className='text-xs'>{opt.label}</Label>
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
                      className='h-9 text-xs'
                    />
                  )}
                  {opt.variant === 'select' && (
                    <Select
                      value={
                        Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
                      }
                      onValueChange={(v) => {
                        const safeValue = v === null ? '' : v;
                        setFilterValues((prev) => ({
                          ...prev,
                          [opt.id]: safeValue
                        }));
                      }}
                    >
                      <SelectTrigger className='w-full text-xs'>
                        <SelectValue placeholder='Tất cả' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectClear>Tất cả</SelectClear>
                        {(opt.options ?? []).map((o) => (
                          <SelectItem
                            key={o.value}
                            value={o.value}
                            className='text-xs'
                          >
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {opt.variant === 'regionTree' && (
                    <TreeProvider
                      className='!h-9 !w-full'
                      buttonClassName='!bg-white'
                      treeClassName='!w-full'
                      filter={true}
                      selectedRegion={(() => {
                        const slug = Array.isArray(value)
                          ? value.join('-')
                          : value;
                        if (!slug) return undefined;
                        const node = flattenTree(treeData).find(
                          (n) => n.slug === slug
                        );
                        if (!node) return undefined;
                        return { id: node.id, name: node.name };
                      })()}
                      onRegionChange={(selectedRegion) => {
                        setFilterValues((prev) => ({
                          ...prev,
                          [opt.id]:
                            findNodeSlug(treeData, selectedRegion?.id ?? '') ??
                            ''
                        }));
                      }}
                    />
                  )}
                </div>
              );
            })}

          {/* Actions */}
          <div className='flex items-center justify-between pt-1'>
            <Button
              className='text-xs'
              variant='ghost'
              size='sm'
              onClick={() => {
                // reset local and table filters
                const resetValues: Record<string, string> = {};
                for (const opt of filterOptions) {
                  resetValues[opt.id] = '';
                }
                setFilterValues(resetValues);

                // Remove only filters managed by this component
                const currentFilters = table.getState().columnFilters;
                const managedFilterIds = new Set(
                  filterOptions.map((opt) => opt.id)
                );
                const newFilters = currentFilters.filter(
                  (filter) => !managedFilterIds.has(filter.id)
                );
                table.setColumnFilters(newFilters);

                table.setSorting([]);
                handleCancel();
              }}
            >
              Đặt lại
            </Button>
            <Button className='text-xs' size='sm' onClick={handleApply}>
              Áp dụng
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
