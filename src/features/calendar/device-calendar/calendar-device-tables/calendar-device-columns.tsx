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
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import { Badge } from '@/ui/components/ui/badge';

export const columns = (t: any): ColumnDef<Calendar>[] => [
  {
    accessorKey: 'check_box',
    header: ({ table }) => {
      const rows = table.getRowModel().rows;

      const selectableRows = rows.filter((row) => !row.original.is_deleted);

      const allSelected =
        selectableRows.length > 0 &&
        selectableRows.every((row) => row.getIsSelected());

      return (
        <Checkbox
          checked={allSelected}
          onCheckedChange={(value) => {
            selectableRows.forEach((row) => {
              row.toggleSelected(!!value);
            });
          }}
          aria-label='Select all'
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
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader
        column={column}
        title={t('calendar.calendar_name')}
      />
    ),
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      return <div>{row.getValue('name')}</div>;
    },
    meta: {
      label: 'name',
      placeholder: t('calendar.search_calendar_name'),
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.type')} />
    ),
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const isGroup =
        Array.isArray(row.original.group_ids) &&
        row.original.group_ids.length > 0;

      return (
        <Badge
          variant={isGroup ? 'default' : 'secondary'}
          className={isGroup ? 'dark:text-white' : ''}
        >
          {isGroup ? t('calendar.group') : t('calendar.device')}
        </Badge>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader
        column={column}
        title={t('calendar.calendar_type')}
      />
    ),
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const priority = row.getValue('priority') as string;
      const label = PRIORITY_LABELS[priority]
        ? t(
            `calendar.priority.${PRIORITY_LABELS[priority] === 'Theo lịch' ? 'normal' : 'emergency'}`
          )
        : t('calendar.undefined');
      const color =
        priority === 'emergency'
          ? 'text-calendar-red'
          : priority === 'normal'
            ? 'text-calendar-blue'
            : 'text-calendar-gray';

      return <div className={color}>{label}</div>;
    },
    meta: {
      label: t('calendar.calendar_type'),
      variant: 'select',
      options: [
        { label: t('calendar.priority.emergency'), value: '1' },
        { label: t('calendar.priority.normal'), value: '2' }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'time',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.time')} />
    ),
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
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'status_light',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.status')} />
    ),
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

      if (command.includes('lms.devices.commands.OnOff')) {
        icon = isOn
          ? '/assets/icons/calendarOnline.svg'
          : '/assets/icons/calendarOffline.svg';
        label = isOn ? t('calendar.on') : t('calendar.off');
      } else if (command.includes('lms.devices.commands.BrightnessAbsolute')) {
        const brightness = Number(params?.brightness ?? 0);

        const isOnByBrightness = brightness > 0;

        icon = isOnByBrightness
          ? '/assets/icons/calendarOnline.svg'
          : '/assets/icons/calendarOffline.svg';

        label = `${brightness}%`;
      } else {
        label = t('calendar.undefined');
      }

      return (
        <div className='flex items-center gap-3'>
          <Image src={icon} alt='schedule-status' width={16} height={20} />
          <span>{label}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'startDate',
    accessorKey: 'startDate',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.start_date')} />
    ),
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
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.end_date')} />
    ),
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const date = formatDateString(
        row.original.schedules[0].end_datetime.replace(/Z$/, '')
      );
      return <div>{date}</div>;
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.status')} />
    ),
    cell: () => null,
    meta: {
      label: t('calendar.status'),
      variant: 'select',
      options: [
        { label: t('calendar.calendar_status.active'), value: 'active' },
        { label: t('calendar.calendar_status.inactive'), value: 'inactive' }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  // {
  //   id: 'group',
  //   accessorKey: 'group',
  //   header: 'Chi nhánh',
  //   cell: () => {},
  //   meta: {
  //     label: 'Chi nhánh',
  //     variant: 'regionTree'
  //   },
  //   enableColumnFilter: true
  // },
  {
    id: 'device_sync',
    accessorKey: 'device_sync',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader
        column={column}
        title={t('calendar.device_sync')}
      />
    ),
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const device_state = row.getValue(
        'device_sync'
      ) as keyof typeof DEVICESYNC_LABELS;
      const label = DEVICESYNC_LABELS[device_state]
        ? t(
            `calendar.sync.${DEVICESYNC_LABELS[device_state] === 'Đã đồng bộ' ? 'synced' : 'waiting'}`
          )
        : t('calendar.undefined');
      const colorClass =
        device_state === 'synced'
          ? 'text-calendar-radio-green'
          : device_state === 'waiting'
            ? 'text-calendar-red'
            : 'text-calendar-gray';
      return <div className={colorClass}>{label}</div>;
    },
    meta: {
      label: t('calendar.device_sync'),
      variant: 'select',
      options: [
        { label: t('calendar.sync.synced'), value: 'synced' },
        { label: t('calendar.sync.waiting'), value: 'waiting' }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader
        column={column}
        title={t('calendar.created_date')}
      />
    ),
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const date = formatDateString(row.original.created_at);
      return <div>{date}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title={t('calendar.action')} />
    ),
    size: 57,
    cell: ({ row }) => {
      const isSubRow = row.depth > 0;
      const isDeleted = row.original.is_deleted === true;
      const hasGroup =
        Array.isArray(row.original.group_ids) &&
        row.original.group_ids.length > 0;

      return (
        <div
          className={cn(
            'flex min-h-[32px] items-center justify-center transition-opacity',
            isDeleted && 'pointer-events-none opacity-50 select-none'
          )}
        >
          {!isSubRow && (
            <CellAction
              id={row.original.id}
              disabled={isDeleted}
              hideDelete={hasGroup}
            />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
