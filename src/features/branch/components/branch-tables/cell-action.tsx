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
import {} from '@/core/domains/calendars';
import { useDeleteDeviceParent } from '@/core/domains/devices';
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface CellActionProps {
  id: string;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ id, disabled }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteDeviceParent = useDeleteDeviceParent({
    onSuccess: () => {
      setOpen(false);
    }
  });
  const handleConfirmDelete = () => {
    if (!id) return;
    deleteDeviceParent.mutate(id);
  };

  const canDelete = useCan('device', 'update');
  const canView = useCan('device', 'view');

  const hasActions = canView || canDelete;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteDeviceParent.isPending}
      />

      <DropdownMenu modal={false} open={hasActions ? undefined : false}>
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
          className='flex flex-col gap-2 p-2 md:w-31.5'
        >
          {canView && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/product/info/${id}`)}
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
                <span>{t('branch.table.action.view')}</span>
              </DropdownMenuItem>
            </>
          )}

          {canDelete && (
            <>
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
                  {t('branch.table.action.delete')}
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
