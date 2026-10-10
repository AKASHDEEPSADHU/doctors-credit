"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES, languageMeta } from "@/lib/i18n/config";

/**
 * Compact language picker for the top navigation bar. Accessible listbox:
 * arrow keys, Home/End, Enter/Space to choose, Escape to close.
 * Shows the language code (EN, ES, HI) in the bar and the native name in the list.
 * Flags are intentionally not used: a flag stands for a country, not a language.
 */
export default function LanguageSelector({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Slimmer button for the top utility strip. */
  compact?: boolean;
}) {
  const { lang, setLang, t, pending } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const current = languageMeta(lang);

  const openMenu = () => {
    setActive(Math.max(0, LANGUAGES.findIndex((l) => l.code === lang)));
    setOpen(true);
  };

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    setLang(LANGUAGES[index].code);
    close(true);
  };

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = LANGUAGES.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  return (
    // z-[3] keeps the picker above the mobile menu overlay (z-index 1) so it
    // stays usable while the menu is open.
    <div ref={rootRef} className={`relative z-[3] shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${t.language.change}: ${current.name}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={`inline-flex cursor-pointer items-center gap-1.5 border border-[color:var(--line)] bg-transparent font-medium uppercase leading-none tracking-[0.14em] text-[color:var(--navy)] transition-colors duration-200 hover:border-[color:var(--navy)] active:scale-[0.97] motion-reduce:transition-none ${
          compact ? "h-8 px-2.5 text-[0.68rem]" : "h-10 px-2.5 text-[0.72rem] sm:px-3"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.6 2.4 3.9 5.4 3.9 9s-1.3 6.6-3.9 9c-2.6-2.4-3.9-5.4-3.9-9S9.4 5.4 12 3z" />
        </svg>
        <span aria-hidden="true">{current.short}</span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={t.language.label}
          aria-activedescendant={`${listId}-${LANGUAGES[active].code}`}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-full mt-2 w-48 border border-[color:var(--line)] bg-[color:var(--paper)] py-1 text-[color:var(--navy)] shadow-[0_18px_40px_-18px_rgba(6,45,86,0.38)] outline-none"
        >
          {LANGUAGES.map((l, i) => {
            const selected = l.code === lang;
            return (
              <li
                key={l.code}
                id={`${listId}-${l.code}`}
                role="option"
                aria-selected={selected}
                lang={l.htmlLang}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[0.95rem] normal-case tracking-normal ${
                  i === active ? "bg-[color:var(--paper-2)]" : ""
                } ${selected ? "font-semibold" : ""}`}
              >
                <span className="w-7 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[color:var(--muted)]">
                  {l.short}
                </span>
                <span className="flex-1">{l.name}</span>
                {selected ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 text-[color:var(--teal)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {pending ? `${t.language.label}: ${current.name}` : ""}
      </span>
    </div>
  );
}
