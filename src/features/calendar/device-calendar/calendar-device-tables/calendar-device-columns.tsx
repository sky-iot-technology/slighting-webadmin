'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { Calendar } from '@/core/domains/calendars';
import {
  DEVICESYNC_LABELS,
  PRIORITY_LABELS
} from '@/core/domains/calendars/constant';
import { formatDateString } from '../../helper';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Calendar>[] = [
  {
    accessorKey: 'check_box',
    header: ({ table }) => {
      const allNonDeletedRowsSelected = table
        .getRowModel()
        .rows.every((row) => row.original.is_deleted || row.getIsSelected());
      return (
        <Checkbox
          checked={allNonDeletedRowsSelected}
          onCheckedChange={(value) => {
            table.getRowModel().rows.forEach((row) => {
              if (!row.original.is_deleted) {
                row.toggleSelected(!!value);
              }
            });
          }}
          aria-label='Select all'
          className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-[2px] border-[1px] border-black'
        />
      );
    },
    size: 50,
    cell: ({ row }) => {
      const canExpand = row.getCanExpand();
      const isChild = row.depth > 0;
      const isDeleted = row.original.is_deleted === true;

      return (
        <div
          className={cn(
            'flex w-full items-center gap-2 transition-opacity',
            isDeleted && 'pointer-events-none opacity-50 select-none'
          )}
        >
          {!isChild && (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select row'
              disabled={isDeleted}
              className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-[2px] border-[1px] border-black'
            />
          )}
          {canExpand ? (
            <button
              onClick={row.getToggleExpandedHandler()}
              disabled={isDeleted}
              className='flex h-4 w-4 items-center justify-center'
            >
              {row.getIsExpanded() ? (
                <Image
                  src={'/assets/icons/chevronDown.svg'}
                  alt='chevronDown'
                  width={12}
                  height={12}
                  className='h-3.5 w-3.5'
                />
              ) : (
                <Image
                  src={'/assets/icons/chevronRight.svg'}
                  alt='chevronRight'
                  width={12}
                  height={12}
                  className='h-3.5 w-3.5'
                />
              )}
            </button>
          ) : (
            <span className='inline-block w-4' />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Tên lịch',
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
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
    header: 'Loại lịch',
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const priority = row.getValue('priority') as number;
      const label = PRIORITY_LABELS[priority] || 'Không xác định';
      const color =
        priority === 1
          ? 'text-calendar-red'
          : priority === 2
            ? 'text-calendar-blue'
            : 'text-calendar-gray';

      return <div className={color}>{label}</div>;
    },
    meta: {
      label: 'Loại lịch',
      variant: 'select',
      options: [
        { label: 'Khẩn cấp', value: '1' },
        { label: 'Theo lịch', value: '2' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'time',
    header: 'Thời gian',
    cell: ({ row }) => {
      if (row.depth === 0) {
        const { last_execution_status, schedules } = row.original as any;
        let parsedStatus: { job_id?: number; status?: string } = {};
        try {
          parsedStatus = JSON.parse(last_execution_status);
        } catch (error) {
          parsedStatus = {};
        }
        const schedule = schedules.find(
          (s: any) => s.id === parsedStatus.job_id
        );
        if (schedule) {
          return <div>{schedule.time}</div>;
        }

        const toMinutes = (timeStr: string) => {
          const [h, m] = timeStr.split(':').map(Number);
          if (Number.isNaN(h) || Number.isNaN(m)) return null;
          return h * 60 + m;
        };
        const childTimes = schedules
          ?.map((r: any) => r.time as string | undefined)
          .filter((t: any): t is string => Boolean(t))
          .map((t: any) => ({ t, minutes: toMinutes(t) }))
          .filter((x: any) => x.minutes !== null)
          .sort((a: any, b: any) => a.minutes! - b.minutes!);

        if (childTimes?.length > 0) {
          const start = childTimes[0].t;
          if (childTimes.length === 1) {
            return <div>{start}</div>;
          }
          const end = childTimes[childTimes.length - 1].t;
          return (
            <div>
              {start} - {end}
            </div>
          );
        }
        return <div>-</div>;
      }

      return <div>{row.getValue('time')}</div>;
    }
  },
  {
    accessorKey: 'status_light',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      let schedule: any;

      if (!isSubRow) {
        const { last_execution_status, schedules } = row.original as any;
        let parsedStatus: { job_id?: number; status?: string } = {};
        try {
          parsedStatus = JSON.parse(last_execution_status);
        } catch (error) {
          parsedStatus = {};
        }
        if (parsedStatus.status !== 'SUCCESS') {
          return <div>-</div>;
        }
        schedule = schedules.find((s: any) => s.id === parsedStatus.job_id);
        if (!schedule) {
          return <div>-</div>;
        }
      } else {
        schedule = row.original;
      }
      const { payload }: any = schedule;

      const command = payload?.command ?? '';
      const params = payload?.params ?? {};

      const isOn = params?.on === true;

      let icon = '/assets/icons/calendarOffline.svg';
      let label = '';

      if (command.includes('OnOff')) {
        icon = isOn
          ? '/assets/icons/calendarOnline.svg'
          : '/assets/icons/calendarOffline.svg';
        label = isOn ? 'Bật' : 'Tắt';
      } else if (command.includes('Brightness')) {
        icon = '/assets/icons/calendarOnline.svg';
        const brightness = params.brightness;
        label = `${brightness}%`;
      } else {
        label = 'Không xác định';
      }

      return (
        <div className='flex items-center gap-3'>
          <Image src={icon} alt='schedule-status' width={16} height={20} />
          <span>{label}</span>
        </div>
      );
    }
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    header: 'Ngày bắt đầu',
    meta: {
      label: '',
      variant: 'dateRange'
    },
    enableColumnFilter: true,
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const date = formatDateString(
        row.original.schedules[0].start_datetime.replace(/Z$/, '')
      );
      return <div>{date}</div>;
    }
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: 'Ngày kết thúc',
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const date = formatDateString(
        row.original.schedules[0].end_datetime.replace(/Z$/, '')
      );
      return <div>{date}</div>;
    },
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: () => null,
    meta: {
      label: 'Trạng thái',
      variant: 'select',
      options: [
        { label: 'Kích hoạt', value: 'active' },
        { label: 'Chưa kích hoạt', value: 'inactive' }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'group',
    accessorKey: 'group',
    header: 'Chi nhánh',
    cell: () => {},
    meta: {
      label: 'Chi nhánh',
      variant: 'regionTree'
    },
    enableColumnFilter: true
  },
  {
    id: 'device_sync',
    accessorKey: 'device_sync',
    header: 'Trạng thái đồng bộ',
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const device_state = row.getValue(
        'device_sync'
      ) as keyof typeof DEVICESYNC_LABELS;
      const label = DEVICESYNC_LABELS[device_state] ?? String(device_state);
      const colorClass =
        device_state === 'synced'
          ? 'text-calendar-radio-green'
          : device_state === 'waiting'
            ? 'text-calendar-red'
            : 'text-calendar-gray';
      return <div className={colorClass}>{label}</div>;
    },
    meta: {
      label: 'Trạng thái đồng bộ',
      variant: 'select',
      options: [
        { label: 'Đã đồng bộ', value: 'synced' },
        { label: 'Chưa đồng bộ', value: 'waiting' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'createdDate',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const date = formatDateString(row.original.created_at);
      return <div>{date}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const isDeleted = row.original.is_deleted === true;

      return (
        <div
          className={cn(
            'flex min-h-[32px] items-center justify-center transition-opacity',
            isDeleted && 'pointer-events-none opacity-50 select-none'
          )}
        >
          {!isSubRow && (
            <CellAction id={row.original.id} disabled={isDeleted} />
          )}
        </div>
      );
    }
  }
];
