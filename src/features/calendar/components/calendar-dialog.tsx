'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import CalendarForm, { formSchema } from './calendar-form';
import { Calendar } from '@/core/domains/calendars';
import { useEffect, useState } from 'react';
import CalendarConfirm from './calendar-confirm-dialog';
import { z } from 'zod';

type CalendarDialogProps = {
  initialData: Calendar | null;
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CalendarDialog({
  initialData,
  pageTitle,
  open,
  onOpenChange
}: CalendarDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  // const [formData, setFormData] = useState<Calendar | null>(null);
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );

  const handleNext = (data: z.infer<typeof formSchema>) => {
    setFormData(data);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep(1), 200);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent className='w-[417px] rounded-xl p-5.5' hideCloseButton>
        {step === 1 && (
          <CalendarForm
            initialData={initialData}
            pageTitle={pageTitle}
            onNext={handleNext}
            onClose={() => onOpenChange && onOpenChange(false)}
          />
        )}
        {step === 2 && formData && (
          <CalendarConfirm
            data={formData}
            onBack={handleBack}
            onConfirm={() => {
              console.log(formData);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
