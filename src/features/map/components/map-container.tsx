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
  DEVICES_QUERY_KEY
} from '@/core/domains/devices';
import { SelectedRegion } from '@/ui/components/tree-group';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import GoongMap from '@/ui/business/map/goong-map';
import { useCustomBreadcrumbContent } from '@/core/shared/hooks/use-breadcrumbs';
import { DeviceDataLayer } from '../layer/device-data-layer';
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

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const dataLayer = useMemo(() => new DeviceDataLayer(), []);

  const { data: onlineData, refetch: refetchOnline } = useGetDeviceCount(true, {
    group: selectedRegion?.id
  });
  const { data: offlineData, refetch: refetchOffline } = useGetDeviceCount(
    false,
    { group: selectedRegion?.id }
  );

  useEffect(() => {
    if (!selectedRegion || !canViewDevices) return;

    let accumulated: Device[] = [];

    const unsubscribeDevice = dataLayer.onDevice((device) => {
      accumulated.push(device);
      setDevices([...accumulated]);
    });

    const unsubscribeDone = dataLayer.onDone(() => {
      setIsLoading(false);
      setIsFetching(false);
    });

    const unsubscribeError = dataLayer.onError((err) => {
      setError(err as Error);
      setIsLoading(false);
      setIsFetching(false);
    });

    setIsLoading(true);
    setIsFetching(true);
    setError(null);
    setDevices([]);

    dataLayer.load(deviceQueryParams);

    return () => {
      unsubscribeDevice();
      unsubscribeDone();
      unsubscribeError();
      dataLayer.stop();
    };
  }, [
    dataLayer,
    selectedRegion?.id,
    deviceQueryParams,
    canViewDevices,
    refreshKey
  ]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    refetchOnline();
    refetchOffline();
    queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
  }, [refetchOnline, refetchOffline, queryClient]);

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
            onRefresh={handleRefresh}
            isRefreshing={isFetching}
          />
        )}
      </div>
    </div>
  );
}
