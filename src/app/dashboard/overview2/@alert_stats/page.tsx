import { delay } from '@/core/shared/constants/mock-api';
import { RecentAlerts } from '@/features/overview/components/recent-alerts';

export default async function AlertStats() {
  await await delay(2000);
  return <RecentAlerts />;
}
