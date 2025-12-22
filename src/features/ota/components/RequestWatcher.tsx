import { useQueryStatus } from '@/core/domains/ota';
import { useEffect } from 'react';

type RequestWatcherProps = {
  requestId: string;
  pollInterval?: number;
  onProgress?: (progress: number) => void;
  onDone?: (status: 'completed' | 'failed' | 'timeout') => void;
};

export function RequestWatcher({
  requestId,
  pollInterval,
  onProgress,
  onDone
}: RequestWatcherProps) {
  const { data } = useQueryStatus(
    requestId,
    (reason) => {
      onDone?.(reason as 'completed' | 'failed' | 'timeout');
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
