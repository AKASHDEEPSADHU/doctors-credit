/**
 * Shared (server + client) language configuration.
 *
 * The selected language is kept in three places on purpose:
 *  - the `dc_lang` cookie, so Server Components (layout, footer, homepage)
 *    render in the right language on the first paint, with no flash;
 *  - localStorage (`dc-lang`), so the choice survives if cookies are cleared;
 *  - React context, so client components switch instantly.
 */
export const LANGUAGES = [
  { code: "en", short: "EN", name: "English", htmlLang: "en" },
  { code: "es", short: "ES", name: "Español", htmlLang: "es" },
  { code: "hi", short: "HI", name: "हिन्दी", htmlLang: "hi" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "dc_lang";
export const LANG_STORAGE_KEY = "dc-lang";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLang(value: unknown): value is Lang {
  return LANGUAGES.some((l) => l.code === value);
}

export function languageMeta(lang: Lang) {
  return LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
}
