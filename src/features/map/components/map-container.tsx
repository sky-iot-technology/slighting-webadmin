'use client';

import { Skeleton } from '@/ui/components/ui/skeleton';
import { useCallback, useEffect, useState } from 'react';
import MapFilter from './map-filter';
import { Device, useGetDevices } from '@/core/domains/devices';
import { SelectedRegion } from '@/ui/components/tree-group';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import GoongMap from '@/ui/business/map/goong-map';

export default function MapContainer() {
  const [selectedDevice, setSelectedDevice] = useState<{
    device: Device | null;
    ts: number;
  }>({ device: null, ts: 0 });
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion>(null);

  const { treeData, isLoading: isRegionsLoading } = useRegionTreeStore();

  const { data, isLoading, isFetching, error } = useGetDevices(
    { group: selectedRegion?.id },
    { enabled: !!selectedRegion }
  );
  const devices = data?.devices ?? [];

  useEffect(() => {
    if (treeData?.length && !selectedRegion) {
      setSelectedRegion({
        id: treeData[0].id,
        name: treeData[0].name
      });
    }
  }, [treeData, selectedRegion]);

  const handleRegionChange = useCallback((region: SelectedRegion) => {
    setSelectedRegion(region);
  }, []);

  return (
    <div className='relative h-[calc(100dvh-52px)] w-full'>
      <GoongMap
        selectedRegion={selectedRegion}
        devices={devices}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedDevice={selectedDevice}
      />

      <div className='absolute top-[15px] left-[9px] z-10'>
        {isRegionsLoading ? (
          <div className='bg-map-filter flex rounded-lg px-1 py-1'>
            <Skeleton className='bg-background mr-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]' />
            <Skeleton className='relative ml-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]' />
          </div>
        ) : (
          <MapFilter
            devices={devices}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            onSelectDevice={(d) =>
              setSelectedDevice({ device: d, ts: Date.now() })
            }
          />
        )}
      </div>
    </div>
  );
}
