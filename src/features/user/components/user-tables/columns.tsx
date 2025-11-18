'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { formatDateString } from '@/features/calendar/helper';
import { User } from '@/core/domains/users/types';
import { Badge } from '@/ui/components/ui/badge';

export const userColumns = (): ColumnDef<User>[] => [
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
    header: 'Tên',
    cell: ({ row }) => {
      const user = row.original as User;
      return <div>{`${user.first_name} ${user.last_name}`}</div>;
    },
    meta: {
      label: 'name',
      placeholder: 'Tìm kiếm',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'unit',
    accessorKey: 'unit',
    header: 'Đơn vị',
    cell: ({ row }) => {
      return <div>-</div>;
    }
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: 'Bộ phận',
    cell: ({ row }) => {
      return <div>-</div>;
    }
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Vai trò',
    cell: ({ row }) => {
      return <div>{row.getValue('role')}</div>;
    }
    // meta: {
    //   label: 'Trạng thái thiết bị',
    //   variant: 'select',
    //   options: [
    //     { label: 'Kích hoạt', value: 'enabled' },
    //     { label: 'Chưa kích hoạt', value: 'disabled' }
    //   ]
    // },
    // enableColumnFilter: true
  },
  {
    id: 'group',
    accessorKey: 'group',
    header: 'Chi nhánh',
    cell: ({ row }) => {
      return <div>-</div>;
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status');
      const label =
        status === 'enabled'
          ? 'Kích hoạt'
          : status === 'disabled'
            ? 'Chưa kích hoạt'
            : 'Đã bị khóa';
      const color =
        status === 'enabled'
          ? 'bg-ring/10 text-ring'
          : status === 'disabled'
            ? 'bg-map-control-button-danger/10 text-map-control-button-danger'
            : 'bg-calendar-red/10 text-calendar-red';

      // return <div className={color}>{label}</div>;
      return <Badge className={color}>{label}</Badge>;
    }
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
