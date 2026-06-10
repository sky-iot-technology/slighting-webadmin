import { useQueryStatus } from '@/core/domains/ota';
import { useEffect } from 'react';

type RequestWatcherProps = {
  requestId: string;
  pollInterval?: number;
  onProgress?: (progress: number) => void;
  onDone?: (status: 'completed' | 'failed' | 'timeout', error?: string) => void;
};

export function RequestWatcher({
  requestId,
  pollInterval,
  onProgress,
  onDone
}: RequestWatcherProps) {
  const { data } = useQueryStatus(
    requestId,
    (reason, error) => {
      onDone?.(reason as 'completed' | 'failed' | 'timeout', error);
    },
    pollInterval
  );

  useEffect(() => {
    const progress = data?.result?.payload?.process;
    if (typeof progress === 'number') {
      onProgress?.(progress);
    }
  }, [data?.result?.payload?.process]);

  return null;
}
