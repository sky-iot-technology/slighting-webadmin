'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { Calendar } from '@/core/domains/calendars';
import { PRIORITY_LABELS } from '@/core/domains/calendars/constant';
import { formatDateString } from '../../helper';

export const columns: ColumnDef<Calendar>[] = [
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
      const canExpand = row.getCanExpand();
      const isChild = row.depth > 0;
      return (
        <div className='flex w-full items-center gap-2'>
          {!isChild && (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select row'
              className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-[2px] border-[1px] border-black'
            />
          )}
          {canExpand ? (
            <button
              onClick={row.getToggleExpandedHandler()}
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
      variant: 'selectSimple',
      options: [
        { label: 'Khẩn cấp', value: 'Khẩn cấp' },
        { label: 'Theo lịch', value: 'Theo lịch' }
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
        return <div>-</div>;
      }

      return <div>{row.getValue('time')}</div>;
    }
  },
  {
    accessorKey: 'status',
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
      const date = formatDateString(row.original.schedules[0].start_datetime);
      return <div>{date}</div>;
    }
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: 'Ngày kết thúc',
    cell: ({ row }) => {
      if (row.depth > 0) return <div>-</div>;
      const date = formatDateString(row.original.schedules[0].end_datetime);
      return <div>{date}</div>;
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

      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          {!isSubRow && <CellAction id={row.original.id} />}
        </div>
      );
    }
  }
];
