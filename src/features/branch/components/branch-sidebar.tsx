'use client';
import { SelectedRegion } from '@/ui/components/tree-group';
import { Button } from '@/ui/components/ui/button';
import { memo, useState } from 'react';
import BranchDialog from './modal/branch-dialog';
import TreeSidebar from '@/ui/business/tree/TreeSidebar';
import { IconPlus } from '@tabler/icons-react';

interface BranchSidebarProps {
  selectedRegion: SelectedRegion | null;
  onRegionChange: (region: SelectedRegion) => void;
}

export const BranchSidebar = memo(function BranchSidebar({
  selectedRegion,
  onRegionChange
}: BranchSidebarProps) {
  const [openNew, setOpenNew] = useState(false);
  return (
    <div className={`flex h-full flex-col pt-[9px] pr-[10px] pl-2`}>
      <div
        className={`mb-2 flex h-[31px] items-center justify-end rounded-[6px] px-1`}
      >
        <Button
          className='h-7.5 w-[121px] gap-1 text-xs'
          onClick={() => setOpenNew(!openNew)}
        >
          <IconPlus className='h-3 w-3' />
          Thêm chi nhánh
        </Button>
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
