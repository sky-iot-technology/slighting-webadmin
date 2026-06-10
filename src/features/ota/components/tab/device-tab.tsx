import { useGetDevices } from '@/core/domains/devices';
import { useGetOta } from '@/core/domains/ota';
import { DeviceTable } from '../devices-table';
import { DeviceColumns } from '../devices-table/columns';
import { useClientDataTable } from '@/core/shared/hooks/test';
import { useMemo, useState } from 'react';
import { compareVersion } from '../../helper';
import { useCan } from '@/core/domains/permissions';

type DeviceTabProps = {
  id: string;
  onSelectionChange?: (ids: string[]) => void;
  progressMap?: Record<
    string,
    {
      progress: number;
      status: 'updating' | 'completed' | 'failed' | 'timeout';
      error?: string;
    }
  >;
};

import { useTranslation } from '@/core/domains/language/useTranslation';

export default function DeviceTab({
  id,
  onSelectionChange,
  progressMap
}: DeviceTabProps) {
  const { t } = useTranslation();
  const canViewDevice = useCan('device', 'view');

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
      enabled: !!data?.category_type && !isLoading && canViewDevice
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

      const progressInfo = progressMap?.[device.id];
      if (progressInfo) {
        result.push({
          id: `${device.id}-progress`,
          isProgress: true,
          progress: progressInfo.progress,
          status: progressInfo.status,
          error: progressInfo.error,
          parentId: device.id
        });
      }
    }

    return result;
  }, [devices, progressMap]);

  const { table } = useClientDataTable({
    data: tableData,
    columns: DeviceColumns(t),
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
