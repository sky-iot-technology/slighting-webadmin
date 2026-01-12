'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import type { Device } from '@/core/domains/devices';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { cn } from '@/lib/utils';
import { formatDateString } from '@/lib/utils';
import { diffTimeHMS } from '@/features/map/helper';

export const deviceColumns = (t: any): ColumnDef<Device>[] => [
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
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.id' as any)}
      />
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
      <DataTableColumnHeader
        column={column}
        title={t('products.table.name' as any)}
      />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Device['name']>()}</div>,
    meta: {
      label: t('products.table.name' as any),
      placeholder: t('products.placeholder.search_device' as any),
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.type' as any)}
      />
    ),
    meta: {
      label: t('products.table.type' as any),
      variant: 'select',
      options: []
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.status' as any)}
      />
    ),
    cell: ({ row }) => {
      const online = row.original.device_info?.online;
      return (
        <div className={cn(online ? 'text-green-600' : 'text-red-600')}>
          {online
            ? t('products.table.status_val.online' as any)
            : t('products.table.status_val.offline' as any)}
        </div>
      );
    },
    meta: {
      label: t('products.table.status' as any),
      variant: 'select',
      options: [
        {
          label: t('products.table.status_val.online' as any),
          value: '{"device_info": {"online": true}}'
        },
        {
          label: t('products.table.status_val.offline' as any),
          value: '{"device_info": {"online": false}}'
        }
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
      <DataTableColumnHeader
        column={column}
        title={t('products.table.branch' as any)}
      />
    ),
    meta: {
      label: t('products.table.branch' as any),
      variant: 'select'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'asset_status',
    accessorKey: 'device_asset.asset_status',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.condition' as any)}
      />
    ),
    meta: {
      label: t('products.table.condition' as any)
    },
    cell: ({ cell }) => {
      const deviceAsset = cell.row.original.device_asset;
      return <div>{deviceAsset?.asset_status}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.online_time' as any)}
      />
    ),
    meta: {
      label: t('products.table.online_time' as any)
    },
    cell: ({ cell }) => {
      const time = diffTimeHMS(cell.row.original.updated_at);
      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.activation_date' as any)}
      />
    ),
    meta: {
      label: t('products.table.activation_date' as any)
    },
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
      <DataTableColumnHeader
        column={column}
        title={t('products.table.warning' as any)}
      />
    ),
    meta: {
      label: t('products.table.warning' as any)
    },
    cell: ({ cell }) => {
      const warning = cell.row.original.warning;
      return (
        <div>
          {warning
            ? t('products.table.warning_val.yes' as any)
            : t('products.table.warning_val.no' as any)}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'region',
    accessorKey: 'region',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.address' as any)}
      />
    ),
    meta: {
      label: t('products.table.address' as any)
    },
    cell: ({ cell }) => {
      const region = cell.row.original.device_info?.region;
      return <div className='max-w-[100px] truncate'>{region || '-'}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.action' as any)}
      />
    ),
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 60,
    enablePinning: true,
    enableSorting: false,
    enableHiding: false
  }
];
