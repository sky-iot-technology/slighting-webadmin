import { Device } from '@/core/domains/devices';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type SearchType = 'deviceName' | 'macAddress';

const typeLabels: Record<SearchType, string> = {
  deviceName: 'Tên thiết bị',
  macAddress: 'MAC address'
};

type DropdownMode = 'none' | 'type' | 'results';

type SearchBarProps = {
  devices: Device[];
  onSelectDevice?: (device: Device | null) => void;
};

export function SearchBar({ devices, onSelectDevice }: SearchBarProps) {
  const [dropdownMode, setDropdownMode] = useState<DropdownMode>('none');
  const [searchType, setSearchType] = useState<SearchType>('deviceName');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Device[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    inputRef.current?.focus();
    setDropdownMode('results');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setDropdownMode('none');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const value = query.toLowerCase();
      const result = devices.filter((d) => {
        if (searchType === 'deviceName') {
          return d.name.toLowerCase().includes(value);
        } else if (searchType === 'macAddress') {
          return d.device_info.imei.toLowerCase().includes(value);
        }
      });
      setResults(result);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, searchType, devices, setResults]);

  return (
    <div
      ref={containerRef}
      className='relative ml-0.5 h-[26px] w-[160px] rounded-md text-xs sm:h-[28px] sm:w-[180px] md:h-[30px] md:w-[217px]'
    >
      <div className='border-input bg-background flex h-full w-full items-center rounded-md border pr-2 pl-2'>
        <Image
          src={'/assets/icons/search.svg'}
          alt='search'
          width={11}
          height={11}
          className='text-muted-foreground mr-1 pb-0.5'
        />
        <button
          type='button'
          className='text-muted-foreground mr-1 flex shrink-0 items-center gap-1'
          onClick={() =>
            setDropdownMode(dropdownMode === 'type' ? 'none' : 'type')
          }
        >
          <span>{typeLabels[searchType]}:</span>
        </button>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setDropdownMode('results');
          }}
          className='text-foreground placeholder:text-muted-foreground w-full flex-1 bg-transparent focus:outline-none'
          placeholder='Nhập từ khóa...'
        />
      </div>

      {/* Drop down for search type */}
      {dropdownMode === 'type' && (
        <div className='bg-popover animate-fade-in absolute z-10 mt-0.5 w-[160px] rounded-md border shadow-md sm:w-[180px] md:w-[217px]'>
          <ul className='p-1'>
            <li
              className='hover:bg-primary cursor-pointer rounded-md px-3 py-2 hover:text-white'
              onClick={() => handleTypeChange('deviceName')}
            >
              Tên thiết bị
            </li>
            <li
              className='hover:bg-primary cursor-pointer rounded-md px-3 py-2 hover:text-white'
              onClick={() => handleTypeChange('macAddress')}
            >
              MAC address
            </li>
          </ul>
        </div>
      )}

      {/* Drop down for result */}
      {searchType && query && dropdownMode === 'results' && (
        <CustomScrollbar className='bg-popover absolute z-20 mt-0.5 max-h-[171px] w-[160px] overflow-y-auto rounded-md sm:w-[180px] md:w-[217px]'>
          {results.length > 0 ? (
            results.map((d) => (
              <li
                key={d.id}
                className='hover:bg-primary/10 cursor-pointer px-3.5 py-1.5'
                onClick={() => {
                  setQuery(
                    searchType === 'deviceName' ? d.name : d.device_info.imei
                  );
                  setResults([]);
                  setDropdownMode('none');
                  onSelectDevice?.(d);
                }}
              >
                {searchType === 'deviceName' ? (
                  <div className='flex flex-col text-xs'>
                    <span className='font-medium'>{d.name}</span>
                    <span className='font-light'>Loại thiết bị: Đèn đường</span>
                    <span className='font-light'>Địa chỉ: test</span>
                  </div>
                ) : (
                  <div className='flex flex-col text-[10px]'>
                    <span className='font-medium'>{d.device_info.imei}</span>
                    <span className='font-light'>Tên thiết bị: {d.name}</span>
                  </div>
                )}
              </li>
            ))
          ) : (
            <div className='text-muted-foreground px-3 py-2 text-sm'>
              Không có thiết bị
            </div>
          )}
        </CustomScrollbar>
      )}
    </div>
  );
}
