'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import TagForm from '../form/tag-form';

type TagDialogProps = {
  roleId?: string | null;
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function TagDialog({
  roleId,
  pageTitle,
  open,
  onOpenChange
}: TagDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent className='w-[417px] rounded-xl p-0' hideCloseButton>
        <TagForm
          pageTitle={pageTitle}
          onClose={() => onOpenChange && onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
