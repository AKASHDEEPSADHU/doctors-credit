/**
 * Language configuration shared by the provider, the selector and the copy.
 * The visitor's choice is kept in React context and mirrored to localStorage,
 * so it survives a page refresh.
 *
 * Flags are intentionally not used: a flag stands for a country, not a
 * language. The picker shows the language code (EN, ES, HI) plus the native name.
 */
export const LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English', htmlLang: 'en' },
  { code: 'es', short: 'ES', name: 'Español', htmlLang: 'es' },
  { code: 'hi', short: 'HI', name: 'हिन्दी', htmlLang: 'hi' },
] as const;

export type Lang = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_LANG: Lang = 'en';
export const LANG_STORAGE_KEY = 'dc-lang';

export function isLang(value: unknown): value is Lang {
  return LANGUAGES.some((l) => l.code === value);
}

export function languageMeta(lang: Lang) {
  return LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
}

/** First supported language in the browser's preference list, if any. */
export function detectBrowserLang(preferred: readonly string[]): Lang | null {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return null;
}
