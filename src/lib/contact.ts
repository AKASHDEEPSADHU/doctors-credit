/**
 * WhatsApp is live from the first paint. Set NEXT_PUBLIC_WHATSAPP_E164
 * to your number in E.164 without "+" (India example: 9198XXXXXXXX).
 */
function digits(value: string) {
  return value.replace(/\D/g, "");
}

const configured = digits(process.env.NEXT_PUBLIC_WHATSAPP_E164 || "");

export const WHATSAPP_E164 =
  configured.length >= 11 ? configured : digits("910000000000");

export function whatsappHref(prefill?: string) {
  const text = encodeURIComponent(
    prefill ||
      "Hello — I would like an independent orientation for treatment in Hyderabad."
  );
  return `https://wa.me/${WHATSAPP_E164}?text=${text}`;
}

export const SITE = {
  name: "Doctor's Credit",
  domain: "dcredit.in",
  city: "Hyderabad",
  tagline: "Independent direction. Hyderabad care.",
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
