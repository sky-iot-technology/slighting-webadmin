'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import MaintenanceForm from '../form/maintenance-form';

type MaintenanceDialogProps = {
  alarmId: string;
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function MaintenanceDialog({
  alarmId,
  pageTitle,
  open,
  onOpenChange
}: MaintenanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='bg-card !w-[90vw] !max-w-[649px] rounded-xl p-0'
        hideCloseButton
      >
        <MaintenanceForm
          alarmId={alarmId}
          pageTitle={pageTitle}
          onClose={() => onOpenChange && onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
