'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { WorkOrder } from '@/core/domains/maintenances/types';

export const workorderColumns = (
  onOpen: (data: WorkOrder) => void
): ColumnDef<WorkOrder>[] => [
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
    id: 'jobName',
    accessorKey: 'jobName',
    header: 'Tên công việc',
    cell: ({ row }) => {
      return <div>{row.getValue('jobName')}</div>;
    },
    meta: {
      label: 'jobName',
      placeholder: 'Tìm tên lịch',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'alertName',
    accessorKey: 'alertName',
    header: 'Tên cảnh báo',
    cell: ({ row }) => {
      return <div>{row.getValue('alertName')}</div>;
    }
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
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái xử lý',
    cell: ({ row }) => {
      return <div>{row.getValue('status')}</div>;
    }
  },
  {
    id: 'startTime',
    accessorKey: 'startTime',
    header: 'Thời gian bắt đầu',
    cell: ({ row }) => {
      return <div>{row.getValue('startTime')}</div>;
    },
    meta: {
      label: 'Thời gian bắt đầu',
      variant: 'dateRangeSingle'
    },
    enableColumnFilter: true
  },
  {
    id: 'handlingUnit',
    accessorKey: 'handlingUnit',
    header: 'Đơn vị xử lý',
    cell: ({ row }) => {
      return <div>{row.getValue('handlingUnit')}</div>;
    }
  },
  {
    id: 'executor',
    accessorKey: 'executor',
    header: 'Người xử lý',
    cell: ({ row }) => {
      return <div>{row.getValue('executor')}</div>;
    }
  },
  {
    id: 'supervisionStatus',
    accessorKey: 'supervisionStatus',
    header: 'Trạng thái giám sát',
    cell: ({ row }) => {
      return <div>{row.getValue('supervisionStatus')}</div>;
    }
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
          {!isSubRow && <CellAction data={workOrder} onOpen={onOpen} />}
        </div>
      );
    }
  }
];
