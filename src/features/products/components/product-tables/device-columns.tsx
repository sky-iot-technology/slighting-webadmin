'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import type { Device } from '@/core/domains/devices';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const deviceColumns: ColumnDef<Device>[] = [
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
    maxSize: 40
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Device['name']>()}</div>
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    meta: {
      label: 'Type',
      variant: 'select',
      options: []
    },
    enableColumnFilter: true
  },
  {
    id: 'imei',
    header: 'IMEI',
    cell: ({ row }) => row.original.device_info?.imei ?? '',
    meta: {
      label: 'imei',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'online',
    header: 'Online',
    cell: ({ row }) =>
      row.original.device_info?.online ? 'Online' : 'Offline',
    meta: {
      label: 'status',
      variant: 'select',
      options: [
        { label: 'Online', value: 'true' },
        { label: 'Offline', value: 'false' }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    )
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    meta: {
      label: 'status',
      variant: 'select',
      options: [
        { label: 'enabled', value: 'enabled' },
        { label: 'disabled', value: 'disabled' },
        { label: 'deleted', value: 'deleted' },
        { label: 'all', value: 'all' },
        { label: 'unknown', value: 'unknown' }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 60,
    enablePinning: true
  }
];
