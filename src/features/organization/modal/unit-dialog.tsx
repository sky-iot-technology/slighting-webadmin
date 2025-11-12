'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import UnitForm from '../form/unit-form';

type UnitDialogProps = {
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function UnitDialog({
  pageTitle,
  open,
  onOpenChange
}: UnitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='!w-[90vw] !max-w-[417px] rounded-xl p-0'
        hideCloseButton
      >
        <UnitForm
          pageTitle={pageTitle}
          onClose={() => onOpenChange && onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
