import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import { DeviceTable } from '../devices-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectedRegion } from '@/ui/components/tree-group';
import { useGetOta } from '@/core/domains/ota';
import { useGetDevices } from '@/core/domains/devices';
import { useClientDataTable } from '@/core/shared/hooks/test';
import { DeviceColumns } from '../devices-table/columns';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { compareVersion } from '../../helper';

type DeviceTabProps = {
  id: string;
  onSelectionChange?: (ids: string[]) => void;
  progressMap?: Record<string, number>;
};

export default function DeviceRegionTab({
  id,
  onSelectionChange,
  progressMap
}: DeviceTabProps) {
  const [treeOpen, setTreeOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(
    null
  );
  const { treeData } = useRegionTreeStore();

  const { data } = useGetOta(id, { enabled: !!id });

  useEffect(() => {
    if (treeData?.length && !selectedRegion) {
      setSelectedRegion({
        id: treeData[0].id,
        name: treeData[0].name
      });
    }
  }, [treeData, selectedRegion]);

  const canFetchDevices = !!data?.category_type && !!selectedRegion?.id;

  const {
    data: deviceData,
    isLoading,
    error
  } = useGetDevices(
    {
      limit: 100,
      type: data?.category_type,
      group: selectedRegion?.id
    },
    { enabled: canFetchDevices }
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

  const handleRegionChange = useCallback((region: SelectedRegion) => {
    setSelectedRegion(region);
    setTreeOpen(false);
  }, []);

  return (
    <div className='mt-1 flex w-full flex-col'>
      <TreeProvider
        open={treeOpen}
        onOpenChange={setTreeOpen}
        onRegionChange={handleRegionChange}
        selectedRegion={selectedRegion ?? undefined}
        className='z-[50] !h-[31px] !w-full !text-xs'
        buttonClassName='!rounded-[4px]'
        treeClassName='!w-full !rounded-[4px]'
      />

      {selectedRegion && (
        <DeviceTable
          table={table}
          isLoading={isLoading}
          error={error}
          totalItems={totalDevices}
          onSelectionChange={onSelectionChange}
        />
      )}
    </div>
  );
}
