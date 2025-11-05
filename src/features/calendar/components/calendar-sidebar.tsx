'use client';
import Image from 'next/image';
import { memo } from 'react';
import { SelectedRegion } from '@/ui/components/tree-group';
import TreeSidebar from '@/ui/business/tree/TreeSidebar';

interface CalendarSidebarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedRegion: SelectedRegion | null;
  onRegionChange: (region: SelectedRegion) => void;
}

export const CalendarSidebar = memo(function CalendarSidebar({
  searchTerm,
  setSearchTerm,
  selectedRegion,
  onRegionChange
}: CalendarSidebarProps) {
  return (
    <div className='flex h-full flex-col pt-1.5 pr-[9px] pl-2'>
      <div className='bg-background mb-2 flex h-[31px] items-center rounded-[6px] px-2'>
        <Image
          src={'/assets/icons/search.svg'}
          alt='search'
          width={11}
          height={11}
          className='text-muted-foreground mr-2 ml-1.5'
        />
        <input
          className='text-foreground placeholder:text-muted-foreground w-full flex-1 bg-transparent text-xs focus:outline-none'
          placeholder='Tìm kiếm chi nhánh...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TreeSidebar
        selectedRegion={selectedRegion}
        onRegionChange={onRegionChange}
        searchTerm={searchTerm}
      />
    </div>
  );
});
