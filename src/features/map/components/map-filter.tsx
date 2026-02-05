import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import { SearchBar } from './search-bar';
import { Device, DeviceStatusFilter } from '@/core/domains/devices';
import { Button } from '@/ui/components/ui/button';
import { Separator } from '@/ui/components/ui/separator';
import { cn } from '@/lib/utils';

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
};

export default function MapFilter({
  devices,
  online,
  offline,
  selectedRegion,
  onRegionChange,
  onSelectDevice,
  statusFilter,
  onStatusChange
}: MapFilterProps) {
  return (
    <>
      <div className='absolute top-[15px] left-[9px] flex gap-2'>
        <div className='bg-map-filter flex rounded-lg px-1 py-1'>
          <TreeProvider
            onRegionChange={onRegionChange}
            selectedRegion={selectedRegion}
            buttonClassName={'dark:!bg-background !bg-background'}
            insideClassName='dark:bg-action'
          />

          <SearchBar devices={devices} onSelectDevice={onSelectDevice} />
        </div>
      </div>
      <div className='bg-card fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-gray-200 p-1'>
        <Button
          variant={'outline'}
          className={cn(
            'hover:text-success cursor-pointer !rounded-md border-white bg-white shadow-none hover:!bg-green-50 sm:h-[28px] md:h-[30px]',
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
          online ({online})
        </Button>
        <Separator orientation='vertical' className='!h-5' />
        <Button
          variant={'outline'}
          className={cn(
            'hover:text-destructive cursor-pointer !rounded-md border-white bg-white shadow-none hover:!bg-red-50 sm:h-[28px] md:h-[30px]',
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
          offline ({offline})
        </Button>
      </div>
    </>
  );
}
