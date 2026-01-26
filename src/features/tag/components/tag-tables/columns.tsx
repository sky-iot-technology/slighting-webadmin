'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Device, DeviceInfo } from '@/core/domains/devices';
import { Catalogue } from '@/core/domains/catalogues';
import { RegionNode } from '@/core/domains/groups';
import { findNodeById, formatDateString } from '@/features/calendar/helper';
import { Badge } from '@/ui/components/ui/badge';
import { SelectedTag } from '../tag-sidebar';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export type RequiredTag = Exclude<SelectedTag, null>;

export const tagColumns = (
  catalogues: Catalogue[],
  trees: RegionNode[],
  selectedTag: RequiredTag,
  t: (key: any) => string
): ColumnDef<Device>[] => [
  {
    id: 'dir',
    accessorKey: 'dir',
    header: t('tag.sort'),
    cell: () => {},
    meta: {
      label: t('tag.sort'),
      variant: 'select',
      options: [
        { label: t('tag.newest'), value: 'asc' },
        { label: t('tag.oldest'), value: 'desc' }
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
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('tag.device_name')} />
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
      <DataTableColumnHeader column={column} title={t('tag.device_type')} />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type');
      const name = catalogues.find((s) => s.type === type)?.name || 'undefined';
      return <div>{name}</div>;
    },
    meta: {
      label: t('tag.device_type'),
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
      <DataTableColumnHeader column={column} title={t('tag.status')} />
    ),
    cell: ({ row }) => {
      const info = row.original.device_info as DeviceInfo;
      const label = info.online ? t('tag.online') : t('tag.offline');
      const color = info.online
        ? 'text-map-control-button-success'
        : 'text-map-control-button-destructive';
      return <div className={color}>{label}</div>;
    },
    meta: {
      label: t('tag.status'),
      variant: 'select',
      options: [
        { label: t('tag.online'), value: '{"device_info": {"online": true}}' },
        { label: t('tag.offline'), value: '{"device_info": {"online": false}}' }
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
      <DataTableColumnHeader column={column} title={t('tag.device_status')} />
    ),
    cell: ({ row }) => {
      const info = row.getValue('status') as string;
      const label = info === 'enabled' ? t('tag.enabled') : t('tag.disabled');
      const color = info === 'enabled' ? 'text-calendar-blue' : 'text-yellow-2';
      return <div className={color}>{label}</div>;
    },
    meta: {
      label: t('tag.device_status'),
      variant: 'select',
      options: [
        { label: t('tag.enable'), value: 'enabled' },
        { label: t('tag.disabled'), value: 'disabled' }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'alert',
    accessorKey: 'alert',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('tag.alert')} />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'tag',
    accessorKey: 'tag',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('tag.favorite_group')} />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <Badge className='bg-pink-1/5 dark:bg-black-2 text-pink-1'>
            {selectedTag?.name}ss
          </Badge>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'parent_group_id',
    accessorKey: 'parent_group_id',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('tag.branch_group')} />
    ),
    cell: ({ row }) => {
      const id = row.getValue('parent_group_id');
      const name = findNodeById(trees, String(id))?.name || '—';
      return (
        <div>
          <Badge className='bg-primary/5 dark:bg-black-2 text-primary'>
            {name}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('tag.action')} />
    ),
    size: 57,
    cell: ({ row }) => {
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction data={row.original} selectedTag={selectedTag} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
