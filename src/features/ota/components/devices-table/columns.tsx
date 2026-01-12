'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import { Device } from '@/core/domains/devices';
import { cn } from '@/lib/utils';

import { useTranslation } from '@/core/domains/language/useTranslation';

export const DeviceColumns = (t: any): ColumnDef<Device>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => {
        const selectableRows = table
          .getRowModel()
          .rows.filter((row) => row.getCanSelect());

        const isAllSelected =
          selectableRows.length > 0 &&
          selectableRows.every((row) => row.getIsSelected());

        return (
          <div className='flex items-center justify-center'>
            <Checkbox
              disabled={selectableRows.length === 0}
              checked={isAllSelected}
              onCheckedChange={(value) => {
                selectableRows.forEach((row) => row.toggleSelected(!!value));
              }}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        if ((row.original as any).isProgress) {
          return <div />;
        }
        return (
          <div className='flex items-center justify-center'>
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={() => row.toggleSelected()}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      maxSize: 50
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }: { column: Column<Device, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title={t('ota.sync.table.name' as any)}
        />
      ),
      cell: ({ row, table }) => {
        const original = row.original as any;

        if (original.isProgress) {
          return (
            <div className='relative w-full py-3'>
              <div className='absolute inset-x-0 px-4'>
                <div className='text-muted-foreground mb-1 text-xs'>
                  {t('ota.sync.table.updating' as any)} ({original.progress}%)
                </div>

                <div className='h-2 w-full overflow-hidden rounded bg-gray-200'>
                  <div
                    className='bg-primary h-2 transition-all'
                    style={{ width: `${original.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        }
        return <div>{row.getValue('name')}</div>;
      },
      // meta: {
      //   label: 'name',
      //   placeholder: 'Tìm tên model',
      //   variant: 'text'
      // },
      // enableColumnFilter: true,
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'version',
      accessorKey: 'version',
      header: ({ column }: { column: Column<Device, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title={t('ota.sync.table.version' as any)}
        />
      ),
      cell: ({ row }) => {
        if ((row.original as any).isProgress) {
          return <div />;
        }
        return (
          <div className='text-map-filter'>
            {row.original.device_info.sw_version}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }: { column: Column<Device, unknown> }) => (
        <DataTableColumnHeader
          column={column}
          title={t('ota.sync.table.status' as any)}
        />
      ),
      cell: ({ row }) => {
        if ((row.original as any).isProgress) {
          return <div />;
        }
        const isOnline = row.original.device_info.online;
        return (
          <>
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </>
        );
      },
      enableSorting: false,
      enableHiding: false
    }
  ];
};
