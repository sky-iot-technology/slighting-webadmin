'use client';
import CabinetInfoPanel from '@/features/map/components/cabinet_info_panel';
import PageContainer from '@/ui/components/layout/page-container';
import { Button } from '@/ui/components/ui/button';
import { useState } from 'react';

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <PageContainer scrollable={true}>
      <div className='h-full w-full rounded-xl bg-amber-300'>
        <Button onClick={() => setOpen(!open)}>Open</Button>
        <CabinetInfoPanel open={open} onOpenChange={setOpen} />
      </div>
    </PageContainer>
  );
}
