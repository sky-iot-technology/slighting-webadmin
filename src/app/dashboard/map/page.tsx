'use client';
import CabinetInfoPanel from '@/features/map/components/cabinet_info_panel';
import GoongMap from '@/features/map/components/goong-map';
import PageContainer from '@/ui/components/layout/page-container';
import { Button } from '@/ui/components/ui/button';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// const GoongMap = dynamic(() => import('@/features/map/components/goong-map'), {
//   ssr: false , loading: () => <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">Loading map...</div>
// });

export default function Page() {
  const [open, setOpen] = useState(false);
  return (
    <PageContainer scrollable={true}>
      <GoongMap />
      <div className='h-full w-full rounded-xl bg-amber-300'>
        <Button onClick={() => setOpen(!open)}>Open</Button>
        <CabinetInfoPanel open={open} onOpenChange={setOpen} />
      </div>
    </PageContainer>
  );
}
