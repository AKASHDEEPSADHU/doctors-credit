"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { COMMON, type CommonMessages } from "@/lib/i18n/common";
import {
  LANG_COOKIE,
  LANG_COOKIE_MAX_AGE,
  LANG_STORAGE_KEY,
  isLang,
  languageMeta,
  type Lang,
} from "@/lib/i18n/config";

type LanguageContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  /** Shared strings for the active language. */
  t: CommonMessages;
  /** True while the server re-renders page copy in the new language. */
  pending: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persist(next: Lang) {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    // Storage can be blocked (private mode); the cookie still carries the choice.
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANG_COOKIE}=${next}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  document.documentElement.lang = languageMeta(next).htmlLang;
}

export function LanguageProvider({
  initialLang,
  children,
}: {
  /** Language the server rendered with (from the `dc_lang` cookie). */
  initialLang: Lang;
  children: ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [pending, startTransition] = useTransition();

  const apply = useCallback(
    (next: Lang) => {
      setLangState(next);
      persist(next);
      // Shared strings switch instantly from context; this re-renders the
      // Server Components (footer, homepage copy) in the new language.
      startTransition(() => router.refresh());
    },
    [router]
  );

  const setLang = useCallback(
    (next: Lang) => {
      if (!isLang(next) || next === lang) return;
      apply(next);
    },
    [apply, lang]
  );

  // If cookies were cleared but localStorage remembers a choice, restore it.
  // Nothing is written until the visitor actually picks a language.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      return;
    }
    if (isLang(stored) && stored !== initialLang) apply(stored);
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_STORAGE_KEY && isLang(e.newValue)) {
        setLangState(e.newValue);
        document.documentElement.lang = languageMeta(e.newValue).htmlLang;
        startTransition(() => router.refresh());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: COMMON[lang], pending }),
    [lang, setLang, pending]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>.");
  return ctx;
}
