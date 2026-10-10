import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/components/LanguageProvider';
import { whatsappEnabled, whatsappHref } from '@/lib/whatsapp';

/** Emergency notice plus the top navigation bar, with the language picker. */
export default function SiteHeader() {
  const { t } = useLanguage();
  return (
    <>
      <p className="bg-brand-navy px-4 py-2 text-center text-xs leading-snug text-white sm:text-[0.8rem]">
        {t.emergencyBar}
      </p>
      <header className="sticky top-0 z-30 border-b border-brand-line bg-brand-paper/90 backdrop-blur">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-brand-navy focus:px-3 focus:py-2 focus:text-white"
        >
          {t.skip}
        </a>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6">
          <a href="#top" className="flex shrink-0 items-center">
            <img
              src={`${import.meta.env.BASE_URL}brand/lockup-transparent.png`}
              alt="Doctor's Credit"
              className="h-9 w-auto sm:h-11"
            />
          </a>
          <nav aria-label={t.nav.primary} className="flex items-center gap-2 sm:gap-4">
            {whatsappEnabled ? (
              <a
                href={whatsappHref(t.whatsapp.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 items-center rounded-md bg-brand-navy px-4 text-sm font-medium text-white transition duration-200 hover:bg-brand-navy-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal active:scale-[0.97] md:inline-flex"
              >
                {t.nav.cta}
              </a>
            ) : null}
            <LanguageSelector />
          </nav>
        </div>
      </header>
    </>
  );
}
