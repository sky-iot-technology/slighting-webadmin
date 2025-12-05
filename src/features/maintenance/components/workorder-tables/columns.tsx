'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { WorkOrder } from '@/core/domains/workorders';
import { formatDateTimeString } from '../../helper';

export const workorderColumns = (): ColumnDef<WorkOrder>[] => [
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
    id: 'work_order_name',
    accessorKey: 'work_order_name',
    header: 'Tên công việc',
    cell: ({ row }) => {
      return <div>{row.getValue('work_order_name')}</div>;
    },
    meta: {
      label: 'work_order_name',
      placeholder: 'Tìm tên lịch',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'measurement',
    accessorKey: 'measurement',
    header: 'Tên cảnh báo',
    cell: ({ row }) => {
      return <div>{row.getValue('measurement')}</div>;
    }
  },
  // {
  //   id: 'priority',
  //   accessorKey: 'priority',
  //   header: 'Ưu tiên',
  //   cell: ({ row }) => {
  //     return <div>{row.getValue('priority')}</div>;
  //   }
  // },
  {
    id: 'work_order_status',
    accessorKey: 'work_order_status',
    header: 'Trạng thái xử lý',
    cell: ({ row }) => {
      return <div>{row.getValue('work_order_status')}</div>;
    }
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: 'Thời gian bắt đầu',
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('start_date') as string);
      return <div>{time}</div>;
    },
    meta: {
      label: 'Thời gian bắt đầu',
      variant: 'dateRangeSingle'
    },
    enableColumnFilter: true
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: 'Đơn vị xử lý',
    cell: ({ row }) => {
      const department = row.getValue('department') as string;
      const name = department.split(':')[1];
      return <div>{name}</div>;
    }
  },
  // {
  //   id: 'executor',
  //   accessorKey: 'executor',
  //   header: 'Người xử lý',
  //   cell: ({ row }) => {
  //     return <div>{row.getValue('executor')}</div>;
  //   }
  // },
  {
    id: 'action',
    accessorKey: 'action',
    header: 'Trạng thái giám sát',
    cell: ({ row }) => {
      return <div>{row.getValue('action')}</div>;
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: 'Thời gian kết thúc',
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('end_date') as string);
      return <div>{time}</div>;
    },
    meta: {
      label: 'Thời gian bắt đầu',
      variant: 'dateRangeSingle'
    },
    enableColumnFilter: true
  },
  {
    id: 'actions',
    header: 'Thao tác',
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const workOrder = row.original;
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && <CellAction data={workOrder} id={workOrder.id} />}
        </div>
      );
    }
  }
];
