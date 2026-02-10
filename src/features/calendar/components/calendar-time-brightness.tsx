/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/ui/components/ui/button';
import { Slider } from '@/ui/components/ui/slider';
import { Trash2, X } from 'lucide-react';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import React from 'react';
import { CustomTimePicker } from '@/ui/components/ui/custom-time-picker';
import { SubSchedule } from '@/core/domains/calendars';
import { Switch } from '@/ui/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import { COMMAND_TO_TRAIT, TraitKey } from '@/core/domains/catalogues';
import { useCatalogueStore } from '@/core/domains/catalogues/store';
import { getTraitUiMap } from '@/ui/business/trait/trait';
import { useTranslation } from '@/core/domains/language/useTranslation';

type ScheduleAction = {
  trait: TraitKey;
  value: unknown;
};

type ScheduleItem = {
  time: string;
  action?: ScheduleAction;
};

type FormValues = {
  schedules: ScheduleItem[];
};

type TimeBrightnessFormProps = {
  deviceTraits: TraitKey[];
  schedules?: SubSchedule[];
  disabled?: boolean;
};

export function TimeBrightnessForm({
  deviceTraits,
  schedules = [],
  disabled = false
}: TimeBrightnessFormProps) {
  const { t } = useTranslation();
  const TRAIT_UI_MAP = getTraitUiMap(t);

  if (disabled && schedules)
    return <TimeBrightnessView schedules={schedules} />;

  const form = useFormContext<FormValues>();
  const errors = form.formState.errors;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedules'
  });
  const count = form.watch('schedules')?.length ?? 0;

  if (!deviceTraits.length && !disabled) {
    return (
      <div className='text-muted-foreground text-xs italic'>
        {t('calendar.device_not_support_schedule')}
      </div>
    );
  }

  return (
    <div className='space-y-3 text-xs'>
      <div className='grid grid-cols-[105px_1fr_30px] items-center gap-x-2 gap-y-1 md:grid-cols-[105px_1fr_62px] [&_label]:pb-1 [&_label]:font-semibold'>
        <label className='border-r-1'>{t('calendar.time')}</label>
        <label>{t('calendar.action')}</label>
      </div>

      <div className='grid grid-cols-[105px_1fr_30px] items-center gap-x-2 gap-y-1 md:grid-cols-[105px_1fr_62px]'>
        {fields.map((field, index) => {
          const actionType = form.watch(`schedules.${index}.action.trait`);
          return (
            <React.Fragment key={field.id}>
              {/* TimePicker */}
              <Controller
                //   control={form.control}
                name={`schedules.${index}.time`}
                render={({ field }) => (
                  <CustomTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className='flex items-center justify-between'>
                {!actionType && (
                  <Controller
                    name={`schedules.${index}.action.trait`}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ''}
                        onValueChange={(trait: TraitKey) => {
                          field.onChange(trait);

                          form.setValue(
                            `schedules.${index}.action.value`,
                            TRAIT_UI_MAP[trait].defaultValue,
                            { shouldDirty: true }
                          );
                        }}
                      >
                        <SelectTrigger className='!h-[24px] w-full rounded-[4px] text-xs'>
                          <SelectValue
                            placeholder={t('calendar.select_action_type')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceTraits.map((t) => (
                            <SelectItem key={t} value={t} className='!text-xs'>
                              {TRAIT_UI_MAP[t].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}

                {actionType && TRAIT_UI_MAP[actionType] && (
                  <Controller
                    control={form.control}
                    name={`schedules.${index}.action.value`}
                    render={({ field }) =>
                      TRAIT_UI_MAP[actionType].render({
                        value: field.value,
                        onChange: field.onChange,
                        disabled
                      })
                    }
                  />
                )}

                {!disabled && actionType && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      form.setValue(`schedules.${index}.action`, undefined)
                    }
                    className='text-destructive hover:text-destructive/80 h-5 w-5'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                )}
              </div>

              {/* Delete */}
              {!disabled && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => remove(index)}
                  className='text-destructive hover:text-destructive/80 mx-auto h-[20px] w-[20px] cursor-pointer'
                >
                  <Trash2 className='h-2 w-2' />
                </Button>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Add new row */}
      {!disabled && count < 5 && (
        <Button
          type='button'
          variant='link'
          className='h-auto p-0 text-xs text-blue-500'
          disabled={count >= 5}
          onClick={() => {
            if (count >= 5) return;
            append({ time: '', action: undefined });
          }}
        >
          + {t('calendar.add_time')}
        </Button>
      )}
    </div>
  );
}

function TimeBrightnessView({ schedules = [] }: { schedules?: SubSchedule[] }) {
  const { t } = useTranslation();
  const TRAIT_UI_MAP = getTraitUiMap(t);
  return (
    <div className='space-y-3 text-xs'>
      <div className='grid grid-cols-[105px_1fr] gap-x-2 gap-y-1 font-semibold'>
        <label className='border-r pb-1 text-[11px]'>
          {t('calendar.time')}
        </label>
        <label className='pb-1 pl-1.5 text-[11px]'>
          {t('calendar.action')}
        </label>

        {schedules.map((s, idx) => {
          const command = s.payload?.command;
          const params = s.payload?.params ?? {};

          const trait = command ? COMMAND_TO_TRAIT[command] : undefined;

          if (!trait || !TRAIT_UI_MAP[trait]) {
            return (
              <React.Fragment key={idx}>
                <CustomTimePicker value={s.time} disabled />
                <span className='text-muted-foreground mt-1'>
                  {t('calendar.not_supported')}
                </span>
              </React.Fragment>
            );
          }

          // map params → value theo trait
          let value: unknown;
          switch (trait) {
            case 'lms.devices.traits.OnOff':
              value = Boolean(params.on);
              break;

            case 'lms.devices.traits.Brightness':
              value = Number(params.brightness ?? 0);
              break;

            default:
              value = undefined;
          }

          return (
            <React.Fragment key={idx}>
              <div className='flex items-center justify-center font-medium'>
                <CustomTimePicker value={s.time} disabled />
              </div>

              {TRAIT_UI_MAP[trait].render({
                value,
                onChange: () => {},
                disabled: true
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
