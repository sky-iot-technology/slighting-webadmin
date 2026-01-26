'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';
import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import CalendarDeviceDialog from '../modal/calendar-device-dialog';
import { DataTableCustomToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { useDeleteMultiCalendars } from '@/core/domains/calendars';
import { PermissionGuard, useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  clientId: string;
  isLoading?: boolean;
  error?: Error | null;
}
export function CalendarTable<TData, TValue>({
  data,
  totalItems,
  columns,
  clientId,
  isLoading = false,
  error = null
}: ProductTableParams<TData, TValue>) {
  const { t } = useTranslation();
  const canDelete = useCan('device', 'delete');
  const [open, setOpen] = useState(false);

  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { mutate: deleteCalendars, isPending } = useDeleteMultiCalendars();

  const handleDelete = async (selectedRows: any[]) => {
    if (!selectedRows.length) return;
    const ids = selectedRows.map((r) => r.id as string);
    deleteCalendars(ids);
  };

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => {
      if (!Array.isArray(row.schedules)) return [];
      return [...row.schedules].sort((a: any, b: any) => {
        const timeA = a.time || '';
        const timeB = b.time || '';
        return timeA.localeCompare(timeB);
      });
    },
    getRowCanExpand: (row: any) =>
      Array.isArray(row.original.schedules) &&
      row.original.schedules.length > 0,
    defaultVisibility: {
      status: false,
      group: false
    }
  });

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className='!bg-card'
      wrapperClassName='mx-1 mt-1 rounded-none'
      tableContainerClassName='!border-y-1 !border-x-0 rounded-none'
      paginationClassName='py-3'
      headerClassName='bg-white border-t-1'
      rowClassName='text-xs font-normal'
      getRowClassName={(row) =>
        row.is_deleted ? 'opacity-50 dark:bg-gray-6' : ''
      }
      isLoading={isLoading}
      error={error}
    >
      <div className='bg-card flex items-center gap-2'>
        <DataTableCustomToolbar
          table={table}
          className='w-auto flex-1'
          actions={
            <PermissionGuard module='device' action='update'>
              <Button
                variant='default'
                size='sm'
                className='bg-primary hover:bg-primary/90 flex !h-7.5 items-center rounded-[4px] text-white'
                onClick={() => setOpen(true)}
              >
                <IconPlus className='h-3 w-3' />
                {t('calendar.add' as any)}
              </Button>
            </PermissionGuard>
          }
          filter={true}
          excel={false}
          onDeleteAll={canDelete ? handleDelete : undefined}
        />
        {/* <DataTableToolbar table={table} /> */}
      </div>
      <CalendarDeviceDialog
        pageTitle={t('calendar.add_calendar' as any)}
        open={open}
        onOpenChange={setOpen}
        initialData={{ client_id: clientId }}
      />
    </DataTable>
  );
}
