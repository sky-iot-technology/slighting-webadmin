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
import { useCan } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface BranchActionMenuProps {
  id: string;
  name: string;
  disabled?: boolean;
  onDeleted?: () => void;
}

export function BranchActionMenu({
  id,
  name,
  disabled,
  onDeleted
}: BranchActionMenuProps) {
  const { t, tTime } = useTranslation();

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

  const canUpdate = useCan('group', 'update');
  const canDelete = useCan('group', 'delete');

  const hasActions = canUpdate || canDelete;

  if (!hasActions) return null;

  return (
    <>
      {/* Delete Confirm */}
      <AlertModal
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        loading={deleteGroup.isPending}
        title={t('branch.modal.delete.title' as any)}
        description={tTime('branch.modal.delete.description' as any, {
          name: name
        })}
      />

      {/* Edit Modal */}
      {openEdit && (
        <BranchDialog
          pageTitle={t('branch.table.action.title')}
          open={openEdit}
          onOpenChange={setOpenEdit}
          groupId={id}
        />
      )}

      {/* Move Modal */}
      {openMove && (
        <BranchDialog
          pageTitle={t('branch.table.action.moveTitle')}
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
          className='bg-action flex w-34 flex-col gap-2 p-2'
        >
          {canUpdate && (
            <>
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
                <span>{t('branch.table.action.edit')}</span>
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
                <span>{t('branch.table.action.move')}</span>
              </DropdownMenuItem>
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuItem
                onClick={() => setOpenConfirm(true)}
                className='text-destructive hover:!text-destructive flex items-center text-xs'
              >
                <Image
                  src='/assets/icons/trash.svg'
                  alt='trash'
                  width={12}
                  height={12}
                  className='mx-2'
                />
                <span>{t('branch.table.action.delete')}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
