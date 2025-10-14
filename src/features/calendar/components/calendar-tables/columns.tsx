'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { Calendar } from '@/core/domains/calendars';

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
      return (
        <div className='flex w-full items-center gap-2'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-[2px] border-[1px] border-black'
          />
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
            <span className='inline-block w-4' /> // giữ layout thẳng hàng
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
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    meta: {
      label: 'name',
      placeholder: 'Tìm tên lịch',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Loại lịch',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const corlorClass =
        type === 'Khẩn cấp'
          ? 'text-calendar-red'
          : type === 'Theo lịch'
            ? 'text-calendar-blue'
            : 'text-calendar-gray';

      return <div className={corlorClass}>{type}</div>;
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
    cell: ({ row }) => <div>{row.getValue('time')}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const icon =
        status === 'active'
          ? '/assets/icons/calendarOnline.svg'
          : status === 'inactive'
            ? '/assets/icons/calendarOffline.svg'
            : '/assets/icons/calendarDisconnect.svg';
      return (
        <div className='flex items-center gap-2.5'>
          <Image src={icon} alt={status} width={16} height={20} />
          <span>test</span>
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
      const date = new Date(row.getValue('startDate') as string);
      return <div>{date.toLocaleDateString('vi-VN')}</div>;
    }
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: 'Ngày kết thúc',
    cell: ({ row }) => {
      const date = new Date(row.getValue('endDate') as string);
      return <div>{date.toLocaleDateString('vi-VN')}</div>;
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'createdDate',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdDate') as string);
      return <div>{date.toLocaleDateString('vi-VN')}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    size: 57,
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
