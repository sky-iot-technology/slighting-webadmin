'use client';

import { useGetOta } from '@/core/domains/ota';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import OtaForm from '../form/ota-form';

type OtaDialogProps = {
  id?: string;
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function OtaDialog({
  id,
  pageTitle,
  open,
  onOpenChange
}: OtaDialogProps) {
  const { data, isLoading } = useGetOta(id, {
    enabled: !!id
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='bg-card !w-[90vw] !max-w-[500px] rounded-xl p-0'
        hideCloseButton
      >
        {!isLoading && (
          <OtaForm
            initialData={data ?? null}
            pageTitle={pageTitle}
            onClose={() => onOpenChange && onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
