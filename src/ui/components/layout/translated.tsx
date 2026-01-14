'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/components/ui/avatar';
import { Button } from '@/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/components/ui/dropdown-menu';
import { useTranslation } from '@/core/domains/language/useTranslation';
import Image from 'next/image';
import { useLanguageStore } from '@/core/domains/language/store';

export function Translated() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>
              <Image
                alt='translated'
                src={'/assets/icons/translated.svg'}
                width={16}
                height={16}
              />
            </AvatarFallback>
          </Avatar>
          <div className='absolute -top-1 -right-1 h-4 w-4 overflow-hidden rounded-full border-2 border-white shadow-sm'>
            <Image
              alt='language-flag'
              src={
                language === 'vi'
                  ? '/assets/icons/vietnamese.svg'
                  : '/assets/icons/english.svg'
              }
              fill
              className='object-cover'
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        defaultValue={language}
        className='w-56'
        align='end'
        forceMount
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setLanguage('vi')}>
            {t('setting.tab.display.vi' as any)}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('en')}>
            {t('setting.tab.display.en' as any)}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
