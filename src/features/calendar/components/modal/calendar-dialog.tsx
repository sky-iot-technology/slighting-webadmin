'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/ui/components/ui/dialog';
import CalendarForm from '../calendar-form';
import {
  Calendar,
  calendarFormSchema,
  useCreateCalendars,
  useGetCalendarById,
  useUpdateCalendar
} from '@/core/domains/calendars';
import { useEffect, useMemo, useState } from 'react';
import CalendarConfirm from './calendar-confirm-dialog';
import { z } from 'zod';
import {
  mapCalendarToFormData,
  mapFormToCreateCalendarDto
} from '../../helper';

type CalendarDialogProps = {
  calendarId?: string | null;
  pageTitle: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Partial<Calendar> | null;
};

export default function CalendarDialog({
  calendarId,
  pageTitle,
  open,
  onOpenChange,
  initialData
}: CalendarDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<z.infer<
    typeof calendarFormSchema
  > | null>(null);

  const handleNext = (data: z.infer<typeof calendarFormSchema>) => {
    setFormData(data);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setFormData(null);
      }, 200);
    }
  }, [open]);

  const createCalendar = useCreateCalendars({
    onSuccess: () => {
      onOpenChange?.(false);
      setStep(1);
      setFormData(null);
    }
  });

  const updateCalendar = useUpdateCalendar({
    onSuccess: () => {
      onOpenChange?.(false);
      setStep(1);
      setFormData(null);
    }
  });

  const { data: calendarData, isLoading } = useGetCalendarById(
    calendarId ?? '',
    {
      enabled: !!calendarId
    }
  );

  const isEditMode = !!calendarId;

  const initialFormData = useMemo(() => {
    if (isEditMode && calendarData) {
      return calendarData;
    }

    if (!isEditMode && initialData) {
      return {
        ...initialData
      };
    }

    return null;
  }, [isEditMode, calendarData, initialData]);
  if (isLoading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className='hidden'>{pageTitle}</DialogTitle>
      <DialogDescription className='hidden'>{pageTitle}</DialogDescription>
      <DialogContent
        className='flex max-h-[90vh] w-[417px] flex-col overflow-hidden rounded-xl p-0'
        hideCloseButton
      >
        <div className='flex min-h-0 flex-1 flex-col'>
          {step === 1 && (
            <CalendarForm
              initialData={initialFormData as Calendar}
              formData={formData}
              pageTitle={pageTitle}
              onNext={handleNext}
              onClose={() => onOpenChange && onOpenChange(false)}
              isEditMode={isEditMode}
            />
          )}
          {step === 2 && formData && (
            <CalendarConfirm
              data={formData}
              onBack={handleBack}
              onConfirm={() => {
                const dto = mapFormToCreateCalendarDto(formData);
                if (isEditMode && calendarId) {
                  updateCalendar.mutate({ id: calendarId, data: dto });
                } else {
                  createCalendar.mutate(dto);
                }
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
