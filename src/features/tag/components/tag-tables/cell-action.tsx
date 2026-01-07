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
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Device, useUpdateTagDevice } from '@/core/domains/devices';
import { SelectedTag } from '../tag-sidebar';
import { PermissionGuard } from '@/core/domains/permissions';

interface CellActionProps {
  data: Device;
  selectedTag: SelectedTag;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  selectedTag,
  disabled
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const updateDeviceTags = useUpdateTagDevice();

  const currentTags = data.tags ?? [];
  const tagAlias = selectedTag?.alias;

  const handleConfirmDelete = useCallback(() => {
    if (!data.id || !tagAlias) return;

    const newTags = currentTags.filter((tag) => tag !== tagAlias);

    updateDeviceTags.mutate(
      { deviceId: data.id, tags: newTags },
      {
        onSuccess: () => {
          setOpen(false);
        }
      }
    );
  }, [data.id, currentTags, tagAlias, selectedTag, updateDeviceTags]);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={updateDeviceTags.isPending}
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
          className='flex w-31.5 flex-col gap-2 p-2'
        >
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/product/info/${data.id}`)}
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
          <PermissionGuard module='device' action='update' fallback={null}>
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
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
