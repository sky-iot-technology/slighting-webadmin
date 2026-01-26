'use client';

import { Switch } from '@/ui/components/ui/switch';
import { useUpdateUserStatus } from '@/core/domains/users/hooks';
import { User } from '@/core/domains/users';
import { useCan } from '@/core/domains/permissions';

interface StatusCellProps {
  user: User;
}

export function StatusCell({ user }: StatusCellProps) {
  const updateStatus = useUpdateUserStatus();

  const isEnabled = user.status === 'enabled';
  const canUpdate = useCan('users', 'update');
  return (
    <Switch
      className='data-[state=unchecked]:bg-map-range-slider-inactive data-[state=checked]:bg-map-range-slider-active ml-3'
      thumbClassName='dark:data-[state=checked]:!bg-black dark:data-[state=unchecked]:!bg-black'
      checked={isEnabled}
      disabled={updateStatus.isPending || !canUpdate}
      onCheckedChange={(val) =>
        updateStatus.mutate({ id: user.id, enabled: val })
      }
    />
  );
}

export default StatusCell;
