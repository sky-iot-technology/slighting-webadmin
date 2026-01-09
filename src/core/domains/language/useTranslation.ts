import { useLanguageStore } from './store';
import { translations, LanguageKey } from '../../i18n/locales';
import { useCallback } from 'react';

function getTranslationValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = useCallback(
    (key: LanguageKey): string =>
      getTranslationValue(translations[language], key) ?? key,
    [language]
  );

  const tTime = useCallback(
    (key: LanguageKey, params?: Record<string, string | number>) => {
      let text = getTranslationValue(translations[language], key) ?? key;

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
