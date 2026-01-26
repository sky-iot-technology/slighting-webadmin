'use client';
import { Device, useDeleteDevice } from '@/core/domains/devices';
import { PermissionGuard } from '@/core/domains/permissions';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface CellActionProps {
  data: Device;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const deleteDevice = useDeleteDevice({
    onSuccess: () => {
      setOpen(false);
    }
  });

  const onConfirm = async () => {
    await deleteDevice.mutateAsync(data.id);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={deleteDevice.isPending}
        title={t('products.modal.delete.title' as any)}
        description={t('products.modal.delete.description' as any)}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center justify-center'>
            <Button variant='ghost' className='flex h-8 w-8'>
              <span className='sr-only'>Open menu</span>
              <IconDotsVertical className='h-4 w-4' />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='bg-action flex w-31.5 flex-col gap-2 p-2'
        >
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/product/info/${data.id}`)}
            className='flex w-full items-center text-xs'
          >
            <div className='mx-1 flex w-4 justify-center'>
              <Image
                src={'/assets/icons/view.svg'}
                alt='view'
                width={12}
                height={12}
              />
            </div>
            <span>{t('products.action.view' as any)}</span>
          </DropdownMenuItem>
          <PermissionGuard module='device' action='delete'>
            <DropdownMenuItem
              variant='default'
              onClick={() => setOpen(true)}
              className='flex w-full items-center text-xs'
            >
              <div className='mx-1 flex w-4 justify-center'>
                <Image
                  src={'/assets/icons/trash.svg'}
                  alt='trash'
                  width={12}
                  height={12}
                />
              </div>
              <span className='text-destructive'>
                {t('products.action.delete' as any)}
              </span>
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
