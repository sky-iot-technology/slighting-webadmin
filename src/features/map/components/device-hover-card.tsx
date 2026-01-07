import { Device } from '@/core/domains/devices';
import { Button } from '@/ui/components/ui/button';

interface DeviceHoverCardProps {
  device?: Device;
  featureProperties: any;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: () => void;
}

export function DeviceHoverCard({
  device,
  featureProperties,
  onMouseEnter,
  onMouseLeave,
  onMouseMove
}: DeviceHoverCardProps) {
  return (
    <div
      className='animate-in fade-in zoom-in-95 w-[320px] rounded-xl border border-gray-100 bg-white shadow-xl duration-200 dark:border-gray-600 dark:bg-gray-800'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <div className='relative z-10'>
        <div className='flex items-start justify-between rounded-t-xl border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/30'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700'>
              <span className='material-icons-round font-icon text-gray-600 dark:text-gray-300'>
                test
              </span>
            </div>
            <div>
              <h4 className='text-base leading-tight font-bold text-gray-800 dark:text-white'>
                {device?.name || featureProperties.id}
              </h4>
              <div className='mt-1 flex items-center gap-1.5'>
                <span className='relative flex h-2 w-2'>
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${featureProperties.online === 'online' ? 'bg-green-400' : 'bg-red-400'}`}
                  ></span>
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${featureProperties.online === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                  ></span>
                </span>
                <span
                  className={`text-xs font-medium ${featureProperties.online === 'online' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {featureProperties.online === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Placeholder for detailed content if available in the future */}
        <div className='p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <h5 className='bg-primary rounded px-2 py-0.5 text-xs font-semibold text-white'>
              Điều khiển line
            </h5>
            <span className='text-[10px] text-gray-500 dark:text-gray-400'>
              0 / 4 line đang bật
            </span>
          </div>

          <div className='space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='material-icons-round text-sm text-gray-400'>
                  power
                </span>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                  Light Line 3
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400'>
                  ON
                </span>
                <div className='bg-primary relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'>
                  <span className='pointer-events-none inline-block h-4 w-4 translate-x-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'></span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='material-icons-round text-sm text-gray-400'>
                  power
                </span>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                  Light Line 2
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-500 dark:bg-red-900/30 dark:text-red-400'>
                  OFF
                </span>
                <div className='relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-600'>
                  <span className='pointer-events-none inline-block h-4 w-4 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'></span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='material-icons-round text-sm text-gray-400'>
                  power
                </span>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                  Light Line 4
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-500 dark:bg-red-900/30 dark:text-red-400'>
                  OFF
                </span>
                <div className='relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-600'>
                  <span className='pointer-events-none inline-block h-4 w-4 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'></span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='material-icons-round text-sm text-gray-400'>
                  power
                </span>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-300'>
                  Light Line 1
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-500 dark:bg-red-900/30 dark:text-red-400'>
                  OFF
                </span>
                <div className='relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none dark:bg-gray-600'>
                  <span className='pointer-events-none inline-block h-4 w-4 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'></span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-700'>
            <div>
              <p className='text-[10px] text-gray-400'>Ngày tạo</p>
              <p className='font-semibold text-gray-700 dark:text-gray-300'>
                2.4 kW
              </p>
            </div>
            <div className='text-right'>
              <p className='text-[10px] text-gray-400'>Lần cuối online</p>
              <p className='font-semibold text-gray-700 dark:text-gray-300'>
                7 mins ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
