'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';
import {
  DataTableCustomToolbar,
  DataTableToolbar
} from '@/ui/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from '@/core/domains/language/useTranslation';
import RoleDialog from '../modal/role-dialog';
import { PermissionGuard } from '@/core/domains/permissions';
interface RoleTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  error?: Error | null;
}
export function RoleTable<TData, TValue>({
  data,
  totalItems,
  columns,
  isLoading = false,
  error = null
}: RoleTableParams<TData, TValue>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.schedules,
    getRowCanExpand: (row: any) =>
      Array.isArray(row.original.schedules) &&
      row.original.schedules.length > 0,
    defaultVisibility: {
      status: false
    }
  });

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      className='mt-1'
      wrapperClassName='mx-1 mt-1 rounded-[4px]'
      tableContainerClassName='border-none rounded-none'
      paginationClassName='py-3'
      headerClassName='border-t-1 border-none shadow-none'
      rowClassName='text-xs font-normal'
      getRowClassName={(row) => (row.is_deleted ? 'opacity-50' : '')}
      isLoading={isLoading}
      error={error}
      loadingRowCount={pageSize}
    >
      <DataTableCustomToolbar
        table={table}
        className='w-auto py-2'
        actions={
          <PermissionGuard module='role' action='create' fallback={null}>
            <Button
              variant='default'
              size='sm'
              className='bg-primary hover:bg-primary/90 flex h-7.5 items-center rounded-[4px] text-white'
              onClick={() => setOpen(true)}
            >
              <IconPlus className='h-3 w-3' />
              {t('role.button.add' as any)}
            </Button>
            <RoleDialog
              pageTitle={t('role.modal.add.title' as any)}
              open={open}
              onOpenChange={setOpen}
              // initialData={{ group_ids: region?.id ? [region.id] : [] }}
            />
          </PermissionGuard>
        }
        filter={false}
        excel={false}
        // onDeleteAll={handleDelete}
      />
    </DataTable>
  );
}
