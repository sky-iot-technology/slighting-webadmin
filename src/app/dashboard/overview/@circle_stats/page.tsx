import { delay } from '@/core/shared/constants/mock-api';
import { DeviceTypePieChart } from '@/features/overview/components/DeviceTypePieChart';

export default async function SimpleStats() {
  await await delay(1000);
  return <DeviceTypePieChart />;
}
