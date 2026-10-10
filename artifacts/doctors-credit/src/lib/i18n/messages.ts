import type { Lang } from './config';

/**
 * All page copy, one object per language. Every language is bundled so the
 * switch is instant. Keep the shape identical across languages; the type
 * below makes TypeScript enforce that.
 *
 * Copy rules: no em dashes, no guaranteed-outcome language.
 */
export type Messages = {
  emergencyBar: string;
  skip: string;
  language: { label: string; change: string };
  nav: { primary: string; cta: string };
  hero: {
    label: string;
    before: string;
    em: string;
    after: string;
    lede: string;
    cta: string;
  };
  whatsapp: {
    label: string;
    aria: string;
    privacyNote: string;
    /** Pre-filled into the WhatsApp chat, so visitors message in their language. */
    greeting: string;
  };
};

const en: Messages = {
  emergencyBar:
    'DCredit does not handle medical emergencies. Use your local emergency number. In the United States, call 911.',
  skip: 'Skip to content',
  language: { label: 'Language', change: 'Change language' },
  nav: { primary: 'Primary', cta: 'Talk to a care coordinator' },
  hero: {
    label: 'World-class care. A brighter tomorrow.',
    before: 'India is a global destination for ',
    em: 'life-changing care.',
    after: '',
    lede: 'Patients anywhere in the world explore India for advanced medical expertise, modern hospitals, compassionate care and outstanding value. We help you decide whether that journey is the right choice for the care you are considering.',
    cta: 'Talk to a care coordinator',
  },
  whatsapp: {
    label: 'Chat on WhatsApp',
    aria: "Chat with Doctor's Credit on WhatsApp (opens in a new tab)",
    privacyNote:
      'Please do not send medical records or other sensitive clinical documents through WhatsApp.',
    greeting:
      'Hi, I would like to learn more about your services. I understand I should not send medical records or other sensitive documents through WhatsApp.',
  },
};

const es: Messages = {
  emergencyBar:
    'DCredit no atiende emergencias médicas. Use el número de emergencias de su localidad. En Estados Unidos, llame al 911.',
  skip: 'Ir al contenido',
  language: { label: 'Idioma', change: 'Cambiar idioma' },
  nav: { primary: 'Principal', cta: 'Hablar con un coordinador' },
  hero: {
    label: 'Atención de clase mundial. Un mañana más luminoso.',
    before: 'La India es un destino global para ',
    em: 'una atención que cambia vidas.',
    after: '',
    lede: 'Pacientes de todo el mundo exploran la India en busca de experiencia médica avanzada, hospitales modernos, atención compasiva y un valor sobresaliente. Le ayudamos a decidir si ese viaje es la opción adecuada para la atención que está considerando.',
    cta: 'Hablar con un coordinador de atención',
  },
  whatsapp: {
    label: 'Escríbanos por WhatsApp',
    aria: "Chatear con Doctor's Credit por WhatsApp (se abre en una pestaña nueva)",
    privacyNote:
      'Por favor, no envíe historiales médicos ni otros documentos clínicos sensibles por WhatsApp.',
    greeting:
      'Hola, me gustaría saber más sobre sus servicios. Entiendo que no debo enviar historiales médicos ni otros documentos sensibles por WhatsApp.',
  },
};

const hi: Messages = {
  emergencyBar:
    'DCredit चिकित्सा आपात स्थितियों को नहीं संभालता। अपने स्थानीय आपातकालीन नंबर का उपयोग करें। संयुक्त राज्य अमेरिका में 911 पर कॉल करें।',
  skip: 'मुख्य सामग्री पर जाएँ',
  language: { label: 'भाषा', change: 'भाषा बदलें' },
  nav: { primary: 'मुख्य', cta: 'केयर कोऑर्डिनेटर से बात करें' },
  hero: {
    label: 'विश्व-स्तरीय देखभाल। एक बेहतर कल।',
    before: 'भारत ',
    em: 'जीवन बदल देने वाली देखभाल',
    after: ' का एक वैश्विक गंतव्य है।',
    lede: 'दुनिया भर के मरीज़ उन्नत चिकित्सा विशेषज्ञता, आधुनिक अस्पतालों, संवेदनशील देखभाल और उत्कृष्ट मूल्य के लिए भारत को देखते हैं। जिस देखभाल पर आप विचार कर रहे हैं, उसके लिए वह यात्रा सही विकल्प है या नहीं, यह तय करने में हम आपकी मदद करते हैं।',
    cta: 'केयर कोऑर्डिनेटर से बात करें',
  },
  whatsapp: {
    label: 'WhatsApp पर चैट करें',
    aria: 'Doctor\'s Credit से WhatsApp पर चैट करें (नए टैब में खुलता है)',
    privacyNote:
      'कृपया WhatsApp के माध्यम से मेडिकल रिकॉर्ड या अन्य संवेदनशील क्लिनिकल दस्तावेज़ न भेजें।',
    greeting:
      'नमस्ते, मुझे आपकी सेवाओं के बारे में अधिक जानकारी चाहिए। मुझे पता है कि WhatsApp पर मेडिकल रिकॉर्ड या अन्य संवेदनशील दस्तावेज़ नहीं भेजने चाहिए।',
  },
};

export const MESSAGES: Record<Lang, Messages> = { en, es, hi };
