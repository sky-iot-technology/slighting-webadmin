import { Switch } from '@/ui/components/ui/switch';
import Image from 'next/image';
import { useTranslation } from '@/core/domains/language/useTranslation';

export function AlertSetting() {
  const { t } = useTranslation();
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.alert.method_title' as any)}
      </h2>
      <div className='mb-4 flex flex-col gap-4 rounded-[8px] bg-white p-4'>
        <span className='text-sm'>
          {t('setting.tab.alert.method_desc' as any)}
        </span>
        <div className='flex flex-col gap-4 pl-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/gmail.svg'
                alt='gmail'
                width={17}
                height={17}
              />
              <span className='text-xs'>
                {t('setting.tab.alert.gmail' as any)}
              </span>
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
              <span className='text-xs'>
                {t('setting.tab.alert.sms' as any)}
              </span>
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
              <span className='text-xs'>
                {t('setting.tab.alert.notification' as any)}
              </span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
        </div>
      </div>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.alert.type_title' as any)}
      </h2>
      <div className='mb-4 flex flex-col gap-4 rounded-[8px] bg-white p-4'>
        <span className='text-sm'>
          {t('setting.tab.alert.type_desc' as any)}
        </span>
        <div className='flex flex-col gap-4 pl-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/maintenance-white.svg'
                alt='maintenance-white'
                width={17}
                height={17}
              />
              <span className='text-xs'>
                {t('setting.tab.alert.maintenance' as any)}
              </span>
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
              <span className='text-xs'>
                {t('setting.tab.alert.periodic_maintenance' as any)}
              </span>
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
              <span className='text-xs'>
                {t('setting.tab.alert.abnormal_login' as any)}
              </span>
            </div>
            <Switch className='data-[state=checked]:bg-green-500' />
          </div>
        </div>
      </div>
    </div>
  );
}
