'use client';

import { Alert, AlertDescription, AlertTitle } from '@/ui/components/ui/alert';
import { IconAlertCircle } from '@tabler/icons-react';

export default function SimpleStatsError({ error }: { error: Error }) {
  return (
    <Alert variant='destructive'>
      <IconAlertCircle className='h-4 w-4' />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load simple statistics: {error.message}
      </AlertDescription>
    </Alert>
  );
}
