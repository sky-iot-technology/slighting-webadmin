import { Group, GroupListResponseDto } from '@/core/domains/groups';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import Image from 'next/image';

type MapFilterProps = {
  groups?: Group[];
  selected?: string;
  onRegionChange: (id: string) => void;
};

export default function MapFilter({
  groups,
  selected,
  onRegionChange
}: MapFilterProps) {
  if (!groups) return null;
  return (
    <div className='absolute top-[15px] left-[9px]'>
      <div className='bg-map-filter flex rounded-lg px-1 py-1'>
        <Select onValueChange={onRegionChange} defaultValue={selected}>
          <SelectTrigger className='bg-background mr-0.5 !h-[26px] w-[160px] text-xs sm:!h-[28px] sm:w-[180px] md:!h-[30px] md:w-[217px]'>
            <SelectValue placeholder='Chọn khu vực' />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={String(group.id)} value={String(group.id)}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='relative ml-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]'>
          <Image
            src={'/assets/icons/search.svg'}
            alt='search'
            width={12}
            height={12}
            className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform'
          />
          <input
            placeholder='Tìm kiếm khu vực & thiết bị'
            className='border-input bg-background text-foreground placeholder:text-muted-foreground h-full w-full rounded-md border pr-3 pl-7 focus:ring-0 focus:outline-none'
          />
        </div>
      </div>
    </div>
  );
}
