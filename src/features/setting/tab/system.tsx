import { Badge } from '@/ui/components/ui/badge';
import { useTranslation } from '@/core/domains/language/useTranslation';

export function SystemSetting() {
  const { t } = useTranslation();
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.system.title' as any)}
      </h2>
      <div className='bg-card mb-4 flex flex-col gap-4 rounded-[8px] p-4 text-sm'>
        <div className='flex items-center justify-between'>
          <span>{t('setting.tab.system.version' as any)}:</span>
          <span>v2.0.2</span>
        </div>
        <div className='flex justify-between'>
          <span>{t('setting.tab.system.device_count' as any)}</span>
          <span>1.247 đèn</span>
        </div>
      </div>
    </div>
  );
}
