'use client';

import * as React from 'react';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/ui/button';
import { Calendar } from '@/ui/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/ui/components/ui/popover';
import { Input } from './input';

export interface DateInputProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  error?: boolean;
  errorMessage?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Select date',
      disabled = false,
      className,
      dateFormat = 'dd/MM/yyyy',
      error = false,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [isValidDate, setIsValidDate] = React.useState(true);

    // Update input value when value prop changes
    React.useEffect(() => {
      if (value) {
        setInputValue(format(value, dateFormat));
        setIsValidDate(true);
      } else {
        setInputValue('');
        setIsValidDate(true);
      }
    }, [value, dateFormat]);

    const formatInputValue = (value: string): string => {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');

      if (digitsOnly.length === 0) return '';

      // Auto-format based on dateFormat
      if (dateFormat === 'MM/dd/yyyy') {
        if (digitsOnly.length <= 2) return digitsOnly;
        if (digitsOnly.length <= 4)
          return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
        if (digitsOnly.length <= 8)
          return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
        return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
      } else if (dateFormat === 'dd/MM/yyyy') {
        if (digitsOnly.length <= 2) return digitsOnly;
        if (digitsOnly.length <= 4)
          return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
        if (digitsOnly.length <= 8)
          return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
        return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
      } else if (dateFormat === 'yyyy-MM-dd') {
        if (digitsOnly.length <= 4) return digitsOnly;
        if (digitsOnly.length <= 6)
          return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`;
        if (digitsOnly.length <= 8)
          return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6)}`;
        return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6, 8)}`;
      }

      // Default formatting for other formats
      return value;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;

      // Auto-format the input value
      const formattedValue = formatInputValue(inputVal);
      setInputValue(formattedValue);

      if (formattedValue === '') {
        setIsValidDate(true);
        onChange?.(undefined);
        return;
      }

      // Try to parse the formatted input as a date
      const parsedDate = parse(formattedValue, dateFormat, new Date());

      if (isValid(parsedDate)) {
        setIsValidDate(true);
        onChange?.(parsedDate);
      } else {
        setIsValidDate(false);
      }
    };

    const handleCalendarSelect = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setInputValue(format(selectedDate, dateFormat));
        setIsValidDate(true);
        onChange?.(selectedDate);
      }
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setOpen(false);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    return (
      <div className='relative'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'h-9 w-full justify-start border bg-transparent px-2 text-left text-lg font-normal outline-none md:text-sm',
                !value && 'text-muted-foreground',
                error && 'border-destructive focus-visible:ring-destructive/20',
                disabled && 'bg-muted cursor-not-allowed disabled:opacity-100',
                className
              )}
              disabled={disabled}
            >
              <input
                ref={ref}
                type='text'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  'flex-1 border-none text-left outline-0',
                  disabled && 'cursor-not-allowed',
                  'placeholder:text-muted-foreground'
                )}
                {...props}
              />
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50 dark:brightness-0 dark:invert' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={value}
              onSelect={handleCalendarSelect}
              disabled={(date) => date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Error message */}
        {error && errorMessage && (
          <p className='text-destructive mt-1 text-sm'>{errorMessage}</p>
        )}

        {/* Invalid date message */}
        {!isValidDate && inputValue && (
          <p className='text-destructive mt-1 text-sm'>
            Please enter a valid date in {dateFormat} format
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export { DateInput };
