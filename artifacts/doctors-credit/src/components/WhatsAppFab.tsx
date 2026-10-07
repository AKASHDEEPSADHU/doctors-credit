"use client";

import { SITE, whatsappEnabled, whatsappHref } from "@/lib/contact";

export default function WhatsAppFab() {
  if (!whatsappEnabled()) return null;
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab"
      aria-label="Message Doctor's Credit on WhatsApp"
    >
      <span className="wa-fab-dot" />
      <svg viewBox="0 0 24 24" aria-hidden="true" className="wa-fab-icon">
        <path
          fill="currentColor"
          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm.01 18.18c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.15 8.15 0 0 1-1.26-4.41c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.27-8.23 8.27zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74 1.48.64 2.09.7 2.84.59.43-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"
        />
      </svg>
      <span className="wa-fab-label">WhatsApp</span>
      <span className="sr-only">
        Open a WhatsApp conversation with {SITE.name}. Please do not send
        medical records or other sensitive clinical documents through WhatsApp.
      </span>
    </a>
  );
}
