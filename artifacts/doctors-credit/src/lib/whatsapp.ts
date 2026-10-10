/**
 * WhatsApp click-to-chat. https://wa.me/<number>?text=<message> opens the
 * native app on phones and WhatsApp Web / Desktop on computers.
 *
 * Set VITE_WHATSAPP_NUMBER to the real number in international format,
 * digits only, no "+" or spaces (India example: 919876543210).
 *
 * Outside production (dev, previews) a placeholder is used so the button is
 * visible while reviewing. In production the placeholder is NEVER used: with
 * no real number configured the button stays hidden rather than linking to a
 * stranger.
 */
export const WHATSAPP_PREVIEW_PLACEHOLDER = '1234567890';

const digits = (value: string) => value.replace(/\D/g, '');

/** Pure so it can be tested. A real, non-placeholder number always wins. */
export function resolveWhatsappNumber(raw: string | undefined, isProduction: boolean) {
  const configured = digits(raw ?? '');
  const valid =
    configured.length >= 8 &&
    configured.length <= 15 &&
    configured !== WHATSAPP_PREVIEW_PLACEHOLDER;
  if (valid) return configured;
  return isProduction ? '' : WHATSAPP_PREVIEW_PLACEHOLDER;
}

export const WHATSAPP_NUMBER = resolveWhatsappNumber(
  import.meta.env.VITE_WHATSAPP_NUMBER,
  import.meta.env.PROD,
);

export const whatsappEnabled = WHATSAPP_NUMBER.length > 0;

export function whatsappHref(message: string, number: string = WHATSAPP_NUMBER) {
  if (!number) return '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
