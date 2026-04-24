'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Button } from '@/ui/components/ui/button';
import { dayofweek } from '@/core/domains/calendars/constant';
import { useGetCalendarById } from '@/core/domains/calendars';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { SubCatalogueDevice, TraitKey } from '@/core/domains/catalogues';
import { useMemo } from 'react';
import { RegionNode } from '@/core/domains/groups';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { CalendarRangePicker } from '../calendar-range-picker';
import { TimeBrightnessForm } from '../calendar-time-brightness';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/domains/language/useTranslation';

type CalendarViewDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  id: string;
};

export function CalendarViewDialog({
  open,
  onOpenChange,
  id
}: CalendarViewDialogProps) {
  const { treeData } = useRegionTreeStore();
  const { catalogues } = useCatalogueStore();
  const { t } = useTranslation();

  const router = useRouter();
  const { data, isLoading } = useGetCalendarById(id ?? '', {
    enabled: !!id
  });

  const displayText = useMemo(() => {
    const groupIds = data?.group_ids ?? [];
    if (groupIds.length === 0) return '—';

    const findNodeName = (nodes: RegionNode[], id: string): string | null => {
      for (const node of nodes) {
        if (node.id === id) return node.name;
        if (node.children) {
          const found = findNodeName(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const names = groupIds
      .map((id: string) => findNodeName(treeData, id))
      .filter(Boolean) as string[];

    return names.length > 0 ? names.join(', ') : '—';
  }, [data?.group_ids, treeData]);

  if (!id || !data) return null;

  const allDeviceIds = data.schedules[0].ids;

  const monthly = data.schedules[0].recurring_period.day_of_month;
  const weekly = data.schedules[0].recurring_period.day_of_week;

  const selectedDevice = catalogues.find((d) => d.type === data.device_type);

  const nameLine = allDeviceIds.map((id) => {
    const attr = selectedDevice?.attributes[id];
    if (typeof attr === 'object' && attr !== null && 'name' in attr) {
      return (attr as SubCatalogueDevice).name;
    }
    return null;
  });

  return (
    <>
      {!isLoading && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className='bg-card w-[417px] rounded-xl p-5.5'
            hideCloseButton
          >
            <DialogHeader>
              <DialogTitle className='text-left text-[16px] font-bold'>
                {t('calendar.calendar_detail')}:
                <span className='text-primary ml-2 font-bold'>{data.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className='mt-2 space-y-3.5 text-xs font-bold'>
              <div className='flex gap-2'>
                <span className=''>{t('calendar.parent_branch')}:</span>
                <span className='text-right font-medium'>{displayText}</span>
              </div>

              <div className='flex gap-2'>
                <span className=''>{t('calendar.by_device_branch')}:</span>
                <span className='text-right font-medium'>
                  {nameLine.filter(Boolean).join(', ')}
                </span>
              </div>

              <div className='flex gap-2'>
                <span className=''>{t('calendar.repeat')}:</span>
                <span className='text-right font-medium'>
                  {t(
                    `calendar.repeat_options.${data.schedules[0].recurring}` as any
                  )}
                </span>
              </div>

              <div className='flex gap-2'>
                <span className=''>{t('calendar.calendar_type')}:</span>
                <span className='text-right font-medium'>
                  {Number(data.priority) === 1
                    ? t('calendar.priority.emergency' as any)
                    : t('calendar.priority.normal' as any)}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <span className=''>{t('calendar.apply_date')}:</span>
                <CalendarRangePicker
                  mode='range'
                  value={{
                    from: new Date(
                      data.schedules[0].start_datetime.replace(/Z$/, '')
                    ),
                    to: new Date(
                      data.schedules[0].end_datetime.replace(/Z$/, '')
                    )
                  }}
                  disabled
                />
              </div>

              {weekly && weekly.length > 0 && (
                <div className=''>
                  <span>{t('calendar.day_of_week')}:</span>
                  <div className='flex flex-wrap gap-1 pt-1'>
                    {weekly.map((value: any) => {
                      const label = dayofweek[Number(value)];
                      return (
                        <span
                          key={value}
                          className='bg-muted rounded-[4px] px-2 py-1 text-xs'
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {monthly && monthly.length > 0 && (
                <div className=''>
                  <span>{t('calendar.day_of_month')}:</span>
                  <div className='flex flex-wrap gap-1 pt-1'>
                    {monthly.map((value: any) => {
                      return (
                        <span
                          key={value}
                          className='bg-muted rounded-[4px] px-2 py-1 text-xs'
                        >
                          {value}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className='flex flex-col gap-2.5'>
                <span className=''>{t('calendar.time_and_brightness')}:</span>
                <TimeBrightnessForm
                  deviceTraits={(selectedDevice?.traits ?? []) as TraitKey[]}
                  disabled
                  schedules={data.schedules}
                />
              </div>

              <div className='flex flex-col gap-2 pt-1'>
                <span className=''>
                  {t('calendar.control_device')} ({allDeviceIds.length}){' '}
                </span>
                <div className='flex flex-col gap-1'>
                  {allDeviceIds.map((name, i) => (
                    <div
                      key={i}
                      className='flex h-6 w-full items-center justify-between rounded-[4px] border px-2 text-[10px] font-normal'
                    >
                      <span className='truncate'>{name}</span>
                      <span className='text-center text-green-600'>Online</span>
                      {/* <span
                        className='cursor-pointer text-right text-blue-500 italic'
                        onClick={() =>
                          router.push(
                            `/dashboard/product/info/${data.client_id}`
                          )
                        }
                      >
                        {t('calendar.view_detail')}
                      </span> */}
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex h-[30px] items-center justify-end gap-1'>
                <Button
                  onClick={() => onOpenChange && onOpenChange(false)}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('calendar.close')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
