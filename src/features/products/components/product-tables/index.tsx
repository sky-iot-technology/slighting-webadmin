'use client';

import { Product } from '@/core/shared/constants/data';
import { useDataTable } from '@/core/shared/hooks/use-data-table';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import { DataTable } from '@/ui/components/ui/table/data-table';
import { DataTableToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { useState } from 'react';

import { Button } from '@/ui/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  actionBar?: React.ReactNode;
}

export function ProductTable<TData, TValue>({
  data,
  totalItems,
  columns,
  actionBar
}: ProductTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  const handleBulkDelete = async () => {
    if (!hasSelectedRows) return;

    setIsDeleting(true);
    try {
      const selectedProducts = selectedRows.map(
        (row) => row.original as Product
      );
      const productIds = selectedProducts.map((product) => product.id);

      // TODO: Implement bulk delete API call

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear selection after delete
      table.toggleAllPageRowsSelected(false);
      setShowDeleteModal(false);
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  return (
    <DataTable
      table={table}
      totalRows={totalItems}
      // wrapperClassName='mx-1 mt-1 rounded-none'
      tableContainerClassName='border-none rounded-none'
      // paginationClassName='py-3'
      headerClassName='border-t-1 border-none shadow-none'
      actionBar={actionBar}
    >
      {/* <DataTableToolbar table={table} /> */}
      <div className='flex items-center gap-2 py-6'>
        <DataTableToolbar
          table={table}
          className='w-auto flex-1'
          actions={
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
          }
          onDeleteAll={() => console.log('delete product')}
        />
      </div>
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleBulkDelete}
        loading={isDeleting}
      />
    </DataTable>
  );
}
