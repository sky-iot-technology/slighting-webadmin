'use client';

import { Product } from '@/core/shared/constants/data';
import { useDataTable } from '@/core/shared/hooks/use-data-table';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import { DataTable } from '@/ui/components/ui/table/data-table';
import { DataTableToolbar } from '@/ui/components/ui/table/data-table-toolbar';
import { useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ProductTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export function ProductTable<TData, TValue>({
  data,
  totalItems,
  columns
}: ProductTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <DataTable table={table} totalRows={totalItems}>
      <DataTableToolbar table={table} />
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleBulkDelete}
        loading={isDeleting}
      />
    </DataTable>
  );
}
