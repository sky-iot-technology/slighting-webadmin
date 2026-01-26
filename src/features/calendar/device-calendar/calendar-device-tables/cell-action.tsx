'use client';

import { AlertModal } from '@/ui/components/modal/alert-modal';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useDeleteCalendars } from '@/core/domains/calendars';
import CalendarDeviceDialog from '../modal/calendar-device-dialog';
import { CalendarDeviceViewDialog } from '../modal/calendar-device-view-dialog';
import { PermissionGuard } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface CellActionProps {
  id: string;
  name: string;
  disabled?: boolean;
  hideDelete?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({
  id,
  name,
  disabled,
  hideDelete
}) => {
  const { t, tTime } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const router = useRouter();

  const deleteCalendar = useDeleteCalendars({
    onSuccess: () => {
      setOpen(false);
    }
  });

  const handleConfirmDelete = () => {
    if (!id) return;
    deleteCalendar.mutate(id);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteCalendar.isPending}
        title={t('calendar.modal.delete.title' as any)}
        description={tTime('calendar.modal.delete.description' as any, {
          name: name
        })}
      />

      {/* ✏️ Edit */}
      {/* {openEdit && (
        <CalendarDeviceDialog
          pageTitle='Chỉnh sửa lịch'
          open={openEdit}
          onOpenChange={setOpenEdit}
          calendarId={id}
        />
      )} */}

      {/* View */}
      {openView && (
        <CalendarDeviceViewDialog
          open={openView}
          onOpenChange={setOpenView}
          id={id}
        />
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-full items-center p-0'
            disabled={disabled}
          >
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='bg-action flex w-31.5 flex-col gap-2 p-2'
        >
          <DropdownMenuItem
            onClick={() => setOpenView(true)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-2 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/view.svg'}
                alt='view'
                width={12}
                height={12}
              />
            </div>
            <span>{t('calendar.view_detail' as any)}</span>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-2 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/edit.svg'}
                alt='edit'
                width={12}
                height={12}
              />
            </div>
            <span>Sửa</span>
          </DropdownMenuItem> */}

          <PermissionGuard module='device' action='delete'>
            {!hideDelete && (
              <DropdownMenuItem
                variant='default'
                onClick={() => setOpen(true)}
                className='flex w-full items-center text-xs'
              >
                <div className='mx-2 flex w-4 justify-center'>
                  <Image
                    src={'/assets/icons/trash.svg'}
                    alt='trash'
                    width={12}
                    height={12}
                  />
                </div>
                <span className='text-destructive'>
                  {t('calendar.delete' as any)}
                </span>
              </DropdownMenuItem>
            )}
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
