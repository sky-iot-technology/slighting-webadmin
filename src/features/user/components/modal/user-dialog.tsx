'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import UserForm from '../form/user-form';
import { useGetUserById } from '@/core/domains/users';

type UserDialogProps = {
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  userId?: string;
  isView?: boolean;
};

export default function UserDialog({
  pageTitle,
  open,
  onOpenChange,
  userId,
  isView
}: UserDialogProps) {
  const { data, isLoading } = useGetUserById(userId ?? '', {
    enabled: !!userId && open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='!w-[90vw] !max-w-[1001px] overflow-hidden rounded-xl p-0'
        hideCloseButton
      >
        {!isLoading && (
          <UserForm
            initialData={data}
            pageTitle={pageTitle}
            onClose={() => onOpenChange && onOpenChange(false)}
            isView={isView}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
