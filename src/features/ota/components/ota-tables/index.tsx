'use client';

import { DataTable } from '@/ui/components/ui/table/data-table';

import { useDataTable } from '@/core/shared/hooks/use-data-table';

import { ColumnDef, getExpandedRowModel, Table } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import React, { useState } from 'react';
import { DataTableCustomToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import OtaDialog from '../modal/ota-dialog';
import { PermissionGuard, useCan } from '@/core/domains/permissions';

import { useTranslation } from '@/core/domains/language/useTranslation';

interface OtaTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  error?: Error | null;
  isFilterReady?: boolean;
}
export function OtaTable<TData, TValue>({
  data,
  totalItems,
  columns,
  isLoading = false,
  error = null,
  isFilterReady
}: OtaTableParams<TData, TValue>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 200,
    defaultVisibility: {
      dir: false
    }
  });

  const canDelete = useCan('ota', 'delete');

  return (
    <>
      {isFilterReady && (
        <DataTable
          table={table}
          totalRows={totalItems}
          className='mt-1'
          wrapperClassName='rounded-[8px]'
          tableContainerClassName='border-none rounded-none'
          paginationClassName='py-3'
          headerClassName='border-t-1 border-none shadow-none'
          rowClassName='text-xs font-normal'
          isLoading={isLoading}
          error={error}
          loadingRowCount={pageSize}
        >
          <div className='flex items-center gap-2 py-2'>
            <DataTableCustomToolbar
              table={table}
              className='flex-1'
              actions={
                <>
                  <PermissionGuard module='ota' action='create'>
                    <Button
                      variant='default'
                      size='sm'
                      className='bg-primary hover:bg-primary/90 flex items-center rounded-[4px] text-white'
                      onClick={() => setOpen(true)}
                    >
                      <IconPlus className='h-3 w-3' />
                      {t('ota.button.add' as any)}
                    </Button>
                  </PermissionGuard>
                </>
              }
              onDeleteAll={
                canDelete ? () => console.log('delete product') : undefined
              }
              filter
            />
          </div>
          <OtaDialog
            pageTitle={t('ota.title.add' as any)}
            open={open}
            onOpenChange={setOpen}
          />
        </DataTable>
      )}
    </>
  );
}
