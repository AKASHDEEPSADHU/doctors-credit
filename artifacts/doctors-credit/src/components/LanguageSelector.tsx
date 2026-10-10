import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LANGUAGES, languageMeta } from '@/lib/i18n/config';

/**
 * Language picker for the top navigation bar. An accessible listbox: arrow
 * keys, Home/End, Enter/Space to choose, Escape to close. The bar shows the
 * language code (EN, ES, HI); the list shows codes and native names.
 */
export default function LanguageSelector({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
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
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = LANGUAGES.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => (i >= last ? 0 : i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => (i <= 0 ? last : i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        close(true);
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`${t.language.change}: ${current.name}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-md border border-brand-line bg-transparent px-2.5 text-xs font-medium uppercase leading-none tracking-[0.14em] text-brand-navy transition duration-200 hover:border-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal active:scale-[0.97] motion-reduce:transition-none sm:px-3"
      >
        <Globe aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
        <span aria-hidden="true">{current.short}</span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.8}
          className={`size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
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
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-md border border-brand-line bg-brand-paper py-1 text-brand-navy shadow-[0_18px_40px_-18px_rgba(6,45,86,0.38)] outline-none"
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
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[0.95rem] ${
                  i === active ? 'bg-brand-paper-2' : ''
                } ${selected ? 'font-semibold' : ''}`}
              >
                <span className="w-7 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-brand-muted">
                  {l.short}
                </span>
                <span className="flex-1">{l.name}</span>
                {selected ? (
                  <Check aria-hidden="true" className="size-4 text-brand-teal" strokeWidth={2} />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
