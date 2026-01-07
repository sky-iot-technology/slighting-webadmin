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
import UserDialog from '../modal/user-dialog';
import { useDeleteUser } from '@/core/domains/users';
import { PermissionGuard } from '@/core/domains/permissions';

interface CellActionProps {
  id: string;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ id, disabled }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const router = useRouter();

  const deleteUser = useDeleteUser();

  const handleConfirmDelete = () => {
    if (!id) return;
    deleteUser.mutate(id);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteUser.isPending}
      />

      {/* ✏️ Edit */}
      <UserDialog
        pageTitle='Chỉnh sửa người dùng'
        open={openEdit}
        onOpenChange={setOpenEdit}
        userId={id}
      />

      {/* View */}
      <UserDialog
        pageTitle='Thông tin người dùng'
        open={openView}
        onOpenChange={setOpenView}
        userId={id}
        isView={true}
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
            <span>Chi tiết</span>
          </DropdownMenuItem>

          <PermissionGuard module='users' action='update' fallback={null}>
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
          </PermissionGuard>

          <PermissionGuard module='users' action='delete' fallback={null}>
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
