'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import RoleForm from '../form/role-form';
import { useGetRoleById } from '@/core/domains/permissions';

type RoleDialogProps = {
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  roleId?: string;
  isViewOnly?: boolean;
};

export default function RoleDialog({
  pageTitle,
  open,
  onOpenChange,
  roleId,
  isViewOnly
}: RoleDialogProps) {
  const { data, isLoading } = useGetRoleById(roleId ?? '', {
    enabled: !!roleId
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='!h-[80vh] !w-[90vw] !max-w-[600px] overflow-hidden rounded-xl p-0'
        hideCloseButton
      >
        {!isLoading && (
          <RoleForm
            initialData={data}
            pageTitle={pageTitle}
            onClose={() => onOpenChange && onOpenChange(false)}
            isViewOnly={isViewOnly}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
