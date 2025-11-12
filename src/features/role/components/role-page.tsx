'use client';

import { fakeRoles } from '@/core/domains/role/fake';
import { RoleTable } from './calendar-tables';
import { roleColumns } from './calendar-tables/columns';

export default function RolePage() {
  return (
    <div className='h-full w-full p-3'>
      <div className='flex h-full w-full flex-1 bg-white'>
        <RoleTable
          data={fakeRoles}
          totalItems={fakeRoles.length}
          columns={roleColumns()}
        />
      </div>
    </div>
  );
}
