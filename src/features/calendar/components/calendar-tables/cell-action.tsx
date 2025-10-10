'use client';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import CalendarDialog from '../calendar-dialog';
import { Calendar } from '@/core/domains/calendars';
import { CalendarViewDialog } from '../calendar-view-dialog';

interface CellActionProps {
  data: Calendar;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      {/* ✏️ Edit */}
      <CalendarDialog
        pageTitle='Chỉnh sửa lịch'
        open={openEdit}
        onOpenChange={setOpenEdit}
        initialData={data}
      />

      {/* View */}
      <CalendarViewDialog
        open={openView}
        onOpenChange={setOpenView}
        calendar={data}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='flex h-32 w-31.5 flex-col gap-2'
        >
          <DropdownMenuItem onClick={() => setOpenView(true)}>
            <Image
              src={'/assets/icons/view.svg'}
              alt='view'
              width={16}
              height={16}
            />{' '}
            Chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Image
              src={'/assets/icons/edit.svg'}
              alt='edit'
              width={16}
              height={16}
            />{' '}
            Sửa
          </DropdownMenuItem>
          <DropdownMenuItem variant='default' onClick={() => setOpen(true)}>
            <Image
              src={'/assets/icons/trash.svg'}
              alt='trash'
              width={16}
              height={16}
            />{' '}
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
