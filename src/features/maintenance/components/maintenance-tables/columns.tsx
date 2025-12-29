'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import {
  Alarm,
  AlarmSeverity,
  AlarmSeverityLabel,
  AlarmStatus,
  AlarmStatusLabel
} from '@/core/domains/alarms';
import { diffTimeBetween, formatDateTimeString } from '../../helper';
import { User } from '@/core/domains/users';
import { Device } from '@/core/domains/devices';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';

export const maintenanceColumns = (
  users: User[],
  devices: Device[]
): ColumnDef<Alarm>[] => [
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
    id: 'metadata',
    accessorKey: 'metadata',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Mã thiết bị' />
    ),
    cell: ({ row }) => {
      const metadata = row.getValue('metadata') as Alarm['metadata'];
      return <div>{metadata.imei ?? '-'}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'measurement',
    accessorKey: 'measurement',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên cảnh báo' />
    ),
    cell: ({ row }) => {
      const measurement = row.getValue('measurement') as string;
      const cause = row.original.cause;
      return (
        <div>
          {measurement} {cause}
        </div>
      );
    },
    meta: {
      label: 'measurement',
      placeholder: 'Tìm tên cảnh báo',
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'severity',
    accessorKey: 'severity',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ưu tiên' />
    ),
    cell: ({ row }) => {
      const severity = row.getValue('severity') as AlarmSeverity;
      const color =
        severity === 2
          ? 'text-yellow-2'
          : severity === 1
            ? 'text-calendar-blue'
            : 'text-calendar-gray';
      return (
        <div className={`font-bold ${color}`}>
          {AlarmSeverityLabel[severity]}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thời gian gửi cảnh báo' />
    ),
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('created_at') as string);
      return <div>{time}</div>;
    },
    meta: {
      label: 'Thời gian bắt đầu',
      variant: 'dateRangeSingle'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'timeSpend',
    accessorKey: 'timeSpend',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thời gian kéo dài' />
    ),
    cell: ({ row }) => {
      const resolvedTime = row.original.resolved_at;
      const alarmTime = row.original.created_at;
      if (!resolvedTime || resolvedTime === '0001-01-01T00:00:00Z') {
        return <div>-</div>;
      }
      const time = diffTimeBetween(alarmTime, resolvedTime);

      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'sendBy',
    accessorKey: 'sendBy',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Người gửi' />
    ),
    cell: ({ row }) => {
      return <div>Hệ thống</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Trạng thái xử lý' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as AlarmStatus;
      const color =
        status === 'open'
          ? 'text-calendar-red'
          : status === 'active'
            ? 'text-yellow-2'
            : 'text-calendar-green';
      return (
        <div className={`${color} font-bold`}>{AlarmStatusLabel[status]}</div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'assignee_id',
    accessorKey: 'assignee_id',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
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
    id: 'resolved_at',
    accessorKey: 'resolved_at',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thời gian kết thúc' />
    ),
    cell: ({ row }) => {
      const resolved = row.getValue('resolved_at') as string;
      if (!resolved || resolved === '0001-01-01T00:00:00Z') {
        return '-';
      }
      const time = formatDateTimeString(resolved);
      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Alarm, unknown> }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const device = devices.find((d) => d.id === row.original.client_id);
      const status = row.getValue('status') as AlarmStatus;
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && (
            <CellAction
              active={!['open', 'ignored'].includes(status)}
              id={String(row.original.id)}
              lat={device?.device_info.lat || 0}
              lng={device?.device_info.lon || 0}
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
