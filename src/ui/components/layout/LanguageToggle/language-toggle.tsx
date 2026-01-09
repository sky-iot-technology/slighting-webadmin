'use client';

import * as React from 'react';
import { Button } from '@/ui/components/ui/button';
import { useLanguageStore } from '@/core/domains/language/store';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8 font-bold'
      onClick={toggleLanguage}
      aria-label='Toggle language'
    >
      {language.toUpperCase()}
    </Button>
  );
}
