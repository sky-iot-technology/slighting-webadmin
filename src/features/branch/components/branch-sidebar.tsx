'use client';
import { SelectedRegion } from '@/ui/components/tree-group';
import { Button } from '@/ui/components/ui/button';
import { memo, useState } from 'react';
import BranchDialog from './modal/branch-dialog';
import TreeSidebar from '@/ui/business/tree/TreeSidebar';
import { IconPlus } from '@tabler/icons-react';
import { PermissionGuard } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface BranchSidebarProps {
  selectedRegion: SelectedRegion | null;
  onRegionChange: (region: SelectedRegion) => void;
}

export const BranchSidebar = memo(function BranchSidebar({
  selectedRegion,
  onRegionChange
}: BranchSidebarProps) {
  const { t } = useTranslation();
  const [openNew, setOpenNew] = useState(false);
  return (
    <div className={`mt-1.5 flex h-full flex-col pt-[9px] pr-[10px] pl-2`}>
      <PermissionGuard module='branch' action='create' fallback={null}>
        <div
          className={`mb-2 flex h-[31px] items-center justify-end rounded-[6px] px-1`}
        >
          <Button
            className='h-7.5 w-[121px] gap-1 text-xs'
            onClick={() => setOpenNew(!openNew)}
          >
            <IconPlus className='!h-4 !w-4' />
            {t('branch.add_branch')}
          </Button>
        </div>
      </PermissionGuard>

      <TreeSidebar
        selectedRegion={selectedRegion}
        onRegionChange={onRegionChange}
      />

      <BranchDialog
        pageTitle={t('branch.add_branch')}
        open={openNew}
        onOpenChange={setOpenNew}
        groupId={null}
      />
    </div>
  );
});
