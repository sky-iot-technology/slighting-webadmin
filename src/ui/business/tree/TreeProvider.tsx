'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SelectedRegion } from '@/ui/components/tree-group';
import { cn } from '@/lib/utils';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { RegionTreeWrapper } from './RegionTreeWrapper';

type TreeProviderProps = {
  selectedRegion?: SelectedRegion;
  onRegionChange: (region: SelectedRegion) => void;
  className?: string;
  buttonClassName?: string;
  treeClassName?: string;
};

export function TreeProvider({
  selectedRegion,
  onRegionChange,
  className,
  buttonClassName,
  treeClassName
}: TreeProviderProps) {
  const [open, setOpen] = useState(false);
  const { treeData } = useRegionTreeStore();

  return (
    <div
      className={cn(
        className,
        'relative h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]'
      )}
    >
      {/* Trigger button */}
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          buttonClassName,
          'border-input bg-background flex h-full w-full items-center justify-between rounded-md border px-3 py-[2px] text-left focus:outline-none sm:py-[4px] md:py-[6px]'
        )}
      >
        <span
          className={
            selectedRegion?.name ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {selectedRegion?.name || 'Chọn khu vực'}
        </span>

        <Image
          src={
            open
              ? '/assets/icons/chevronRight.svg'
              : '/assets/icons/chevronDown.svg'
          }
          alt='toggle'
          width={12}
          height={12}
          className='h-3 w-3'
        />
      </button>
      <div
        className={cn(
          treeClassName,
          'bg-popover absolute z-10 mt-0.5 w-[160px] overflow-x-hidden overflow-y-auto rounded-md border sm:w-[180px] md:w-[217px]',
          open ? 'block opacity-100' : 'hidden opacity-0'
        )}
      >
        <RegionTreeWrapper
          data={treeData}
          onSelect={(item) => {
            onRegionChange(item);
            // setOpen(false);
          }}
          selectedId={selectedRegion?.id}
        />
      </div>
    </div>
  );
}
