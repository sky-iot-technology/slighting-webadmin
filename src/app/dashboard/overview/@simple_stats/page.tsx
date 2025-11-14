import { delay } from '@/core/shared/constants/mock-api';
import { SimpleLineChart } from '@/features/overview/components/simple-line-chart';

export default async function SimpleStats() {
  await await delay(1000);
  return <SimpleLineChart />;
}
