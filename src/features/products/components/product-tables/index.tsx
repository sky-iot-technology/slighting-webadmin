'use client';

import { useDataTable } from '@/core/shared/hooks/use-data-table';
import { DataTable } from '@/ui/components/ui/table/data-table';
import { DataTableCustomToolbar } from '@/ui/components/ui/table/data-table-toolbar';

import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { parseAsInteger, useQueryState } from 'nuqs';
import { PermissionGuard } from '@/core/domains/permissions';

interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  action?: React.ReactNode;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isFilterReady?: boolean;
}

export function ProductTable<TData, TValue>({
  data,
  totalItems,
  columns,
  action,
  actionBar,
  isLoading = false,
  error = null,
  isFilterReady
}: ProductTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const router = useRouter();
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // product data
    columns, // product columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 200,
    enableColumnPinning: true
  });

  return (
    <>
      {isFilterReady && (
        <DataTable
          table={table}
          totalRows={totalItems}
          // wrapperClassName='mx-1 mt-1 rounded-none'
          tableContainerClassName='border-none rounded-none'
          paginationClassName='py-3'
          headerClassName='border-t-1 border-none shadow-none'
          actionBar={actionBar}
          isLoading={isLoading}
          error={error}
          loadingRowCount={pageSize}
        >
          {/* <DataTableToolbar table={table} /> */}
          <div className='flex items-center gap-2 py-3'>
            <DataTableCustomToolbar
              table={table}
              className='flex-1'
              actions={
                <>
                  {action}
                  <PermissionGuard module='device' action='create'>
                    <Button
                      variant='default'
                      size='sm'
                      className='bg-primary hover:bg-primary/90 flex items-center rounded-[6px] text-white'
                      onClick={() => {
                        router.push('/dashboard/product/new');
                      }}
                    >
                      <IconPlus className='h-3 w-3' />
                      Thêm
                    </Button>
                  </PermissionGuard>
                </>
              }
              onDeleteAll={() => console.log('delete product')}
              filter
            />
          </div>
        </DataTable>
      )}
    </>
  );
}
