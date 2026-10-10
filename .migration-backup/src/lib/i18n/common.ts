import type { Lang } from "./config";

/**
 * Strings needed by client components (nav, cookie banner, WhatsApp button,
 * language selector) plus the emergency bar. Kept small on purpose: every
 * language is bundled so the switch is instant. Page-level copy lives in
 * `pages.ts`, which is server-only.
 *
 * Content rules (docs/dcredit-content-language.md) apply to every language:
 * no em dashes, no guaranteed-outcome language, no blanket "best" claims.
 */
export type CommonMessages = {
  emergencyBar: string;
  skip: string;
  nav: {
    primary: string;
    howItWorks: string;
    treatments: string;
    hospitals: string;
    costCalculator: string;
    research: string;
    stories: string;
    about: string;
    cta: string;
    signIn: string;
    myAccount: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
  };
  language: { label: string; change: string };
  cookie: { aria: string; text: string; button: string };
  whatsapp: {
    label: string;
    aria: string;
    privacyNote: string;
    greeting: string;
  };
};

const en: CommonMessages = {
  emergencyBar:
    "DCredit does not handle medical emergencies. Use your local emergency number. In the United States, call 911.",
  skip: "Skip to content",
  nav: {
    primary: "Primary",
    howItWorks: "How it works",
    treatments: "Treatments",
    hospitals: "Hospitals",
    costCalculator: "Cost calculator",
    research: "Research",
    stories: "Patient stories",
    about: "About",
    cta: "Talk to a care coordinator",
    signIn: "Sign in",
    myAccount: "My Account",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
  },
  language: { label: "Language", change: "Change language" },
  cookie: {
    aria: "Cookies",
    text: "We use essential cookies to keep your signed-in file secure and to remember your language. Analytics cookies, if enabled later, will be described on the cookies page.",
    button: "Continue",
  },
  whatsapp: {
    label: "Chat on WhatsApp",
    aria: "Chat with Doctor's Credit on WhatsApp (opens in a new tab)",
    privacyNote:
      "Please do not send medical records or other sensitive clinical documents through WhatsApp.",
    greeting:
      "Hi, I would like to learn more about your services. I understand I should not send medical records or other sensitive documents through WhatsApp.",
  },
};

const es: CommonMessages = {
  emergencyBar:
    "DCredit no atiende emergencias médicas. Use el número de emergencias de su localidad. En Estados Unidos, llame al 911.",
  skip: "Ir al contenido",
  nav: {
    primary: "Principal",
    howItWorks: "Cómo funciona",
    treatments: "Tratamientos",
    hospitals: "Hospitales",
    costCalculator: "Calculadora",
    research: "Investigación",
    stories: "Historias",
    about: "Nosotros",
    cta: "Hablar con un coordinador",
    signIn: "Acceder",
    myAccount: "Mi cuenta",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menu: "Menú",
  },
  language: { label: "Idioma", change: "Cambiar idioma" },
  cookie: {
    aria: "Cookies",
    text: "Usamos cookies esenciales para mantener segura su cuenta con la sesión iniciada y para recordar su idioma. Si más adelante se activan cookies de analítica, se describirán en la página de cookies.",
    button: "Continuar",
  },
  whatsapp: {
    label: "Escríbanos por WhatsApp",
    aria: "Chatear con Doctor's Credit por WhatsApp (se abre en una pestaña nueva)",
    privacyNote:
      "Por favor, no envíe historiales médicos ni otros documentos clínicos sensibles por WhatsApp.",
    greeting:
      "Hola, me gustaría saber más sobre sus servicios. Entiendo que no debo enviar historiales médicos ni otros documentos sensibles por WhatsApp.",
  },
};

const hi: CommonMessages = {
  emergencyBar:
    "DCredit चिकित्सा आपात स्थितियों को नहीं संभालता। अपने स्थानीय आपातकालीन नंबर का उपयोग करें। संयुक्त राज्य अमेरिका में 911 पर कॉल करें।",
  skip: "मुख्य सामग्री पर जाएँ",
  nav: {
    primary: "मुख्य",
    howItWorks: "यह कैसे काम करता है",
    treatments: "उपचार",
    hospitals: "अस्पताल",
    costCalculator: "लागत कैलकुलेटर",
    research: "शोध",
    stories: "मरीज़ों की कहानियाँ",
    about: "हमारे बारे में",
    cta: "केयर कोऑर्डिनेटर से बात करें",
    signIn: "साइन इन",
    myAccount: "मेरा खाता",
    openMenu: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
    menu: "मेनू",
  },
  language: { label: "भाषा", change: "भाषा बदलें" },
  cookie: {
    aria: "कुकीज़",
    text: "हम आपके साइन-इन किए गए खाते को सुरक्षित रखने और आपकी भाषा याद रखने के लिए आवश्यक कुकीज़ का उपयोग करते हैं। यदि बाद में एनालिटिक्स कुकीज़ चालू की गईं, तो उनका विवरण कुकीज़ पेज पर दिया जाएगा।",
    button: "जारी रखें",
  },
  whatsapp: {
    label: "WhatsApp पर चैट करें",
    aria: "Doctor's Credit से WhatsApp पर चैट करें (नए टैब में खुलता है)",
    privacyNote:
      "कृपया WhatsApp के माध्यम से मेडिकल रिकॉर्ड या अन्य संवेदनशील क्लिनिकल दस्तावेज़ न भेजें।",
    greeting:
      "नमस्ते, मुझे आपकी सेवाओं के बारे में अधिक जानकारी चाहिए। मुझे पता है कि WhatsApp पर मेडिकल रिकॉर्ड या अन्य संवेदनशील दस्तावेज़ नहीं भेजने चाहिए।",
  },
};

export const COMMON: Record<Lang, CommonMessages> = { en, es, hi };
