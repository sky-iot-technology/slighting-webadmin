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
import WorkorderHistory from '../modal/workorder-history-dialog';

interface CellActionProps {
  id: string;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ id, disabled }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const router = useRouter();

  // const handleConfirmDelete = () => {
  //   if (!data) return;
  // };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteDeviceParent.isPending}
      /> */}
      {openHistory && (
        <WorkorderHistory
          open={openHistory}
          onOpenChange={setOpenHistory}
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
          className='flex w-30 flex-col gap-2 p-2'
        >
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/maintenance/${id}`)}
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
            <span>Chi tiết</span>
          </DropdownMenuItem>

          <DropdownMenuItem
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
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenHistory(true)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-2 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/history.svg'}
                alt='history'
                width={12}
                height={12}
              />
            </div>
            <span>Lịch sử</span>
          </DropdownMenuItem>

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
            <span className='text-destructive'>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
