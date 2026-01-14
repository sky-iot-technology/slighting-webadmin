import { vi } from './vi';
import { en } from './en';

export const translations = {
  vi,
  en
} as const;

export type Language = keyof typeof translations;

type TranslationTree = typeof vi;

type Prev = [never, 0, 1, 2, 3, 4, 5];

type DotNestedKeys<T, D extends number = 5> = [D] extends [never]
  ? never
  : {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${DotNestedKeys<T[K], Prev[D]>}`
        : `${K}`;
    }[keyof T & string];

export type LanguageKey = DotNestedKeys<TranslationTree>;
