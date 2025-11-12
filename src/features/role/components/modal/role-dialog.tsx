'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import RoleForm from '../form/role-form';

type RoleDialogProps = {
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function RoleDialog({
  pageTitle,
  open,
  onOpenChange
}: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='!w-[90vw] !max-w-[417px] rounded-xl p-0'
        hideCloseButton
      >
        <RoleForm
          pageTitle={pageTitle}
          onClose={() => onOpenChange && onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
