import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useState } from 'react';
import ChangePassword from '../modal/changePassword';

export function SecureSetting() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div className='p-4'>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.secure.2fa_title' as any)}
      </h2>
      <div className='bg-card mb-4 flex items-center justify-between rounded-[8px] p-4'>
        <span className='text-sm font-medium'>
          {t('setting.tab.secure.activate_2fa' as any)}
        </span>
        <Badge className='bg-primary/5 dark:bg-black-2 text-primary-text rounded-[4px]'>
          {t('setting.tab.secure.activated' as any)}
        </Badge>
      </div>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.secure.password_title' as any)}
      </h2>
      <div className='bg-card flex items-center justify-between rounded-[8px] p-4'>
        <span className='text-sm font-medium'>
          {t('setting.tab.secure.change_password_desc' as any)}
        </span>
        <Button
          variant={'secondary'}
          className='bg-muted-foreground/20 dark:bg-black-2 dark:text-muted-foreground h-6 cursor-pointer rounded-[4px] text-xs'
          onClick={() => setOpen(true)}
        >
          {t('setting.tab.secure.change_password_btn' as any)}
        </Button>
      </div>
      {open && (
        <ChangePassword
          pageTitle={t('setting.tab.secure.change_password_btn' as any)}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
}
