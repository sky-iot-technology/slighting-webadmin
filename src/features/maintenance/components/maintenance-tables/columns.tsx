'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
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

export const maintenanceColumns = (
  users: User[],
  devices: Device[]
): ColumnDef<Alarm>[] => [
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
    id: 'client_id',
    accessorKey: 'client_id',
    header: 'Mã thiết bị',
    cell: ({ row }) => {
      const clientId = row.getValue('client_id') as string;
      const device = devices.find((d) => d.id === clientId);
      return <div>{device?.device_info.imei}</div>;
    }
  },
  {
    id: 'measurement',
    accessorKey: 'measurement',
    header: 'Tên cảnh báo',
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
    enableColumnFilter: true
  },
  {
    id: 'severity',
    accessorKey: 'severity',
    header: 'Ưu tiên',
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
    }
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: 'Thời gian gửi cảnh báo',
    cell: ({ row }) => {
      const time = formatDateTimeString(row.getValue('created_at') as string);
      return <div>{time}</div>;
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
      const resolvedTime = row.original.resolved_at;
      const alarmTime = row.original.created_at;
      if (!resolvedTime || resolvedTime === '0001-01-01T00:00:00Z') {
        return <div>-</div>;
      }
      const time = diffTimeBetween(alarmTime, resolvedTime);

      return <div>{time}</div>;
    }
  },
  {
    id: 'sendBy',
    accessorKey: 'sendBy',
    header: 'Người gửi',
    cell: ({ row }) => {
      return <div>Hệ thống</div>;
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái xử lý',
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
    }
  },
  {
    id: 'assignee_id',
    accessorKey: 'assignee_id',
    header: 'Người xử lý',
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
    }
  },
  {
    id: 'resolved_at',
    accessorKey: 'resolved_at',
    header: 'Thời gian kết thúc',
    cell: ({ row }) => {
      const resolved = row.getValue('resolved_at') as string;
      if (!resolved || resolved === '0001-01-01T00:00:00Z') {
        return '-';
      }
      const time = formatDateTimeString(resolved);
      return <div>{time}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
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
    }
  }
];
