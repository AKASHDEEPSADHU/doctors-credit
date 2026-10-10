import { useId } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { whatsappEnabled, whatsappHref } from '@/lib/whatsapp';

/**
 * Floating "Chat on WhatsApp" button, fixed to the bottom-right corner. The
 * pre-filled greeting follows the selected language. wa.me opens the native
 * app on phones and WhatsApp Web / Desktop on computers.
 */
export default function WhatsAppFab() {
  const { t } = useLanguage();
  const noteId = useId();
  if (!whatsappEnabled) return null;

  return (
    <a
      href={whatsappHref(t.whatsapp.greeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.aria}
      aria-describedby={noteId}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-14 w-14 items-center justify-center gap-2.5 rounded-full bg-whatsapp text-white shadow-[0_10px_28px_-8px_rgba(6,45,86,0.55)] ring-1 ring-white/25 transition duration-200 ease-out hover:bg-whatsapp-dark hover:shadow-[0_16px_34px_-8px_rgba(6,45,86,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp active:scale-95 active:shadow-md motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:px-5 sm:py-3.5"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-6 shrink-0 transition-transform duration-200 motion-safe:group-hover:scale-110 motion-reduce:transition-none"
      >
        <path
          fill="currentColor"
          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm.01 18.18c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.26-4.41c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.27-8.23 8.27zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74 1.48.64 2.09.7 2.84.59.43-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"
        />
      </svg>
      <span className="hidden text-[0.72rem] font-semibold uppercase leading-none tracking-[0.12em] sm:inline">
        {t.whatsapp.label}
      </span>
      <span id={noteId} className="sr-only">
        {t.whatsapp.privacyNote}
      </span>
    </a>
  );
}
