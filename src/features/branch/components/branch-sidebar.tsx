'use client';
import { SelectedRegion } from '@/ui/components/tree-group';
import { Button } from '@/ui/components/ui/button';
import Image from 'next/image';
import { memo, useState } from 'react';
import BranchDialog from './modal/branch-dialog';
import TreeSidebar from '@/ui/business/tree/TreeSidebar';
import { IconPlus } from '@tabler/icons-react';

interface BranchSidebarProps {
  selectedRegion: SelectedRegion | null;
  onRegionChange: (region: SelectedRegion) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const BranchSidebar = memo(function BranchSidebar({
  selectedRegion,
  onRegionChange,
  isSidebarOpen,
  onToggleSidebar
}: BranchSidebarProps) {
  const [openNew, setOpenNew] = useState(false);
  return (
    <div className={`flex h-full flex-col pt-1.5 pr-[9px] pl-2`}>
      <div
        className={`mb-2 flex h-[31px] items-center gap-3.5 rounded-[6px] px-2 ${isSidebarOpen ? 'justify-end' : 'justify-start'}`}
      >
        {isSidebarOpen && (
          <Button className='h-7 text-xs' onClick={() => setOpenNew(!openNew)}>
            <IconPlus className='h-3 w-3' />
            Thêm chi nhánh
          </Button>
        )}
        <button
          onClick={onToggleSidebar}
          className='cursor-pointer rounded p-1 hover:bg-gray-100'
        >
          <Image
            src={
              isSidebarOpen
                ? '/assets/icons/chevronLeft.svg'
                : '/assets/icons/chevronRight.svg'
            }
            alt='toggle'
            width={5}
            height={9}
          />
        </button>
      </div>
      <TreeSidebar
        selectedRegion={selectedRegion}
        onRegionChange={onRegionChange}
      />

      <BranchDialog
        pageTitle='Thêm chi nhánh'
        open={openNew}
        onOpenChange={setOpenNew}
        groupId={null}
      />
    </div>
  );
});
