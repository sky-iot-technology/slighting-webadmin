'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Device, DeviceInfo } from '@/core/domains/devices';
import { Catalogue } from '@/core/domains/catalogues';
import { RegionNode } from '@/core/domains/groups';
import { findNodeById, formatDateString } from '@/features/calendar/helper';
import { Badge } from '@/ui/components/ui/badge';
import { SelectedTag } from '../tag-sidebar';

export type RequiredTag = Exclude<SelectedTag, null>;

export const tagColumns = (
  catalogues: Catalogue[],
  trees: RegionNode[],
  selectedTag: RequiredTag
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
    accessorKey: 'check_box',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-[2px] border-[1px] border-black'
        />
      );
    },
    size: 50,
    cell: ({ row }) => {
      return (
        <div className='flex w-full items-center gap-2'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-[2px] border-[1px] border-black'
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Tên thiết bị',
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    }
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Loại thiết bị',
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
    enableColumnFilter: true
  },
  {
    id: 'metadata',
    accessorKey: 'device_info',
    header: 'Trạng thái',
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
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái thiết bị',
    cell: ({ row }) => {
      const info = row.getValue('status') as string;
      const label = info === 'enabled' ? 'Đã kích hoạt' : 'Chưa kích hoạt';
      const color = info === 'enabled' ? 'text-calendar-blue' : 'text-yellow-2';
      return <div className={color}>{label}</div>;
    },
    meta: {
      label: 'Trạng thái thiết bị',
      variant: 'select',
      options: [
        { label: 'Kích hoạt', value: 'enabled' },
        { label: 'Chưa kích hoạt', value: 'disabled' }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'alert',
    accessorKey: 'alert',
    header: 'Cảnh báo',
    cell: ({ row }) => {
      return <div>-</div>;
    }
  },
  {
    id: 'tag',
    accessorKey: 'tag',
    header: 'Nhóm yêu thích',
    cell: ({ row }) => {
      return (
        <div>
          <Badge className='bg-pink-1/5 text-pink-1'>{selectedTag?.name}</Badge>
        </div>
      );
    }
  },
  {
    id: 'parent_group_id',
    accessorKey: 'parent_group_id',
    header: 'Nhóm chi nhánh',
    cell: ({ row }) => {
      const id = row.getValue('parent_group_id');
      const name = findNodeById(trees, String(id))?.name || '—';
      return (
        <div>
          <Badge className='bg-primary/5 text-primary'>{name}</Badge>
        </div>
      );
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    size: 57,
    cell: ({ row }) => {
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction data={row.original} selectedTag={selectedTag} />
        </div>
      );
    }
  }
];
