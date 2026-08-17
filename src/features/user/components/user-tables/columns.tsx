'use client';

import { Checkbox } from '@/ui/components/ui/checkbox';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/core/domains/users/types';
import StatusCell from './statusCell';
import { DataTableColumnHeader } from '@/ui/components/ui/table/data-table-column-header';
import { useGetUserRoles } from '@/core/domains/permissions';

const UserRoleCell = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUserRoles(userId);
  if (isLoading)
    return <div className='bg-muted h-4 w-12 animate-pulse rounded' />;
  const roleName = data?.roles?.[0]?.name ?? '-';
  return <div>{roleName}</div>;
};

export const userColumns = (t: any): ColumnDef<User>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    maxSize: 50
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.name')} />
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      return <div>{`${user.first_name} ${user.last_name}`}</div>;
    },
    meta: {
      label: 'name',
      placeholder: t('user.search_placeholder'),
      variant: 'text'
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'unit',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.unit')} />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.department')} />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.role')} />
    ),
    cell: ({ row }) => {
      const user = row.original as User;
      return <UserRoleCell userId={user.id} />;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'group',
    accessorKey: 'group',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.branch')} />
    ),
    cell: ({ row }) => {
      return <div>-</div>;
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.status')} />
    ),
    cell: ({ row }) => <StatusCell user={row.original} />,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title={t('user.actions')} />
    ),
    size: 57,
    cell: ({ row }) => {
      const user = row.original as User;
      return (
        <div className='flex min-h-[32px] items-center justify-center'>
          <CellAction
            name={`${user.first_name} ${user.last_name}`}
            id={String(row.original.id)}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  }
];
