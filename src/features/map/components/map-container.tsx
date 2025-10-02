'use client';

import { useGetGroups } from '@/core/domains/groups';
import { Skeleton } from '@/ui/components/ui/skeleton';
import { useCallback, useEffect, useState } from 'react';
import MapFilter from './map-filter';
import GoongMap from './goong-map';
import { Device, useGetDevices } from '@/core/domains/devices';

type SelectedRegion = { id: string; name: string } | null;
export default function MapContainer() {
  const [selectedDevice, setSelectedDevice] = useState<{
    device: Device | null;
    ts: number;
  }>({ device: null, ts: 0 });
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion>(null);
  const { data: regions, isLoading: isRegionsLoading } = useGetGroups({
    root_group: true
  });
  const { data, isLoading, isFetching, error } = useGetDevices(
    { group: selectedRegion?.id },
    { enabled: !!selectedRegion }
  );
  const devices = data?.devices ?? [];
  useEffect(() => {
    if (regions?.groups?.length && !selectedRegion) {
      setSelectedRegion({
        id: String(regions.groups[0].id),
        name: regions.groups[0].name
      });
    }
  }, [regions]);

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
