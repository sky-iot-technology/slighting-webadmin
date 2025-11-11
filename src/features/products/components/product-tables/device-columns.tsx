'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import type { Device } from '@/core/domains/devices';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { cn } from '@/lib/utils';
import { formatDateString } from '@/lib/utils';

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
    maxSize: 50
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ cell }) => {
      const id = cell.getValue<Device['id']>();
      const formattedId = id ? `...${String(id).slice(-4)}` : '';
      return <div>{formattedId}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên thiết bị' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Device['name']>()}</div>,
    meta: {
      label: 'name',
      placeholder: 'Tìm kiếm thiết bị',
      variant: 'text'
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Loại thiết bị' />
    ),
    meta: {
      label: 'Loại thiết bị',
      variant: 'select',
      options: []
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'online',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const online = row.original.device_info?.online;
      return (
        <div className={cn(online ? 'text-green-600' : 'text-red-600')}>
          {online ? 'Online' : 'Offline'}
        </div>
      );
    },
    meta: {
      label: 'Trạng thái',
      variant: 'select',
      options: [
        { label: 'Online', value: 'true' },
        { label: 'Offline', value: 'false' }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'parent_group_id',
    accessorKey: 'parent_group_id',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Chi nhánh' />
    ),
    meta: {
      label: 'Chi nhánh',
      variant: 'regionTree'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'asset_status',
    accessorKey: 'device_asset.asset_status',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tình trạng' />
    ),
    cell: ({ cell }) => {
      const deviceAsset = cell.row.original.device_asset;
      return <div>{deviceAsset?.asset_status}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ngày kích hoạt' />
    ),
    cell: ({ cell }) => {
      const deviceAsset = cell.row.original.device_asset;
      return <div>{formatDateString(deviceAsset?.created_at)}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'warning',
    accessorKey: 'warning',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cảnh báo' />
    ),
    cell: ({ cell }) => {
      const warning = cell.row.original.warning;
      return <div>{warning ? 'Có' : 'Không'}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'region',
    accessorKey: 'region',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Địa chỉ' />
    ),
    cell: ({ cell }) => {
      const region = cell.row.original.device_info?.region;
      return <div>{region || '-'}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 60,
    enablePinning: true,
    enableSorting: false,
    enableHiding: false
  }
];
