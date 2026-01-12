import { Device } from '@/core/domains/devices';
import { Group, RegionNode } from '@/core/domains/groups';
import { BranchActionMenu } from '../modal/action';
import { findParentNode } from '@/features/calendar/helper';
import { parseIsoDate } from '../../helper';
import GoongMap from '@/ui/business/map/goong-map';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/core/domains/language/useTranslation';

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
  const { t, tTime } = useTranslation();
  const hasRegion = !!selectedRegionId;

  return (
    <div className='relative flex h-[calc(100dvh-52px)] w-full flex-col overflow-hidden rounded-[8px] md:h-full md:flex-row'>
      <div
        className={cn(
          'bg-white px-6 pt-3 pb-5 transition-transform duration-300',
          'w-full md:w-[285px]',
          'relative',
          hasRegion
            ? 'translate-y-0 md:translate-x-0'
            : '-translate-y-full md:-translate-x-full'
        )}
      >
        <div className='flex flex-col gap-5 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='text-[16px] font-bold'>
              {t('branch.branch_info' as any)}
            </span>
            <BranchActionMenu id={selectedRegionId ?? ''} />
          </div>

          <div className='flex gap-2'>
            <span>{t('branch.branch_label' as any)}:</span>
            <span className='font-bold'>
              {findParentNode(treeData, selectedRegionId ?? '')?.name ?? '—'}
            </span>
          </div>

          <div className='flex gap-2'>
            <span>{t('branch.region' as any)}:</span>
            <span className='font-bold'>{group?.name ?? '—'}</span>
          </div>

          <div className='flex gap-2'>
            <span>{t('branch.note' as any)}:</span>
            <span className='font-bold'>{group?.description ?? '—'}</span>
          </div>

          <div className='flex gap-2'>
            <span>{t('branch.devices' as any)}:</span>
            <span className='font-bold'>
              {tTime('branch.device_count' as any, { count: devices.length })}
            </span>
          </div>

          <div className='flex gap-2'>
            <span>{t('branch.created_at' as any)}:</span>
            <span className='font-bold'>
              {parseIsoDate(group?.created_at ?? '')}
            </span>
          </div>

          <div className='flex gap-2'>
            <span>{t('branch.updated_at' as any)}:</span>
            <span className='font-bold'>
              {parseIsoDate(group?.updated_at ?? '')}
            </span>
          </div>
        </div>
      </div>

      {/* Bản đồ */}
      <div className='relative min-h-[300px] min-w-[1px] flex-1'>
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
