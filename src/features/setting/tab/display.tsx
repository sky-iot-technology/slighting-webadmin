'use client';
import { cn } from '@/lib/utils';
import { Label } from '@/ui/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/components/ui/radio-group';
import Image from 'next/image';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { useLanguageStore } from '@/core/domains/language/store';

export function DisplaySetting() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();
  return (
    <div className='w-full p-4'>
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.display.title' as any)}
      </h2>

      {/* CARD LIGHT/DARK */}
      <RadioGroup
        defaultValue='light'
        className={cn(
          '[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray mb-4 grid gap-4 rounded-[8px] bg-white p-4 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white',
          'grid-cols-1 sm:grid-cols-2'
        )}
      >
        {/* LIGHT */}
        <Label
          htmlFor='light'
          className='flex cursor-pointer flex-col gap-3 rounded-md p-2 transition'
        >
          <div className='relative aspect-[16/9] w-full overflow-hidden rounded-md'>
            <Image
              src='/assets/icons/light.svg'
              alt='light'
              fill
              className='object-contain'
            />
          </div>

          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>
              {t('setting.tab.display.light' as any)}
            </span>
            <RadioGroupItem id='light' value='light' />
          </div>
        </Label>

        {/* DARK */}
        <Label
          htmlFor='dark'
          className='flex cursor-pointer flex-col gap-3 rounded-md p-2 transition'
        >
          <div className='relative aspect-[16/9] w-full overflow-hidden rounded-md'>
            <Image
              src='/assets/icons/dark.svg'
              alt='dark'
              fill
              className='object-contain'
            />
          </div>

          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>
              {t('setting.tab.display.dark' as any)}
            </span>
            <RadioGroupItem id='dark' value='dark' />
          </div>
        </Label>
      </RadioGroup>

      {/* LANGUAGE */}
      <h2 className='mb-2 text-sm font-bold'>
        {t('setting.tab.display.language' as any)}
      </h2>

      <div className='flex flex-col justify-between gap-3 rounded-[8px] bg-white p-4 md:flex-row'>
        <span className='text-sm font-medium'>
          {t('setting.tab.display.change_language' as any)}
        </span>

        <RadioGroup
          defaultValue={language}
          className='[&_[data-state=checked]]:border-calendar-radio-green [&_[data-state=checked]]:bg-calendar-radio-green [&_[data-state=unchecked]]:border-calendar-radio-gray [&_[data-state=unchecked]]:bg-calendar-radio-gray flex flex-wrap gap-4 [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:fill-white [&_[data-state=checked]_[data-slot=radio-group-indicator]_.lucide-circle]:stroke-white'
          onValueChange={toggleLanguage}
        >
          <div className='flex items-center gap-2'>
            <RadioGroupItem value='vi' id='vi' />
            <Label htmlFor='vi' className='cursor-pointer text-sm font-medium'>
              {t('setting.tab.display.vi' as any)}
            </Label>
          </div>

          <div className='flex items-center gap-2'>
            <RadioGroupItem value='en' id='eng' />
            <Label htmlFor='eng' className='cursor-pointer text-sm font-medium'>
              {t('setting.tab.display.en' as any)}
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
