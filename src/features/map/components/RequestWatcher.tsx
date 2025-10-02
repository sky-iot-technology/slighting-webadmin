import { useQueryStatus } from '@/core/domains/devices';

export function RequestWatcher({
  requestId,
  onStopped
}: {
  requestId?: string;
  onStopped: (reason: string) => void;
}) {
  useQueryStatus(requestId ?? '', onStopped);
  return null;
}
