import { cn } from '@/lib/utils';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import Image from 'next/image';

type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  trend: number;
  shadow: string;
  trendType?: 'up' | 'down';
  bgColor?: string;
};

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendType = 'up',
  shadow,
  bgColor
}: StatCardProps) {
  const trendColor = trendType === 'up' ? 'text-success' : 'text-destructive';
  const TrendIcon = trendType === 'up' ? IconTrendingUp : IconTrendingDown;
  return (
    <Card
      className={cn(
        '@container/card gap-3 border-none py-1.5',
        bgColor,
        shadow
      )}
    >
      <CardHeader className='pt-3'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            <Image
              src={icon}
              alt={label}
              width={24}
              height={24}
              className='size-6'
            />
          </div>
          <div className='ml-1.5 flex flex-col gap-1.5'>
            <CardDescription className='text-foreground text-sm leading-[22px]'>
              {label}
            </CardDescription>
            <CardTitle className='text-card-title text-xl leading-[30px] font-bold tabular-nums @[250px]/card:text-3xl'>
              {value}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardFooter className='mt-auto flex-col items-end pr-2.5 text-[10px] font-medium'>
        <div className='line-clamp-1 flex gap-0.5'>
          <span className={`flex items-center gap-0.5 ${trendColor}`}>
            <TrendIcon className='size-3' /> {trend}%
          </span>
          <span className='text-muted-foreground'>so với hôm qua</span>
        </div>
      </CardFooter>
    </Card>
  );
}
