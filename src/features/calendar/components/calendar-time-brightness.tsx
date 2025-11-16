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

type BrightnessItem = {
  time: string;
  brightness?: number;
  onOff?: boolean;
  actionType?: 'brightness' | 'onOff' | null;
};

type FormValues = {
  schedules: BrightnessItem[];
};

type TimeBrightnessFormProps = {
  schedules?: SubSchedule[];
  disabled?: boolean;
};

export function TimeBrightnessForm({
  schedules = [],
  disabled
}: TimeBrightnessFormProps) {
  if (disabled && schedules)
    return <TimeBrightnessView schedules={schedules} />;

  const form = useFormContext<FormValues>();
  const errors = form.formState.errors;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedules'
  });
  const count = form.watch('schedules')?.length ?? 0;

  return (
    <div className='space-y-3 text-xs'>
      <div className='grid grid-cols-[105px_1fr_62px] items-center gap-x-2 gap-y-1 [&_label]:pb-1 [&_label]:font-semibold'>
        <label className='border-r-1'>Thời gian</label>
        <label>Hành động</label>
        {/* <label className='text-center'>Thao tác</label> */}
      </div>

      <div className='grid grid-cols-[105px_1fr_62px] items-center gap-x-2 gap-y-1'>
        {fields.map((field, index) => {
          const actionType = form.watch(`schedules.${index}.actionType`);
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
                    control={form.control}
                    name={`schedules.${index}.actionType`}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ''}
                        onValueChange={(v) => field.onChange(v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className='!h-[24px] w-full rounded-[4px] text-xs'>
                          <SelectValue placeholder='Chọn loại hành động' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='brightness'>Độ sáng</SelectItem>
                          <SelectItem value='onOff'>Bật / Tắt</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}

                {actionType === 'brightness' && (
                  <div className='flex items-center gap-2'>
                    {/* Slider brightness */}
                    <Controller
                      //   control={form.control}
                      name={`schedules.${index}.brightness`}
                      render={({ field }) => {
                        const [tempValue, setTempValue] = React.useState(
                          field.value ?? 0
                        );

                        return (
                          <div className='flex items-center justify-start'>
                            <Slider
                              value={[tempValue]}
                              onValueChange={(v) => setTempValue(v[0])}
                              onValueCommit={(v) => {
                                const committed = v[0];
                                setTempValue(committed);
                                field.onChange(committed);
                              }}
                              max={100}
                              step={1}
                              className='[&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active w-[120px] cursor-pointer self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
                            />
                            <span className='ml-1'>
                              {tempValue.toFixed(0)}%
                            </span>
                          </div>
                        );
                      }}
                    />
                    {!disabled && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() =>
                          form.setValue(`schedules.${index}.actionType`, null)
                        }
                        className='text-destructive hover:text-destructive/80 h-5 w-5'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                )}

                {actionType === 'onOff' && (
                  <div className='flex items-center gap-2'>
                    <Controller
                      control={form.control}
                      name={`schedules.${index}.onOff`}
                      render={({ field }) => (
                        <div className='flex items-center gap-2'>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                            className='data-[state=checked]:bg-green-500'
                          />
                          <span
                            className={`pt-0.5 text-[11px] font-medium ${
                              field.value ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            {field.value ? 'Bật' : 'Tắt'}
                          </span>
                        </div>
                      )}
                    />
                    {!disabled && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() =>
                          form.setValue(`schedules.${index}.actionType`, null)
                        }
                        className='text-destructive hover:text-destructive/80 h-5 w-5'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
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
              {errors.schedules?.[index]?.time?.message && (
                <div className='col-span-3'>
                  <p className='mt-0.5 text-xs text-red-500'>
                    {errors.schedules[index].time?.message}
                  </p>
                </div>
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
            append({ time: '', brightness: 0 });
          }}
        >
          + Thêm thời gian
        </Button>
      )}
    </div>
  );
}

function TimeBrightnessView({ schedules = [] }: { schedules?: SubSchedule[] }) {
  return (
    <div className='space-y-3 text-xs'>
      <div className='grid grid-cols-[105px_1fr] items-center gap-x-2 gap-y-1 [&_label]:font-semibold'>
        <label className='border-border border-r pb-1 text-[11px]'>
          Thời gian
        </label>
        <label className='pb-1 pl-1.5 text-[11px]'>Hành động</label>

        {schedules.map((s, idx) => {
          const command = s.payload?.command ?? '';
          const params = s.payload?.params ?? {};
          const isBrightness = command.includes('Brightness');
          const isOnOff = command.includes('OnOff');
          return (
            <React.Fragment key={idx}>
              <div className='flex items-center justify-center font-medium'>
                <CustomTimePicker value={s.time} disabled />
              </div>
              {isBrightness && (
                <div className='flex items-center justify-start gap-1 pl-1.5'>
                  <Slider
                    value={[params.brightness ?? 0]}
                    className='[&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active w-[210px] self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
                  />
                  <span>{[params.brightness ?? 0]}%</span>
                </div>
              )}
              {isOnOff && (
                <div className='flex items-center justify-start gap-1 pl-1.5'>
                  <Switch
                    checked={!!params.on}
                    className='data-[state=checked]:bg-green-500'
                  />
                  <span className='pt-0.5'>{params.on ? 'Bật' : 'Tắt'}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
