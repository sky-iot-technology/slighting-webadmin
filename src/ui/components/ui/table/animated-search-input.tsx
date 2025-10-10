import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function AnimatedSearchInput({ column, columnMeta }: any) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState((column.getFilterValue() as string) ?? '');

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      column.setFilterValue(value);
      setExpanded(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    setValue((column.getFilterValue() as string) ?? '');
  }, [column.getFilterValue()]);

  return (
    <div
      className={cn(
        'border-input bg-background flex h-8 items-center overflow-hidden rounded-md border transition-all duration-300 ease-in-out',
        expanded ? 'w-[124px] pl-2 lg:w-[164px]' : 'w-9 justify-center'
      )}
    >
      <div
        className={cn(
          'flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out',
          expanded ? 'translate-x-0' : 'translate-x-0'
        )}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Image
          src={'/assets/icons/search.svg'}
          alt='search'
          width={11}
          height={11}
          className='text-muted-foreground'
        />
      </div>

      <input
        ref={inputRef}
        type='text'
        placeholder={columnMeta.placeholder ?? columnMeta.label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleSubmit}
        className={cn(
          'bg-transparent text-sm transition-all duration-300 ease-in-out outline-none',
          expanded ? 'ml-2 w-full flex-1 opacity-100' : 'w-0 opacity-0'
        )}
      />
    </div>
  );
}
