'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  WorkOderSeverityLabel,
  WorkOrder,
  WorkOrderAction,
  WorkOrderActionLabel,
  WorkOrderSeverity,
  WorkOrderStatus,
  WorkOrderStatusLabel
} from '@/core/domains/workorders';
import { formatDateTimeString } from '../../helper';
import { User } from '@/core/domains/users';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export const workorderColumns = (users: User[]): ColumnDef<WorkOrder>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
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
    id: 'work_order_name',
    accessorKey: 'work_order_name',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên công việc' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('work_order_name')}</div>;
    },
    meta: {
      label: 'work_order_name',
      placeholder: 'Tìm tên lịch',
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'measurement',
    accessorKey: 'measurement',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên cảnh báo' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('measurement')}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'severity',
    accessorKey: 'severity',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ưu tiên' />
    ),
    cell: ({ row }) => {
      const severity = row.getValue('severity') as WorkOrderSeverity;
      const color =
        severity === 2
          ? 'text-yellow-2'
          : severity === 1
            ? 'text-calendar-blue'
            : 'text-calendar-gray';
      return (
        <div className={`font-bold ${color}`}>
          {WorkOderSeverityLabel[severity]}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'work_order_status',
    accessorKey: 'work_order_status',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái xử lý' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('work_order_status') as WorkOrderStatus;
      const color =
        status === 'open'
          ? 'text-calendar-red'
          : status === 'process'
            ? 'text-yellow-2'
            : status === 'completed'
              ? 'text-calendar-green'
              : 'text-calendar-gray';
      return (
        <div className={`font-bold ${color}`}>
          {WorkOrderStatusLabel[status]}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thời gian bắt đầu' />
    ),
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('start_date') as string);
      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Đơn vị xử lý' />
    ),
    cell: ({ row }) => {
      const department = row.getValue('department') as string;
      const name = department.split(':')[1];
      return <div>{name}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'assignee_id',
    accessorKey: 'assignee_id',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Người xử lý' />
    ),
    cell: ({ row }) => {
      const assigneeId = row.getValue('assignee_id') as string;
      if (!assigneeId) {
        return <div>-</div>;
      }
      const user = users.find((u) => u.id === assigneeId);
      return (
        <div>
          {user?.last_name} {user?.first_name}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'action',
    accessorKey: 'action',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái giám sát' />
    ),
    cell: ({ row }) => {
      const actions = row.getValue('action') as WorkOrderAction;
      const color =
        actions === 'open'
          ? 'text-calendar-red'
          : actions === 'forward'
            ? 'text-yellow-2'
            : actions === 'comfirmed'
              ? 'text-calendar-green'
              : 'text-calendar-gray';
      return (
        <div className={`font-bold ${color}`}>
          {WorkOrderActionLabel[actions]}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thời gian kết thúc' />
    ),
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('end_date') as string);
      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const id = row.original.id;
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && <CellAction id={id} />}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
