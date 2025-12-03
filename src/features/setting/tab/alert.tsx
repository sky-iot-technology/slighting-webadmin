import { Switch } from '@/ui/components/ui/switch';
import Image from 'next/image';

export function AlertSetting() {
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>Phương thức thông báo</h2>
      <div className='mb-4 flex flex-col gap-4 rounded-[8px] bg-white p-4'>
        <span className='text-sm'>Chọn cách nhận thông báo từ hệ thống</span>
        <div className='flex flex-col gap-4 pl-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/gmail.svg'
                alt='gmail'
                width={17}
                height={17}
              />
              <span className='text-xs'>Gmail</span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/sms.svg'
                alt='sms'
                width={17}
                height={17}
              />
              <span className='text-xs'>SMS</span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/alert-white.svg'
                alt='alert-white'
                width={17}
                height={17}
              />
              <span className='text-xs'>Thông báo</span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
        </div>
      </div>
      <h2 className='mb-2 text-sm font-bold'>Loại thông báo</h2>
      <div className='mb-4 flex flex-col gap-4 rounded-[8px] bg-white p-4'>
        <span className='text-sm'>Chọn sự kiện nào sẽ gửi thông báo</span>
        <div className='flex flex-col gap-4 pl-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/maintenance-white.svg'
                alt='maintenance-white'
                width={17}
                height={17}
              />
              <span className='text-xs'>Cảnh báo bảo trì</span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/calendar-12.svg'
                alt='calendar-12'
                width={17}
                height={17}
              />
              <span className='text-xs'>Cảnh báo bảo trì định kỳ</span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/user-white.svg'
                alt='user-white'
                width={17}
                height={17}
              />
              <span className='text-xs'>Cảnh báo đăng nhập bất thường</span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
        </div>
      </div>
    </div>
  );
}
