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
import { PermissionGuard } from '@/core/domains/permissions';

import { useTranslation } from '@/core/domains/language/useTranslation';

interface CellActionProps {
  data: OtaData;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ data, disabled }) => {
  const { t } = useTranslation();
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

      <SyncDeviceDialog
        data={data}
        open={openSync}
        onOpenChange={setOpenSync}
      />

      <OtaDialog
        pageTitle={t('ota.title.edit' as any)}
        open={openEdit}
        onOpenChange={setOpenEdit}
        id={data.id}
      />

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
          <PermissionGuard module='ota' action='update'>
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
              <span>{t('ota.action.edit' as any)}</span>
            </DropdownMenuItem>
          </PermissionGuard>

          <PermissionGuard module='ota' action='delete'>
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
                {t('ota.action.delete' as any)}
              </span>
            </DropdownMenuItem>
          </PermissionGuard>

          <PermissionGuard module='ota' action='sync'>
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
              <span>{t('ota.action.sync' as any)}</span>
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
