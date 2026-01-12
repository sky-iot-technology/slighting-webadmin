import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { useTranslation } from '@/core/domains/language/useTranslation';

export function SecureSetting() {
  const { t } = useTranslation();
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.secure.2fa_title' as any)}
      </h2>
      <div className='mb-4 flex items-center justify-between rounded-[8px] bg-white p-4'>
        <span className='text-sm font-medium'>
          {t('setting.tab.secure.activate_2fa' as any)}
        </span>
        <Badge className='bg-primary/5 text-primary rounded-[4px]'>
          {t('setting.tab.secure.activated' as any)}
        </Badge>
      </div>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.secure.password_title' as any)}
      </h2>
      <div className='flex items-center justify-between rounded-[8px] bg-white p-4'>
        <span className='text-sm font-medium'>
          {t('setting.tab.secure.change_password_desc' as any)}
        </span>
        <Button
          variant={'secondary'}
          className='bg-muted-foreground/20 h-10 cursor-pointer text-xs'
        >
          {t('setting.tab.secure.change_password_btn' as any)}
        </Button>
      </div>
    </div>
  );
}
