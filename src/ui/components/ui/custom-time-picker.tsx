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

interface CustomTimePickerProps {
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

export const CustomTimePicker = React.memo(function CustomTimePicker({
  value,
  onChange,
  disabled
}: CustomTimePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>(
    'bottom'
  );
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0
  });

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
        );
        const minuteEl = minuteListRef.current?.querySelector(
          `[data-minute="${minute}"]`
        );

        hourEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        minuteEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside, true);
  }, []);

  useEffect(() => {
    if (open && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const dropdownHeight = 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
        setPosition({
          top: rect.top - dropdownHeight - 8,
          left: rect.left,
          width: rect.width
        });
      } else {
        setDropdownPosition('bottom');
        setPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width
        });
      }
    }
  }, [open]);

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

  useEffect(() => {
    if (open) {
      const hourEl = hourListRef.current?.querySelector(
        `[data-hour="${hour}"]`
      );
      const minuteEl = minuteListRef.current?.querySelector(
        `[data-minute="${minute}"]`
      );
      hourEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      minuteEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [hour, minute]);

  return (
    <div
      ref={pickerRef}
      className={`relative w-[104px] rounded-[4px] text-[11px]`}
    >
      <button
        type='button'
        disabled={disabled}
        className={`border-input flex w-full items-center justify-between rounded-[4px] border px-1 py-1 ${!disabled ? 'cursor-pointer' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        {value || t('calendar.time_select')}
        <Image
          src={'/assets/icons/time.svg'}
          alt='time'
          width={12}
          height={12}
        />
      </button>

      {/* Dropdown */}
      {!disabled && open && (
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            onWheelCapture={(e: React.WheelEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
            initial={{ opacity: 0, y: dropdownPosition === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownPosition === 'top' ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={`bg-card absolute left-0 z-[99] flex flex-col rounded-[4px] border border-gray-300 p-1 shadow-lg ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} `}
            style={{
              width: '100%'
            }}
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
          </motion.div>
        </AnimatePresence>
      )}

      {/* hidden react-time-picker */}
      <div className='hidden'>
        <TimePicker value={`${hour}:${minute}`} disableClock />
      </div>
    </div>
  );
});
