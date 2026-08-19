'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { Button } from '@/ui/components/ui/button';
import {
  dayofweek,
  PRIORITY_LABELS,
  RECURRING_LABELS
} from '@/core/domains/calendars/constant';
import { useGetCalendarById } from '@/core/domains/calendars';
import { useMemo } from 'react';
import { RegionNode } from '@/core/domains/groups';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { CalendarRangePicker } from '../../components/calendar-range-picker';
import { TimeBrightnessForm } from '../../components/calendar-time-brightness';
import { useGetDeviceById } from '@/core/domains/devices';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { TraitKey } from '@/core/domains/catalogues';
import { useTranslation } from '@/core/domains/language/useTranslation';

type CalendarViewDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  id: string;
};

export function CalendarDeviceViewDialog({
  open,
  onOpenChange,
  id
}: CalendarViewDialogProps) {
  const { t } = useTranslation();
  const { treeData } = useRegionTreeStore();
  const { catalogues } = useCatalogueStore();

  const { data, isLoading } = useGetCalendarById(id ?? '', {
    enabled: !!id
  });

  if (!id || !data) return null;

  const allDeviceIds = data.schedules[0].ids;

  const monthly = data.schedules[0].recurring_period.day_of_month;
  const weekly = data.schedules[0].recurring_period.day_of_week;

  const selectedDevice = catalogues.find((d) => d.type === data.device_type);

  const nameLine = allDeviceIds.map((id) => {
    const attr = selectedDevice?.attributes[id];
    if (typeof attr === 'object' && attr !== null && 'name' in attr) {
      return (attr as { name: string }).name;
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
                {t('calendar.calendar_detail' as any)}:
                <span className='text-primary ml-2 font-bold'>{data.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className='mt-2 space-y-3.5 text-xs font-bold'>
              <div className='flex gap-2'>
                <span className=''>
                  {t('calendar.device_branch_label' as any)}:
                </span>
                <span className='text-right font-medium'>
                  {nameLine.filter(Boolean).join(', ')}
                </span>
              </div>

              <div className='flex gap-2'>
                <span className=''>{t('calendar.repeat' as any)}:</span>
                <span className='text-right font-medium'>
                  {t(
                    `calendar.repeat_options.${data.schedules[0].recurring}` as any
                  )}
                </span>
              </div>

              <div className='flex gap-2'>
                <span className=''>{t('calendar.calendar_type' as any)}:</span>
                <span className='text-right font-medium'>
                  {Number(data.priority) === 1
                    ? t('calendar.priority.emergency' as any)
                    : t('calendar.priority.normal' as any)}
                </span>
              </div>

              <div className='flex items-center gap-2'>
                <span className=''>{t('calendar.apply_date' as any)}:</span>
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
                  <span>{t('calendar.days_of_week' as any)}:</span>
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
                  <span>{t('calendar.days_of_month' as any)}:</span>
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
                <span className=''>
                  {t('calendar.time_and_brightness' as any)}:
                </span>
                <TimeBrightnessForm
                  deviceTraits={(selectedDevice?.traits ?? []) as TraitKey[]}
                  disabled
                  schedules={data.schedules}
                />
              </div>

              <div className='flex h-[30px] items-center justify-end gap-1'>
                <Button
                  onClick={() => onOpenChange && onOpenChange(false)}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('calendar.close' as any)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
