import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import { SearchBar } from './search-bar';
import { Device, DeviceStatusFilter } from '@/core/domains/devices';
import { Button } from '@/ui/components/ui/button';
import { Separator } from '@/ui/components/ui/separator';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useMemo } from 'react';
import Image from 'next/image';

type SelectedRegion = { id: string; name: string } | null;

type MapFilterProps = {
  devices: Device[];
  online: number;
  offline: number;
  selectedRegion: SelectedRegion;
  onRegionChange: (region: SelectedRegion) => void;
  onSelectDevice?: (device: Device | null) => void;
  statusFilter: DeviceStatusFilter;
  onStatusChange?: (status: DeviceStatusFilter) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export default function MapFilter({
  devices,
  online,
  offline,
  selectedRegion,
  onRegionChange,
  onSelectDevice,
  statusFilter,
  onStatusChange,
  onRefresh,
  isRefreshing
}: MapFilterProps) {
  const { t } = useTranslation();

  const { lightsOn, lightsOff } = useMemo(() => {
    let on = 0;
    let off = 0;
    devices.forEach((device) => {
      const controllable = (device.devices || []).filter(
        (d) => d.type === 'lms.devices.types.LIGHT'
      );
      controllable.forEach((sub) => {
        if (sub.last_state?.on === true && device.status === 'online') {
          on++;
        } else {
          off++;
        }
      });
    });
    return { lightsOn: on, lightsOff: off };
  }, [devices]);

  return (
    <>
      <div className='absolute top-[15px] left-[9px] flex gap-2'>
        <div className='bg-map-filter flex rounded-lg px-1 py-1'>
          <TreeProvider
            height={400}
            onRegionChange={onRegionChange}
            selectedRegion={selectedRegion}
            buttonClassName={'dark:!bg-background !bg-background'}
            insideClassName='dark:bg-action'
          />

          <SearchBar devices={devices} onSelectDevice={onSelectDevice} />
        </div>
      </div>
      <div className='bg-card scrollbar-none fixed bottom-10 left-1/2 flex max-w-[95vw] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-lg border border-gray-200 p-1 whitespace-nowrap shadow-md'>
        <Button
          variant={'outline'}
          className={cn(
            'hover:text-success cursor-pointer !rounded-md border-white bg-white px-2 text-xs shadow-none hover:!bg-green-50 sm:h-[28px] sm:px-3 md:h-[30px]',
            statusFilter === 'online' &&
              'text-success border-green-200 bg-green-50 dark:bg-green-50'
          )}
          onClick={() =>
            onStatusChange?.(statusFilter === 'online' ? 'all' : 'online')
          }
        >
          <span className='relative flex h-2 w-2'>
            {statusFilter === 'online' && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75`}
              ></span>
            )}
            <span className='h-2 w-2 rounded-full bg-green-500'></span>
          </span>
          <span className='hidden sm:inline'>online </span>
          <span>({online})</span>
        </Button>
        <Separator orientation='vertical' className='!h-5' />
        <Button
          variant={'outline'}
          className={cn(
            'hover:text-destructive cursor-pointer !rounded-md border-white bg-white px-2 text-xs shadow-none hover:!bg-red-50 sm:h-[28px] sm:px-3 md:h-[30px]',
            statusFilter === 'offline' &&
              'text-destructive border-red-200 bg-red-50 dark:bg-red-50'
          )}
          onClick={() =>
            onStatusChange?.(statusFilter === 'offline' ? 'all' : 'offline')
          }
        >
          <span className='relative flex h-2 w-2'>
            {statusFilter === 'offline' && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75`}
              ></span>
            )}
            <span className='h-2 w-2 rounded-full bg-red-500'></span>
          </span>
          <span className='hidden sm:inline'>offline </span>
          <span>({offline})</span>
        </Button>
        <Separator orientation='vertical' className='!h-5' />
        <Button
          variant={'outline'}
          className='dark:bg-card cursor-default !rounded-md border-white bg-white px-2 text-xs text-emerald-600 shadow-none hover:bg-emerald-50 sm:h-[28px] sm:px-3 md:h-[30px] dark:text-emerald-400'
        >
          <Image
            src='/assets/icons/lightOn.svg'
            alt='lightOn'
            width={14}
            height={14}
          />
          <span className='hidden sm:inline'>{t('map.lights_on' as any)} </span>
          <span>({lightsOn})</span>
        </Button>
        {/* <Separator orientation='vertical' className='!h-5' />
        <Button
          variant={'outline'}
          className='cursor-default !rounded-md border-white bg-white px-2 text-xs text-slate-500 shadow-none hover:bg-slate-50 dark:bg-card dark:text-slate-400 sm:h-[28px] sm:px-3 md:h-[30px]'
        >
          <Image
            src='/assets/icons/lightOff.svg'
            alt='lightOff'
            width={14}
            height={14}
          />
          <span className='hidden sm:inline'>
            {t('map.lights_off' as any)}{' '}
          </span>
          <span>({lightsOff})</span>
        </Button> */}
        <Separator orientation='vertical' className='!h-5' />
        <Button
          variant={'outline'}
          className='hover:text-primary cursor-pointer !rounded-md border-white bg-white px-2 shadow-none hover:bg-slate-50 sm:h-[28px] sm:px-3 md:h-[30px]'
          onClick={() => onRefresh?.()}
          disabled={isRefreshing}
        >
          <RotateCcw
            className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')}
          />
        </Button>
      </div>
    </>
  );
}
