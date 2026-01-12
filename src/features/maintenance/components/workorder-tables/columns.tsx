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

export const workorderColumns = (
  users: User[],
  t: (key: string) => string,
  options?: {
    onViewAction?: (id: string) => void;
    onEditAction?: (id: string) => void;
  }
): ColumnDef<WorkOrder>[] => [
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
    id: 'work_order_name',
    accessorKey: 'work_order_name',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.work_order_name')}
      />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('work_order_name')}</div>;
    },
    meta: {
      label: 'work_order_name',
      placeholder: t('maintenance.placeholder_work_order_name'),
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.warning_name')}
      />
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.priority')}
      />
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
          {t(WorkOderSeverityLabel[severity] as any)}
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.process_status')}
      />
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
          {t(WorkOrderStatusLabel[status] as any)}
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.start_time')}
      />
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.unit_handling')}
      />
    ),
    cell: ({ row }) => {
      const department = row.getValue('department') as string;
      const name = department.split(':')[1];
      return <div>{t(`maintenance.team_${name}` as any)}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'assignee_id',
    accessorKey: 'assignee_id',
    header: ({ column }: { column: Column<WorkOrder, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('maintenance.handler')} />
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.supervisor_status')}
      />
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
          {t(WorkOrderActionLabel[actions] as any)}
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
      <DataTableColumnHeader
        column={column}
        title={t('maintenance.end_time')}
      />
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
      <DataTableColumnHeader column={column} title={t('maintenance.action')} />
    ),
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const id = row.original.id;
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && (
            <CellAction
              id={id}
              onViewAction={
                options?.onViewAction
                  ? () => options.onViewAction!(row.original.id)
                  : undefined
              }
              onEditAction={
                options?.onEditAction
                  ? () => options.onEditAction!(row.original.id)
                  : undefined
              }
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
