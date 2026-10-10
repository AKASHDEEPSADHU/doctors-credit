import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  detectBrowserLang,
  isLang,
  languageMeta,
  type Lang,
} from '@/lib/i18n/config';
import { MESSAGES, type Messages } from '@/lib/i18n/messages';

type LanguageContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  /** Copy for the active language. */
  t: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStored(): string | null {
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null; // Storage can be blocked (private mode).
  }
}

/** Saved choice first, then the browser's preferred language, then English. */
function readInitial(): Lang {
  const stored = readStored();
  if (isLang(stored)) return stored;
  return detectBrowserLang(navigator.languages ?? [navigator.language]) ?? DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  // Keep <html lang> accurate for screen readers, hyphenation and fonts.
  useEffect(() => {
    document.documentElement.lang = languageMeta(lang).htmlLang;
  }, [lang]);

  // Keep other open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_STORAGE_KEY && isLang(e.newValue)) setLangState(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Only a deliberate pick is written; a detected language is not stored.
  const setLang = useCallback((next: Lang) => {
    if (!isLang(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // The choice still applies for this visit.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: MESSAGES[lang] }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>.');
  return ctx;
}
