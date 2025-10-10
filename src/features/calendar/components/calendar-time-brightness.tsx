'use client';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/ui/components/ui/button';
import { Slider } from '@/ui/components/ui/slider';
import { Clock, Trash2 } from 'lucide-react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import React, { useEffect, useState } from 'react';
import { CustomTimePicker } from '@/ui/components/ui/custom-time-picker';
import CustomScrollbar from '@/ui/components/custom-scrollbar';

type BrightnessItem = {
  time: string;
  brightness: number;
};

type FormValues = {
  schedules: BrightnessItem[];
};

type TimeBrightnessFormProps = {
  disabled?: boolean;
};

export function TimeBrightnessForm({ disabled }: TimeBrightnessFormProps) {
  if (disabled) return <TimeBrightnessView />;

  const form = useFormContext<FormValues>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedules'
  });

  const count = form.watch('schedules')?.length ?? 0;

  return (
    <div className='space-y-3 text-xs'>
      <div className='grid grid-cols-[105px_1fr_62px] items-center gap-x-2 gap-y-1 [&_label]:pb-1 [&_label]:font-semibold'>
        <label className='border-r-1'>Thời gian</label>
        <label className='border-r-1'>Độ sáng</label>
        <label className='text-center'>Thao tác</label>
      </div>

      <CustomScrollbar className='max-h-[80px] overflow-y-auto'>
        <div className='grid grid-cols-[105px_1fr_62px] items-center gap-x-2 gap-y-1'>
          {fields.map((field, index) => (
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

              {/* Slider brightness */}
              <Controller
                //   control={form.control}
                name={`schedules.${index}.brightness`}
                render={({ field }) => (
                  <div className='flex items-center justify-between'>
                    <Slider
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                      max={100}
                      step={1}
                      className='[&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active w-[150px] cursor-pointer self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
                    />
                    <span>100%</span>
                  </div>
                )}
              />

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
          ))}
        </div>
      </CustomScrollbar>

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

function TimeBrightnessView() {
  const schedules: BrightnessItem[] = [
    { time: '08:00', brightness: 70 },
    { time: '18:30', brightness: 40 }
  ];

  return (
    <div className='space-y-3 text-xs'>
      <div className='grid grid-cols-[105px_1fr] items-center gap-x-2 gap-y-1 [&_label]:font-semibold'>
        <label className='border-border border-r pb-1 text-[11px]'>
          Thời gian
        </label>
        <label className='pb-1 pl-1.5 text-[11px]'>Độ sáng</label>

        {schedules.map((s, idx) => (
          <React.Fragment key={idx}>
            <div className='flex items-center justify-center font-medium'>
              <CustomTimePicker value={s.time} disabled />
            </div>

            <div className='flex items-center justify-between gap-1 pl-1.5'>
              <Slider
                value={[s.brightness]}
                className='[&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
              />
              <span>100%</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
