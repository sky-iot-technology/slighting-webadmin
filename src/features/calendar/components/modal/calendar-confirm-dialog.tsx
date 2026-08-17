'use client';
import { Button } from '@/ui/components/ui/button';
import { z } from 'zod';
import { dayofweek } from '@/core/domains/calendars/constant';
import { DateRange } from 'react-day-picker';
import { calendarFormSchema } from '@/core/domains/calendars';
import { CalendarRangePicker } from '../calendar-range-picker';
import { getTraitUiMap } from '@/ui/business/trait/trait';
import { DeviceAlias, TRAIT_LABELS } from '@/core/domains/catalogues';
import { Switch } from '@/ui/components/ui/switch';
import { Slider } from '@/ui/components/ui/slider';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { LanguageKey } from '@/core/i18n/locales';

type Props = {
  data: z.infer<typeof calendarFormSchema>;
  onBack: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function CalendarConfirm({
  data,
  onBack,
  onConfirm,
  loading
}: Props) {
  const { catalogues } = useCatalogueStore();
  const { t } = useTranslation();

  const selectedDevice = catalogues.find((d) => d.type === data.device_type);

  const nameLine =
    selectedDevice?.attributes.device_aliases
      ?.filter((a) => data.ids.includes(a.alias))
      .map((a) => a.name) ?? [];
  return (
    <div className='bg-card space-y-3.5 p-5.5 text-xs font-bold'>
      <h3 className='text-primary-text text-left text-base font-bold'>
        {t('calendar.confirm_calendar')}
      </h3>

      <div className='flex gap-2'>
        <span className=''>{t('calendar.calendar_name')}:</span>
        <span className='text-right font-medium'>{data.name}</span>
      </div>

      <div className='flex gap-2'>
        <span className=''>{t('calendar.device_branch')}:</span>
        <span className='text-right font-medium'>
          {nameLine.filter(Boolean).join(', ')}
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

      <div className='flex gap-2'>
        <span className=''>{t('calendar.repeat')}:</span>
        <span className='text-right font-medium'>
          {t(`calendar.repeat_options.${data.recurring}` as any)}
        </span>
      </div>

      <div className='flex items-center gap-5.5'>
        <span className=''>{t('calendar.apply_date')}:</span>
        <CalendarRangePicker
          mode={data.date.from && data.date.to ? 'range' : 'single'}
          value={
            data.date.from
              ? (data.date as DateRange)
              : { from: new Date(), to: undefined }
          }
          disabled
        />
      </div>

      {data.weekly && data.weekly.length > 0 && (
        <div className=''>
          <span>{t('calendar.day_of_week')}:</span>
          <div className='flex flex-wrap gap-1 pt-1'>
            {data.weekly.map((value) => {
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

      {data.monthly && data.monthly.length > 0 && (
        <div className=''>
          <span>{t('calendar.day_of_month')}:</span>
          <div className='flex flex-wrap gap-1 pt-1'>
            {data.monthly.map((value) => {
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

      <div className='flex flex-col gap-2'>
        <span className=''>{t('calendar.time_and_action')}:</span>
        {data.schedules?.map((item, index) => (
          <div key={index} className='flex gap-8 font-medium'>
            <span>{index + 1}</span>
            <span>{item.time}</span>
            {renderAction(item, t, getTraitUiMap(t))}
          </div>
        ))}
      </div>

      <div className='flex justify-between gap-2 pt-3'>
        <Button variant='outline' onClick={onBack}>
          {t('calendar.back')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className='bg-primary text-white'
        >
          {t('calendar.confirm')}
        </Button>
      </div>
    </div>
  );
}

function renderAction(
  item: Props['data']['schedules'][number],
  t: (key: LanguageKey) => string,
  traitUiMap: any
) {
  const action = item.action;
  if (!action)
    return (
      <span className='text-muted-foreground'>
        {t('calendar.not_selected')}
      </span>
    );

  const { trait, value } = action;

  if (!trait) {
    return (
      <span className='text-muted-foreground'>
        {t('calendar.not_selected')}
      </span>
    );
  }

  if (trait === 'lms.devices.traits.Brightness') {
    const v = typeof value === 'number' ? value : Number(value ?? 0);
    return (
      <span className='flex gap-2'>
        <Slider
          value={[v]}
          className='dark:[&_[data-slot=slider-thumb]]:!bg-map-range-slider-active dark:[&_[data-slot=slider-thumb]]:border-map-range-slider-active [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active w-[120px] cursor-pointer self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
        />
        {v}%{/* {TRAIT_LABELS[trait] ?? trait}: {v}% */}
      </span>
    );
  }

  if (trait === 'lms.devices.traits.OnOff') {
    const v = Boolean(value);
    return (
      <span>
        <Switch
          checked={v}
          className='dark:data-[state=unchecked]:!bg-gray-3 data-[state=checked]:bg-green-500'
          thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black'
        />
        {/* {TRAIT_LABELS[trait] ?? trait}: {v ? 'Bật' : 'Tắt'} */}
      </span>
    );
  }

  // fallback cho trait mới
  return (
    <span>
      {traitUiMap[trait]?.label ?? trait}: {String(value)}
    </span>
  );
}
