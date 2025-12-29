'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Device, DeviceInfo } from '@/core/domains/devices';
import { Catalogue } from '@/core/domains/catalogues';
import { RegionNode } from '@/core/domains/groups';
import { findNodeById, formatDateString } from '@/features/calendar/helper';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export const branchColumns = (
  catalogues: Catalogue[],
  trees: RegionNode[]
): ColumnDef<Device>[] => [
  {
    id: 'dir',
    accessorKey: 'dir',
    header: 'Sắp xếp',
    cell: () => {},
    meta: {
      label: 'Sắp xếp',
      variant: 'select',
      options: [
        { label: 'Mới nhất', value: 'asc' },
        { label: 'Cũ nhất', value: 'desc' }
      ]
    },
    enableColumnFilter: true
  },
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
    id: 'serial_number',
    accessorKey: 'device_info',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Mã thiết bị' />
    ),
    cell: ({ row }) => {
      const id = row.original.id;
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
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Loại thiết bị' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type');
      const name = catalogues.find((s) => s.type === type)?.name || 'undefined';
      return <div>{name}</div>;
    },
    meta: {
      label: 'Loại thiết bị',
      variant: 'select',
      options: catalogues.map((c) => ({
        label: c.name,
        value: c.type
      }))
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'metadata',
    accessorKey: 'device_info',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const info = row.original.device_info as DeviceInfo;
      const label = info.online ? 'Online' : 'Offline';
      const color = info.online
        ? 'text-map-control-button-success'
        : 'text-map-control-button-destructive';
      return <div className={color}>{label}</div>;
    },
    meta: {
      label: 'Trạng thái',
      variant: 'select',
      options: [
        { label: 'Online', value: '{"device_info": {"online": true}}' },
        { label: 'Offline', value: '{"device_info": {"online": false}}' }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái thiết bị' />
    ),
    cell: ({ row }) => {
      const info = row.getValue('status') as string;
      const color =
        info === 'enabled'
          ? 'text-calendar-blue'
          : 'text-map-control-button-destructive';
      const formatted =
        info.charAt(0).toUpperCase() + info.slice(1).toLowerCase();
      return <div className={color}>{formatted}</div>;
    },
    meta: {
      label: 'Trạng thái thiết bị',
      variant: 'select',
      options: [
        { label: 'Kích hoạt', value: 'enabled' },
        { label: 'Chưa kích hoạt', value: 'disabled' }
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
      <DataTableColumnHeader column={column} title='Nhóm chi nhánh' />
    ),
    cell: ({ row }) => {
      const id = row.getValue('parent_group_id');
      const name = findNodeById(trees, String(id))?.name || '—';
      return <div>{name}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'expiration_date',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Hết bảo hành' />
    ),
    cell: ({ row }) => {
      const attributes = row.original.device_asset?.asset_attribute;
      const expAttr = attributes?.find(
        (attr) => attr.identify === 'expiration_date'
      );
      if (!expAttr?.content) return <div>-</div>;

      const dateValue = expAttr.content;
      const formattedDate = formatDateString(
        isNaN(Number(dateValue))
          ? String(dateValue)
          : new Date(Number(dateValue) * 1000).toISOString()
      );

      return <div>{formattedDate}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;

      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && <CellAction id={String(row.original.id)} />}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
