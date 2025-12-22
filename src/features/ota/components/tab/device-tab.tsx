import { useGetDevices } from '@/core/domains/devices';
import { useGetOta } from '@/core/domains/ota';
import { DeviceTable } from '../devices-table';
import { DeviceColumns } from '../devices-table/columns';
import { useClientDataTable } from '@/core/shared/hooks/test';
import { useMemo, useState } from 'react';
import { compareVersion } from '../../helper';

type DeviceTabProps = {
  id: string;
  onSelectionChange?: (ids: string[]) => void;
  progressMap?: Record<string, number>;
};

export default function DeviceTab({
  id,
  onSelectionChange,
  progressMap
}: DeviceTabProps) {
  const { data, isLoading } = useGetOta(id, {
    enabled: !!id
  });

  const {
    data: deviceData,
    isLoading: deviceLoad,
    error
  } = useGetDevices(
    {
      limit: 100,
      type: data?.category_type
    },
    {
      enabled: !!data?.category_type && !isLoading
    }
  );

  const devices = useMemo(
    () => deviceData?.devices ?? [],
    [deviceData?.devices]
  );
  const totalDevices = deviceData?.total ?? 0;

  const tableData = useMemo(() => {
    const result: any[] = [];

    for (const device of devices) {
      result.push(device);

      const progress = progressMap?.[device.id];
      if (typeof progress === 'number' && progress < 100) {
        result.push({
          id: `${device.id}-progress`,
          isProgress: true,
          progress,
          parentId: device.id
        });
      }
    }

    return result;
  }, [devices, progressMap]);

  const { table } = useClientDataTable({
    data: tableData,
    columns: DeviceColumns(),
    initialPageSize: 10,
    enableRowSelection: (row) => {
      if (row.original.isProgress) return false;
      if (!data?.version) return false;
      const info = row.original.device_info;

      return (
        info.online !== false &&
        compareVersion(info.sw_version, data.version) < 0
      );
    }
  });

  return (
    <DeviceTable
      table={table}
      isLoading={deviceLoad}
      error={error}
      totalItems={totalDevices}
      onSelectionChange={onSelectionChange}
    />
  );
}
