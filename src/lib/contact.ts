/**
 * WhatsApp is live from the first paint. Set NEXT_PUBLIC_WHATSAPP_E164
 * to your number in E.164 without "+" (India example: 9198XXXXXXXX).
 */
function digits(value: string) {
  return value.replace(/\D/g, "");
}

const configured = digits(process.env.NEXT_PUBLIC_WHATSAPP_E164 || "");
const PLACEHOLDER_NUMBERS = new Set(["910000000000", "91xxxxxxxxxx"]);

export const WHATSAPP_E164 =
  configured.length >= 11 && !PLACEHOLDER_NUMBERS.has(configured) ? configured : "";

export function whatsappEnabled() {
  return WHATSAPP_E164.length >= 11;
}

export function whatsappHref(prefill?: string) {
  if (!whatsappEnabled()) return "";
  const text = encodeURIComponent(
    prefill ||
      "Hello. I would like to talk with a DCredit care coordinator about planned care and whether exploring treatment in India may make sense for me. I will not send medical records or other sensitive clinical documents through WhatsApp."
  );
  return `https://wa.me/${WHATSAPP_E164}?text=${text}`;
}

export const SITE = {
  name: "Doctor's Credit",
  short: "DCredit",
  domain: "dcredit.in",
  city: "Hyderabad",
  tagline: "Know your options before you decide.",
  promise:
    "We help international patients understand whether planned treatment in India may be worth investigating for their particular situation.",
  email: "care@dcredit.in",
  founders: {
    him: {
      name: "Akashdeep Sadhu",
      role: "Co-founder",
      image: "/founders/akashdeep.jpg",
      initials: "AS",
    },
    her: {
      name: "Co-founder",
      role: "Co-founder",
      image: "/founders/partner.jpg",
      initials: "DC",
      note: "Name and portrait to be placed when you send them.",
    },
  },
} as const;

export const DISCLAIMER =
  "DCredit is an international planned-care decision and coordination platform. We are not a hospital, physician, insurer, emergency medical service or diagnostic service. Information on this website is educational and for coordination. It is not medical advice, diagnosis, treatment or medical clearance. The current $5 Initial Assessment is a conversation with DCredit, not a clinical assessment, specialist opinion, insurance verification or medical-record review. DCredit does not currently operate a medical-record vault. Treatment decisions must be made between you and qualified healthcare professionals. Costs, availability, treatment plans, outcomes and travel requirements vary. No medical outcome or savings are guaranteed. Always consult your own healthcare professionals and, where relevant, your insurer or funding body before making decisions about cross-border care. For example, in the United States, this website does not claim HIPAA compliance.";
