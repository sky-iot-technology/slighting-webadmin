'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { UIRoleResponse } from '@/core/domains/permissions';
import { formatDateString } from '@/features/calendar/helper';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export const roleColumns = (): ColumnDef<UIRoleResponse>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    maxSize: 50
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<UIRoleResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên vai trò' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      label: 'name',
      placeholder: 'Tìm kiếm vai trò',
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<UIRoleResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      return <div>{formatDateString(row.getValue('created_at'))}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }: { column: Column<UIRoleResponse, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('description')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<UIRoleResponse, unknown> }) => (
      <DataTableColumnHeader
        className='flex w-full items-center justify-center'
        column={column}
        title='Ghi chú'
      />
    ),
    size: 57,
    cell: ({ row }) => {
      return <CellAction id={String(row.original.id)} />;
    }
  }
];
