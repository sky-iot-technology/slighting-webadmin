import { useQueryStatus } from '@/core/domains/devices';

export function RequestWatcher({
  requestId,
  deviceId,
  pollInterval,
  onStopped
}: {
  requestId?: string;
  deviceId?: string;
  pollInterval?: number;
  onStopped: (reason: string) => void;
}) {
  useQueryStatus(requestId ?? '', deviceId, onStopped, pollInterval);
  return null;
}
