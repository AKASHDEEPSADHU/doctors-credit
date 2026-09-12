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
      "Hello — I would like a $5 DCredit care assessment to understand whether planned treatment in India may make sense for me."
  );
  return `https://wa.me/${WHATSAPP_E164}?text=${text}`;
}

export const SITE = {
  name: "Doctor's Credit",
  short: "DCredit",
  domain: "dcredit.in",
  city: "Hyderabad",
  tagline: "Know your options before you decide.",
  promise: "We help you understand whether treatment in India makes sense for YOU.",
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
  "DCredit is a healthcare coordination and information platform. We are not a hospital, physician, insurer or emergency medical service. Information provided through this website is for educational and coordination purposes and does not constitute medical advice, diagnosis or treatment. Treatment decisions must be made between you and qualified healthcare professionals. Costs, availability, treatment plans, outcomes and travel requirements vary by patient and provider. No medical outcome or savings are guaranteed. Always consult your US healthcare provider and insurance company before making decisions about international medical treatment.";
