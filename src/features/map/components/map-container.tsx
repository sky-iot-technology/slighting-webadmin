'use client';

import { Skeleton } from '@/ui/components/ui/skeleton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MapFilter from './map-filter';
import { Button } from '@/ui/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Device,
  DeviceStatusFilter,
  GetDevicesParamsDto,
  useGetDeviceCount,
  useGetDevices,
  DEVICES_QUERY_KEY
} from '@/core/domains/devices';
import { SelectedRegion } from '@/ui/components/tree-group';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import GoongMap from '@/ui/business/map/goong-map';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { deviceDataLayer } from '../layer/device-data-layer';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

export default function MapContainer() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const canViewDevices = useCan('device', 'view');
  const breadcrumbContent = useMemo(
    () => (
      <div className='flex items-center'>
        <span className='text-lg font-bold'>{t('navbar.map')}</span>
      </div>
    ),
    [t]
  );

  useCustomBreadcrumbContent(breadcrumbContent);

  const [statusFilter, setStatusFilter] = useState<DeviceStatusFilter>('all');

  const [selectedDevice, setSelectedDevice] = useState<{
    device: Device | null;
    ts: number;
  }>({ device: null, ts: 0 });
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion>(null);
  const { treeData, isLoading: isRegionsLoading } = useRegionTreeStore();

  const deviceQueryParams = useMemo(() => {
    const baseParams: GetDevicesParamsDto = {
      group: selectedRegion?.id,
      limit: 100
    };

    if (statusFilter === 'online') {
      baseParams.metadata = JSON.stringify({
        device_info: { online: true }
      });
    }

    if (statusFilter === 'online') {
      baseParams.metadata = JSON.stringify({
        device_info: { online: true }
      });
    }

    if (statusFilter === 'offline') {
      baseParams.metadata = JSON.stringify({
        device_info: { online: false }
      });
    }

    return baseParams;
  }, [selectedRegion?.id, statusFilter]);

  const { data, isLoading, isFetching, refetch, error } = useGetDevices(
    deviceQueryParams,
    { enabled: !!selectedRegion && canViewDevices }
  );
  const devices = data?.devices ?? [];

  const { data: onlineData, refetch: refetchOnline } = useGetDeviceCount(true, {
    group: selectedRegion?.id
  });
  const { data: offlineData, refetch: refetchOffline } = useGetDeviceCount(
    false,
    { group: selectedRegion?.id }
  );

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

  useEffect(() => {
    if (!selectedRegion) return;

    setStatusFilter('all');
  }, [selectedRegion?.id]);

  return (
    <div className='relative h-[calc(100dvh-52px)] w-full'>
      <GoongMap
        selectedRegion={selectedRegion}
        devices={devices}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedDevice={selectedDevice}
        hover={true}
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
            online={onlineData?.total || 0}
            offline={offlineData?.total || 0}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            onSelectDevice={(d) =>
              setSelectedDevice({ device: d, ts: Date.now() })
            }
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefresh={() =>
              queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] })
            }
            isRefreshing={isFetching}
          />
        )}
      </div>
    </div>
  );
}
