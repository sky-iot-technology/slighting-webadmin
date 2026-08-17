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
import { useTranslation } from '@/core/domains/language/useTranslation';

interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  action?: React.ReactNode | ((table: any) => React.ReactNode);
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
  const { t } = useTranslation();
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
      <DataTable
        table={table}
        totalRows={totalItems}
        wrapperClassName='mt-1'
        tableContainerClassName='border-none rounded-none'
        paginationClassName='py-3'
        headerClassName='border-t-1 border-none shadow-none'
        actionBar={actionBar}
        isLoading={isLoading}
        error={error}
        loadingRowCount={pageSize}
      >
        {/* <DataTableToolbar table={table} /> */}
        <div className='flex items-center gap-2'>
          <DataTableCustomToolbar
            table={table}
            className='flex-1 py-2'
            actions={
              <>
                {typeof action === 'function' ? action(table) : action}
                <PermissionGuard module='device' action='create'>
                  <Button
                    variant='default'
                    size='sm'
                    className='bg-primary hover:bg-primary/90 flex h-7.5 items-center rounded-[6px] text-white'
                    onClick={() => {
                      router.push('/dashboard/product/new');
                    }}
                  >
                    <IconPlus className='h-3 w-3' />
                    {t('products.button.add' as any)}
                  </Button>
                </PermissionGuard>
              </>
            }
            onDeleteAll={() => console.log('delete product')}
            filter
          />
        </div>
      </DataTable>
    </>
  );
}
