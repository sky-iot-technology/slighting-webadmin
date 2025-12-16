'use client';

import { Skeleton } from '@/ui/components/ui/skeleton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MapFilter from './map-filter';
import { Device, useGetDevices } from '@/core/domains/devices';
import { SelectedRegion } from '@/ui/components/tree-group';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import GoongMap from '@/ui/business/map/goong-map';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { deviceDataLayer } from '../layer/device-data-layer';

export default function MapContainer() {
  // const [devices, setDevices] = useState<Device[]>([]);

  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>Bản đồ</span>
      </div>
    ),
    []
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const [selectedDevice, setSelectedDevice] = useState<{
    device: Device | null;
    ts: number;
  }>({ device: null, ts: 0 });
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion>(null);
  const { treeData, isLoading: isRegionsLoading } = useRegionTreeStore();

  const { data, isLoading, isFetching, error } = useGetDevices(
    { group: selectedRegion?.id, limit: 100 },
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

  // useEffect(() => {
  //   if (!selectedRegion) return;

  //   setDevices([]);

  //   const offDevice = deviceDataLayer.onDevice((device) => {
  //     setDevices((prev) => [...prev, device]);
  //   });

  //   const offDone = deviceDataLayer.onDone(() => {
  //     console.log('Load devices xong');
  //   });

  //   const offError = deviceDataLayer.onError((err) => {
  //     console.error('Load device error', err);
  //   });

  //   deviceDataLayer.load({
  //     group: selectedRegion.id,
  //     limit: 10
  //   });

  //   return () => {
  //     offDevice();
  //     offDone();
  //     offError();
  //     deviceDataLayer.stop();
  //   };
  // }, [selectedRegion]);

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
