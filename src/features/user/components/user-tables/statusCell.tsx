'use client';

import { Switch } from '@/ui/components/ui/switch';
import { useUpdateUserStatus } from '@/core/domains/users/hooks';
import { User } from '@/core/domains/users';

interface StatusCellProps {
  user: User;
}

export function StatusCell({ user }: StatusCellProps) {
  const updateStatus = useUpdateUserStatus();

  const isEnabled = user.status === 'enabled';

  return (
    <Switch
      className='data-[state=unchecked]:bg-map-range-slider-inactive data-[state=checked]:bg-map-range-slider-active ml-3'
      checked={isEnabled}
      disabled={updateStatus.isPending}
      onCheckedChange={(val) =>
        updateStatus.mutate({ id: user.id, enabled: val })
      }
    />
  );
}

export default StatusCell;
