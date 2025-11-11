'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Maintenance } from '@/core/domains/maintenances/types';

export const maintenanceColumns = (): ColumnDef<Maintenance>[] => [
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
    id: 'serial_number',
    accessorKey: 'serial_number',
    header: 'Mã thiết bị',
    cell: ({ row }) => {
      return <div>{row.getValue('serial_number')}</div>;
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Tên cảnh báo',
    cell: ({ row }) => {
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      label: 'name',
      placeholder: 'Tìm tên lịch',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: 'Ưu tiên',
    cell: ({ row }) => {
      return <div>{row.getValue('priority')}</div>;
    }
  },
  {
    id: 'time',
    accessorKey: 'time',
    header: 'Thời gian gửi cảnh báo',
    cell: ({ row }) => {
      return <div>{row.getValue('time')}</div>;
    },
    meta: {
      label: 'Thời gian bắt đầu',
      variant: 'dateRangeSingle'
    },
    enableColumnFilter: true
  },
  {
    id: 'timeSpend',
    accessorKey: 'timeSpend',
    header: 'Thời gian kéo dài',
    cell: ({ row }) => {
      return <div>{row.getValue('timeSpend')}</div>;
    }
  },
  {
    id: 'sendBy',
    accessorKey: 'sendBy',
    header: 'Người gửi',
    cell: ({ row }) => {
      return <div>{row.getValue('sendBy')}</div>;
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái xử lý',
    cell: ({ row }) => {
      return <div>{row.getValue('status')}</div>;
    }
  },
  {
    id: 'method',
    accessorKey: 'method',
    header: 'Phương thức xử lý',
    cell: ({ row }) => {
      return <div>{row.getValue('method')}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;

      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && (
            <CellAction
              id={String(row.original.id)}
              lat={row.original.lat}
              lng={row.original.lng}
            />
          )}
        </div>
      );
    }
  }
];
