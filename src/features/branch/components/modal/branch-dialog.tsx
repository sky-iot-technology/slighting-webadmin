'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import BranchForm from '../branch-form';
import { Group, useGetGroup } from '@/core/domains/groups';
import { branchFormSchema } from '@/core/domains/groups/schemas';
import BranchMoveForm from '../branch-move-form';

type BranchDialogProps = {
  groupId?: string | null;
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<Group> | null;
  move?: boolean;
};

export default function BranchDialog({
  groupId,
  pageTitle,
  open,
  onOpenChange,
  initialData,
  move
}: BranchDialogProps) {
  const [formData, setFormData] = useState<z.infer<
    typeof branchFormSchema
  > | null>(null);

  const isEditMode = !!groupId;

  const { data: groupData, isLoading } = useGetGroup(groupId ?? '', {
    enabled: !!groupId
  });

  const initialFormData = useMemo(() => {
    if (isEditMode && groupData) {
      return groupData;
    }

    if (!isEditMode && initialData) {
      return {
        ...initialData
      };
    }

    return null;
  }, [isEditMode, groupData, initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='bg-card w-[417px] rounded-xl p-0'
        hideCloseButton
      >
        {move ? (
          <BranchMoveForm
            initialData={initialFormData as Partial<Group>}
            pageTitle={pageTitle}
            onClose={() => onOpenChange && onOpenChange(false)}
          />
        ) : (
          <BranchForm
            initialData={initialFormData}
            formData={formData}
            pageTitle={pageTitle}
            onClose={() => onOpenChange && onOpenChange(false)}
            isEditMode={isEditMode}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
