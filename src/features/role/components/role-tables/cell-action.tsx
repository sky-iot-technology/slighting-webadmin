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
import RoleDialog from '../modal/role-dialog';
import { PermissionGuard, useDeleteRole } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface CellActionProps {
  id: string;
  disabled?: boolean;
}

export const CellAction: React.FC<CellActionProps> = ({ id, disabled }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  const deleteRole = useDeleteRole();
  const handleConfirmDelete = () => {
    if (!id) return;
    deleteRole.mutate(id);
  };

  return (
    <>
      {/* View */}
      <RoleDialog
        pageTitle={t('role.modal.view.title' as any)}
        open={openView}
        onOpenChange={setOpenView}
        isViewOnly={true}
        roleId={id}
      />

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteRole.isPending}
        title={t('role.modal.delete.title' as any)}
        description={t('role.modal.delete.description' as any)}
      />

      {/* ✏️ Edit */}
      <RoleDialog
        pageTitle={t('role.modal.edit.title' as any)}
        open={openEdit}
        onOpenChange={setOpenEdit}
        roleId={id}
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
            <span>{t('role.action.view' as any)}</span>
          </DropdownMenuItem>

          <PermissionGuard module='role' action='update' fallback={null}>
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
              <span>{t('role.action.edit' as any)}</span>
            </DropdownMenuItem>
          </PermissionGuard>

          <PermissionGuard module='role' action='delete' fallback={null}>
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
                {t('role.action.delete' as any)}
              </span>
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
