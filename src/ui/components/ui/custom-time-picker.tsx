import Image from 'next/image';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import TimePicker from 'react-time-picker';
import { motion, AnimatePresence } from 'motion/react';
import CustomScrollbar from '../custom-scrollbar';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface CustomTimePickerProps {
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  isInvalid?: boolean;
}

export const CustomTimePicker = React.memo(function CustomTimePicker({
  value,
  onChange,
  disabled,
  isInvalid,
  ...props
}: CustomTimePickerProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const hourListRef = useRef<HTMLDivElement | null>(null);
  const minuteListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      if (h && m) {
        setHour(h.padStart(2, '0'));
        setMinute(m.padStart(2, '0'));
      }
    }
  }, [value]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const hourEl = hourListRef.current?.querySelector(
          `[data-hour="${hour}"]`
        ) as HTMLElement;
        const minuteEl = minuteListRef.current?.querySelector(
          `[data-minute="${minute}"]`
        ) as HTMLElement;

        if (hourEl && hourListRef.current) {
          hourListRef.current.scrollTo({
            top:
              hourEl.offsetTop -
              hourListRef.current.clientHeight / 2 +
              hourEl.clientHeight / 2,
            behavior: 'smooth'
          });
        }
        if (minuteEl && minuteListRef.current) {
          minuteListRef.current.scrollTo({
            top:
              minuteEl.offsetTop -
              minuteListRef.current.clientHeight / 2 +
              minuteEl.clientHeight / 2,
            behavior: 'smooth'
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open, hour, minute]);

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    []
  );
  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    []
  );

  const handleApply = () => {
    const val = `${hour}:${minute}`;
    onChange?.(val);
    setOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    setHour(h);
    setMinute(m);
    onChange?.(`${h}:${m}`);
    setOpen(false);
  };

  return (
    <div
      ref={pickerRef}
      className={`relative w-[104px] rounded-[4px] text-[11px]`}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type='button'
            disabled={disabled}
            className={`border-input dark:bg-input/30 flex w-full items-center justify-between rounded-[4px] border px-1 py-1 ${!disabled ? 'cursor-pointer' : ''} ${isInvalid || props['aria-invalid'] ? 'border-destructive' : ''}`}
            {...props}
          >
            <span className={cn(!value && 'text-muted-foreground')}>
              {value || t('calendar.time_select')}
            </span>
            <Image
              src={'/assets/icons/time.svg'}
              alt='time'
              width={12}
              height={12}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align='start'
          sideOffset={4}
          className='bg-card z-[99] flex w-[114px] flex-col rounded-[4px] border border-gray-300 p-1 shadow-lg'
          onWheel={(e) => e.stopPropagation()}
        >
          <div className='flex w-full justify-center gap-1 pl-1'>
            {/* Hour list */}
            <CustomScrollbar
              className='max-h-48 w-[48px] overflow-y-auto text-center'
              ref={hourListRef}
            >
              {hours.map((h) => (
                <div
                  key={h}
                  data-hour={h}
                  onClick={() => setHour(h)}
                  className={`hover:bg-tree-hover cursor-pointer rounded px-1 py-1 text-xs ${
                    h === hour ? 'bg-calendar-time-hover font-semibold' : ''
                  }`}
                >
                  {h}
                </div>
              ))}
            </CustomScrollbar>

            {/* Minute list */}
            <CustomScrollbar
              ref={minuteListRef}
              className='max-h-48 w-[48px] overflow-y-auto text-center'
            >
              {minutes.map((m) => (
                <div
                  key={m}
                  data-minute={m}
                  onClick={() => setMinute(m)}
                  className={`hover:bg-tree-hover cursor-pointer rounded px-1 py-1 text-xs ${
                    m === minute ? 'bg-calendar-time-hover font-semibold' : ''
                  }`}
                >
                  {m}
                </div>
              ))}
            </CustomScrollbar>
          </div>

          {/* Footer */}
          <div className='my-1 flex items-center justify-between border-gray-600 px-2'>
            <button
              type='button'
              onClick={handleNow}
              className='text-xs text-blue-400 hover:underline'
            >
              Now
            </button>
            <button
              type='button'
              onClick={handleApply}
              className='rounded bg-emerald-500 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-600'
            >
              OK
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* hidden react-time-picker */}
      <div className='hidden'>
        <TimePicker value={`${hour}:${minute}`} disableClock />
      </div>
    </div>
  );
});
