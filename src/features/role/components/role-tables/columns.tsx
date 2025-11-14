'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { UIRoleResponse } from '@/core/domains/permissions';
import { formatDateString } from '@/features/calendar/helper';

export const roleColumns = (): ColumnDef<UIRoleResponse>[] => [
  // {
  //   id: 'dir',
  //   accessorKey: 'dir',
  //   header: 'Sắp xếp',
  //   cell: () => {},
  //   meta: {
  //     label: 'Sắp xếp',
  //     variant: 'select',
  //     options: [
  //       { label: 'Mới nhất', value: 'asc' },
  //       { label: 'Cũ nhất', value: 'desc' }
  //     ]
  //   },
  //   enableColumnFilter: true
  // },
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
    header: 'Tên vai trò',
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      label: 'name',
      placeholder: 'Tìm kiếm vai trò',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      return <div>{formatDateString(row.getValue('created_at'))}</div>;
    }
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Ghi chú',
    cell: ({ row }) => {
      return <div>{row.getValue('description')}</div>;
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      return <div>{row.getValue('status')}</div>;
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
    id: 'actions',
    header: 'Thao tác',
    size: 57,
    cell: ({ row }) => {
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction id={String(row.original.id)} />
        </div>
      );
    }
  }
];
