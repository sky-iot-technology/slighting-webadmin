'use client';

import { useState } from 'react';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';
import Image from 'next/image';
import { useDeleteGroup } from '@/core/domains/groups';
import { AlertModal } from '@/ui/components/modal/alert-modal';
import BranchDialog from './branch-dialog';

interface BranchActionMenuProps {
  id: string;
  disabled?: boolean;
  onDeleted?: () => void;
}

export function BranchActionMenu({
  id,
  disabled,
  onDeleted
}: BranchActionMenuProps) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMove, setOpenMove] = useState(false);

  const deleteGroup = useDeleteGroup({
    onSuccess: () => {
      setOpenConfirm(false);
      onDeleted?.();
    }
  });

  const handleDelete = () => {
    if (!id) return;
    deleteGroup.mutate(id);
  };

  return (
    <>
      {/* Delete Confirm */}
      <AlertModal
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        loading={deleteGroup.isPending}
      />

      {/* Edit Modal */}
      {openEdit && (
        <BranchDialog
          pageTitle='Chỉnh sửa nhánh'
          open={openEdit}
          onOpenChange={setOpenEdit}
          groupId={id}
        />
      )}

      {/* Move Modal */}
      {openMove && (
        <BranchDialog
          pageTitle='Di chuyển nhánh'
          open={openMove}
          onOpenChange={setOpenMove}
          groupId={id}
          move={true}
        />
      )}

      {/* Main dropdown menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 p-0'
            disabled={disabled}
          >
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          className='flex w-34 flex-col gap-2 p-2'
        >
          <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
            className='flex items-center text-xs'
          >
            <Image
              src='/assets/icons/edit.svg'
              alt='edit'
              width={12}
              height={12}
              className='mx-2'
            />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenConfirm(true)}
            className='text-destructive flex items-center text-xs'
          >
            <Image
              src='/assets/icons/trash.svg'
              alt='trash'
              width={12}
              height={12}
              className='mx-2'
            />
            <span>Xóa nhánh</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenMove(true)}
            className='flex items-center text-xs'
          >
            <Image
              src='/assets/icons/move.svg'
              alt='view'
              width={12}
              height={12}
              className='mx-2'
            />
            <span>Di chuyển</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
