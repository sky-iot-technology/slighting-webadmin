import { Device } from '@/core/domains/devices';
import { Group, RegionNode } from '@/core/domains/groups';
import { BranchActionMenu } from '../modal/action';
import { findParentNode } from '@/features/calendar/helper';
import { parseIsoDate } from '../../helper';
import GoongMap from '@/ui/business/map/goong-map';

type BranchDetailTabProps = {
  selectedRegionId?: string;
  treeData: RegionNode[];
  group?: Group | null;
  devices: Device[];
  isLoading: boolean;
  isFetching: boolean;
  selectedDevice: {
    device: Device | null;
    ts: number;
  };
};

export function BranchDetailTab({
  selectedRegionId,
  treeData,
  group,
  devices,
  isLoading,
  isFetching,
  selectedDevice
}: BranchDetailTabProps) {
  const hasRegion = !!selectedRegionId;

  return (
    <div
      className={`grid w-full flex-1 grid-cols-[var(--sidebar-width,285px)_1fr] overflow-hidden rounded-[8px] transition-all duration-200 ease-in-out`}
      style={
        {
          '--sidebar-width': hasRegion ? '285px' : '0px'
        } as React.CSSProperties
      }
    >
      <div
        className={`h-full w-[285px] rounded-l-[4px] bg-white px-6 pt-3 pb-5 transition-all duration-300 ease-in-out ${hasRegion ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} `}
      >
        <div className='flex flex-col gap-5 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-bold'>Thông tin chi nhánh</span>
            <BranchActionMenu id={selectedRegionId ?? ''} />
          </div>

          <div className='flex gap-2'>
            <span>Chi nhánh:</span>
            <span className='font-bold'>
              {findParentNode(treeData, selectedRegionId ?? '')?.name ?? '—'}
            </span>
          </div>

          <div className='flex gap-2'>
            <span>Khu vực:</span>
            <span className='font-bold'>{group?.name ?? '—'}</span>
          </div>

          <div className='flex gap-2'>
            <span>Ghi chú:</span>
            <span className='font-bold'>{group?.description ?? '—'}</span>
          </div>

          <div className='flex gap-2'>
            <span>Thiết bị:</span>
            <span className='font-bold'>{devices.length} thiết bị</span>
          </div>

          <div className='flex gap-2'>
            <span>Ngày tạo:</span>
            <span className='font-bold'>
              {parseIsoDate(group?.created_at ?? '')}
            </span>
          </div>

          <div className='flex gap-2'>
            <span>Cập nhật cuối:</span>
            <span className='font-bold'>
              {parseIsoDate(group?.updated_at ?? '')}
            </span>
          </div>
        </div>
      </div>

      {/* Bản đồ */}
      <div className='relative h-full w-full min-w-0 overflow-hidden rounded-r-[4px]'>
        <GoongMap
          selectedRegion={{
            id: selectedRegionId ?? '',
            name: group?.name ?? ''
          }}
          devices={devices}
          isLoading={isLoading}
          isFetching={isFetching}
          selectedDevice={selectedDevice}
          renderPopup={() => null}
        />
      </div>
    </div>
  );
}
