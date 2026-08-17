import { useLanguageStore } from './store';
import { translations, LanguageKey } from '../../i18n/locales';
import { useCallback } from 'react';

function getTranslationValue(obj: any, path: string): string | undefined {
  if (!path || typeof path !== 'string') return undefined;
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = useCallback(
    (key: LanguageKey): string => {
      const val = getTranslationValue(translations[language], key);
      if (typeof val === 'object' && val !== null) {
        return key;
      }
      return (val as string) ?? key ?? '';
    },
    [language]
  );

  const tTime = useCallback(
    (key: LanguageKey, params?: Record<string, string | number>) => {
      const val = getTranslationValue(translations[language], key);
      let text = typeof val === 'string' ? val : key;

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{{${k}}}`, String(v));
        });
      }

      return text;
    },
    [language]
  );

  return { t, tTime, language };
}
