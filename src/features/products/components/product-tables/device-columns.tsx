'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import type { Device } from '@/core/domains/devices';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { cn } from '@/lib/utils';
import { formatDateString } from '@/lib/utils';
import { diffTimeHMS } from '@/features/map/helper';
import Image from 'next/image';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/ui/components/ui/hover-card';

function DeviceStateCell({ device, t }: { device: Device; t: any }) {
  const isOnline = device.device_info?.online ?? false;

  const lightDevices = (device.devices ?? []).filter(
    (d) => d.type === 'lms.devices.types.LIGHT'
  );
  const switchDevices = (device.devices ?? []).filter(
    (d) => d.type === 'lms.devices.types.SWITCH'
  );
  const controllableDevices = [...switchDevices, ...lightDevices];
  const activeLights = controllableDevices.filter(
    (d) => d.last_state?.on
  ).length;
  const totalLights = controllableDevices.length;
  const isCabinet = device.type === 'lms.devices.types.STL_CABINET';

  if (isCabinet) {
    const badge =
      activeLights > 0 ? (
        <span
          className={cn(
            'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-xs transition-colors',
            isOnline
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-emerald-300/60 bg-emerald-50/50 text-emerald-700/60 opacity-60 grayscale-[30%] hover:opacity-80 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-emerald-400/60'
          )}
        >
          <span className='relative flex h-2 w-2'>
            {isOnline && (
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
            )}
            <span
              className={cn(
                'relative inline-flex h-2 w-2 rounded-full',
                isOnline ? 'bg-emerald-500' : 'bg-emerald-400/60'
              )}
            ></span>
          </span>
          Mở {activeLights}/{totalLights} line
        </span>
      ) : (
        <span className='inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'>
          <span className='h-2 w-2 rounded-full bg-slate-400'></span>
          {t('products.table.status_val.all_off' as any)} ({totalLights} line)
        </span>
      );

    return (
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>{badge}</HoverCardTrigger>
        <HoverCardContent
          side='top'
          align='start'
          className='bg-popover border-border z-50 w-64 rounded-xl border p-3 shadow-xl'
        >
          <div className='border-border mb-2 flex items-center justify-between border-b pb-2'>
            <span className='text-xs font-bold text-gray-800 dark:text-white'>
              {t('map.line_status_hover')}
            </span>
            <span className='text-muted-foreground text-[10px]'>
              {activeLights} / {totalLights} {t('map.line_status' as any)}
            </span>
          </div>
          <div className='max-h-[160px] space-y-1.5 overflow-y-auto pr-1'>
            {controllableDevices.length > 0 ? (
              controllableDevices.map((sub, idx) => {
                const isLight = sub.type === 'lms.devices.types.LIGHT';
                const isOn = sub.last_state?.on;
                const brightness = sub.last_state?.brightness;

                return (
                  <div
                    key={sub.device_id || idx}
                    className='hover:bg-accent/50 flex items-center justify-between rounded-md px-1.5 py-1 text-xs'
                  >
                    <div className='flex items-center gap-2 truncate pr-1'>
                      <Image
                        src={
                          isOn
                            ? '/assets/icons/lightOn.svg'
                            : '/assets/icons/lightOff.svg'
                        }
                        alt={isOn ? 'lightOn' : 'lightOff'}
                        width={14}
                        height={14}
                      />
                      <span className='text-foreground truncate text-xs font-medium'>
                        {sub.name}
                      </span>
                    </div>

                    <div className='flex shrink-0 items-center gap-1.5'>
                      {isLight && brightness !== undefined && (
                        <span className='flex items-center gap-0.5 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'>
                          <Image
                            src='/assets/icons/brightness-half.svg'
                            alt='brightness'
                            width={12}
                            height={12}
                          />
                          {brightness}%
                        </span>
                      )}
                      {isOn ? (
                        <span className='rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400'>
                          {t('map.on' as any)}
                        </span>
                      ) : (
                        <span className='rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-500 dark:bg-red-900/30 dark:text-red-400'>
                          {t('map.off' as any)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='text-muted-foreground py-2 text-center text-xs'>
                Không có dữ liệu line
              </p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  const isOn = activeLights > 0;
  const mainLightSub = lightDevices[0] || controllableDevices[0];
  const brightness = mainLightSub?.last_state?.brightness;

  return (
    <div className='flex items-center gap-2'>
      {isOn ? (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
            isOnline
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-emerald-300/60 bg-emerald-50/50 text-emerald-700/60 opacity-60 grayscale-[30%] dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-emerald-400/60'
          )}
        >
          <span className='relative flex h-2 w-2'>
            {isOnline && (
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
            )}
            <span
              className={cn(
                'relative inline-flex h-2 w-2 rounded-full',
                isOnline ? 'bg-emerald-500' : 'bg-emerald-400/60'
              )}
            ></span>
          </span>
          {t('products.table.status_val.light_on' as any)}
          {brightness !== undefined && brightness !== null && (
            <span
              className={cn(
                'flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold',
                isOnline
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-yellow-100/60 text-yellow-700/60 dark:bg-yellow-900/20 dark:text-yellow-400/60'
              )}
            >
              <Image
                src='/assets/icons/brightness-half.svg'
                alt='brightness'
                width={12}
                height={12}
                className={cn(!isOnline && 'opacity-60')}
              />
              {brightness}%
            </span>
          )}
        </span>
      ) : (
        <span className='inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'>
          <span className='h-2 w-2 rounded-full bg-slate-400'></span>
          {t('products.table.status_val.light_off' as any)}
        </span>
      )}
    </div>
  );
}

export const deviceColumns = (t: any, tTime: any): ColumnDef<Device>[] => [
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
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.id' as any)}
      />
    ),
    cell: ({ cell }) => {
      const id = cell.getValue<Device['id']>();
      const formattedId = id ? `...${String(id).slice(-4)}` : '';
      return <div>{formattedId}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.name' as any)}
      />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Device['name']>()}</div>,
    meta: {
      label: t('products.table.name' as any),
      placeholder: t('products.placeholder.search_device' as any),
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'ccid',
    accessorFn: (row) => row.device_info?.optional?.ccid,
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.ccid' as any)}
      />
    ),
    cell: ({ cell }) => {
      const ccid = cell.getValue<string>();
      const formattedId = ccid ? `...${String(ccid).slice(-4)}` : '';
      return <div>{formattedId}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.type' as any)}
      />
    ),
    meta: {
      label: t('products.table.type' as any),
      variant: 'select',
      options: []
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.status' as any)}
      />
    ),
    cell: ({ row }) => {
      const online = row.original.device_info?.online;
      return (
        <div className={cn(online ? 'text-green-600' : 'text-red-600')}>
          {online
            ? t('products.table.status_val.online' as any)
            : t('products.table.status_val.offline' as any)}
        </div>
      );
    },
    meta: {
      label: t('products.table.status' as any),
      variant: 'select',
      options: [
        {
          label: t('products.table.status_val.online' as any),
          value: '{"device_info": {"online": true}}'
        },
        {
          label: t('products.table.status_val.offline' as any),
          value: '{"device_info": {"online": false}}'
        }
      ]
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'parent_group_id',
    accessorKey: 'parent_group_id',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.branch' as any)}
      />
    ),
    meta: {
      label: t('products.table.branch' as any),
      variant: 'select'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'device_state',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.device_state' as any)}
      />
    ),
    meta: {
      label: t('products.table.device_state' as any)
    },
    cell: ({ row }) => <DeviceStateCell device={row.original} t={t} />,
    enableSorting: false,
    enableHiding: false,
    size: 200
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.online_time' as any)}
      />
    ),
    meta: {
      label: t('products.table.online_time' as any)
    },
    cell: ({ cell }) => {
      const time = diffTimeHMS(cell.row.original.updated_at, tTime);
      return <div>{time}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.activation_date' as any)}
      />
    ),
    meta: {
      label: t('products.table.activation_date' as any)
    },
    cell: ({ cell }) => {
      const deviceAsset = cell.row.original.device_asset;
      return <div>{formatDateString(deviceAsset?.created_at)}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'warning',
    accessorKey: 'warning',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.warning' as any)}
      />
    ),
    meta: {
      label: t('products.table.warning' as any)
    },
    cell: ({ cell }) => {
      const warning = cell.row.original.warning;
      return (
        <div>
          {warning
            ? t('products.table.warning_val.yes' as any)
            : t('products.table.warning_val.no' as any)}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'region',
    accessorKey: 'region',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.address' as any)}
      />
    ),
    meta: {
      label: t('products.table.address' as any)
    },
    cell: ({ cell }) => {
      const region = cell.row.original.device_info?.region;
      return <div className='max-w-[100px] truncate'>{region || '-'}</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<Device, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title={t('products.table.action' as any)}
      />
    ),
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 60,
    enablePinning: true,
    enableSorting: false,
    enableHiding: false
  }
];
