'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Department, Unit } from '@/core/domains/organizations/type';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export const departmentColumns = (units: Unit[]): ColumnDef<Department>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
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
    header: ({ column }: { column: Column<Department, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên bộ phận' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      label: 'name',
      placeholder: 'Tìm kiếm',
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'unitId',
    accessorKey: 'unitId',
    header: ({ column }: { column: Column<Department, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thuộc đơn vị' />
    ),
    cell: ({ row }) => {
      const unitId = row.getValue('unitId') as string;
      const unitName = units.find((u) => u.id === unitId)?.name ?? '-';
      return <div>{unitName}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'note',
    accessorKey: 'note',
    header: ({ column }: { column: Column<Department, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('note')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Department, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    size: 57,
    cell: ({ row }) => {
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction id={String(row.original.id)} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
