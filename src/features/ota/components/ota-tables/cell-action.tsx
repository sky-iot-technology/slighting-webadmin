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
import { useState } from 'react';
import Image from 'next/image';
import { OtaData, useDeleteOta } from '@/core/domains/ota';
import SyncDeviceDialog from '../modal/sync-dialog';
import OtaDialog from '../modal/ota-dialog';

interface CellActionProps {
  data: OtaData;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ data, disabled }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSync, setOpenSync] = useState(false);

  const { mutate: deleteOta, isPending } = useDeleteOta({
    onSuccess: () => {
      setOpen(false);
    }
  });

  const handleConfirmDelete = () => {
    if (!data.id) return;
    deleteOta(data.id);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />

      {openSync && (
        <SyncDeviceDialog
          data={data}
          open={openSync}
          onOpenChange={setOpenSync}
        />
      )}

      {openEdit && (
        <OtaDialog
          pageTitle='Chỉnh sửa Ota'
          open={openEdit}
          onOpenChange={setOpenEdit}
          id={data.id}
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

          <DropdownMenuItem
            className='flex w-full items-center text-xs'
            onClick={() => setOpenSync(true)}
          >
            <div className='mx-2 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/move.svg'}
                alt='sync'
                width={12}
                height={12}
              />
            </div>
            <span>Đồng bộ</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
