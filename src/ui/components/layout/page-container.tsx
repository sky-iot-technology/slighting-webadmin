import React from 'react';
import { ScrollArea } from '@/ui/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true,
  classname
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  classname?: string;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea
          className={'h-[calc(100dvh-52px)]'}
          classPrimitiveName={classname}
        >
          <div className='flex flex-1 p-4 md:px-4'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 p-4 md:px-4'>{children}</div>
      )}
    </>
  );
}
