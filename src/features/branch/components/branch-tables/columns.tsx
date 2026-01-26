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
  trees: RegionNode[],
  t: (key: any) => string
): ColumnDef<Device>[] => [
  {
    id: 'dir',
    accessorKey: 'dir',
    header: t('branch.sort'),
    cell: () => {},
    meta: {
      label: t('branch.sort'),
      variant: 'select',
      options: [
        { label: t('branch.newest'), value: 'asc' },
        { label: t('branch.oldest'), value: 'desc' }
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
      <DataTableColumnHeader column={column} title={t('branch.device_code')} />
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
      <DataTableColumnHeader column={column} title={t('branch.device_name')} />
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
      <DataTableColumnHeader column={column} title={t('branch.device_type')} />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type');
      const name = catalogues.find((s) => s.type === type)?.name || 'undefined';
      return <div>{name}</div>;
    },
    meta: {
      label: t('branch.device_type'),
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
      <DataTableColumnHeader column={column} title={t('branch.status')} />
    ),
    cell: ({ row }) => {
      const info = row.original.device_info as DeviceInfo;
      const label = info.online ? t('branch.online') : t('branch.offline');
      const color = info.online
        ? 'text-map-control-button-success'
        : 'text-map-control-button-destructive';
      return <div className={color}>{label}</div>;
    },
    meta: {
      label: t('branch.status'),
      variant: 'select',
      options: [
        {
          label: t('branch.online'),
          value: '{"device_info": {"online": true}}'
        },
        {
          label: t('branch.offline'),
          value: '{"device_info": {"online": false}}'
        }
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
      <DataTableColumnHeader
        column={column}
        title={t('branch.device_status')}
      />
    ),
    cell: ({ row }) => {
      const info = row.getValue('status') as string;
      const color =
        info === 'enabled'
          ? 'text-calendar-blue'
          : 'text-map-control-button-destructive';
      const formatted =
        info === 'enabled' ? t('branch.enabled') : t('branch.disabled');
      return <div className={color}>{formatted}</div>;
    },
    meta: {
      label: t('branch.device_status'),
      variant: 'select',
      options: [
        { label: t('branch.enable'), value: 'enabled' },
        { label: t('branch.disable'), value: 'disabled' }
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
      <DataTableColumnHeader column={column} title={t('branch.branch_group')} />
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
      <DataTableColumnHeader
        column={column}
        title={t('branch.warranty_expired')}
      />
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
      <DataTableColumnHeader column={column} title={t('branch.action')} />
    ),
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const id = row.getValue('parent_group_id');
      const name = findNodeById(trees, String(id))?.name || '—';
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && (
            <CellAction
              name={row.getValue('name')}
              branch={name}
              id={String(row.original.id)}
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
