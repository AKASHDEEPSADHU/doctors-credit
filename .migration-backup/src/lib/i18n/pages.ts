import type { Lang } from "./config";

/**
 * Server-only page copy: the footer and the homepage's hand-written text.
 *
 * Deliberately NOT translated yet (still English in every language):
 * data-driven content from lib/ (FAQ answers, treatment cards, patient
 * stories, calculator) and all inner pages. Those carry insurance, Medicare,
 * visa and clinical statements that should be reviewed by a qualified
 * translator before publishing.
 *
 * Not marked server-only so tests can import it; it is only used by server.ts,
 * which is. Keep it out of client components to avoid shipping it in the bundle.
 *
 * Array order matters: the JSX maps these by index, so keep lengths equal
 * across languages (enforced by i18n.test.ts).
 */
export type PagesMessages = {
  footer: {
    explore: string;
    exploreLinks: string[]; // 7, matches EXPLORE order in Footer.tsx
    learn: string;
    learnLinks: string[]; // 7, matches LEARN order
    legal: string;
    legalLinks: string[]; // 7, matches LEGAL order
    promise: string;
    line: string;
    trust: string[]; // 3 lines
    aboutLabel: string;
    about: string;
    importantLabel: string;
    important1: string;
    important2: string;
    medicalLabel: string;
    medical: string;
    cross: string;
    copy: string;
  };
  home: {
    heroAria: string;
    heroLabel: string;
    heroBefore: string;
    heroEm: string;
    heroAfter: string;
    heroLede: string;
    talk: string;
    watchTitle: string;
    watchSub: string;
    heroAlt: string;
    handwrite: string[]; // 3 lines
    capabilitiesAria: string;
    capabilities: { title: string; line: string; text: string }[]; // 6
    stories: { label: string; lines: string[]; liveLede: string; cta: string };
    quality: {
      label: string;
      title: string;
      lede: string;
      lenses: string[]; // 6
      note: string;
      link: string;
    };
    achievements: {
      caption: string;
      imgAlt: string;
      label: string;
      title: string;
      lede: string;
      body: string;
      cta: string;
    };
    treatments: { label: string; title: string; lede: string; all: string };
    regions: { label: string; title: string; lede: string; items: string[] }; // 6
    journey: {
      label: string;
      title: string;
      lede: string;
      rail: { rail: string; body: string }[]; // 7
      full: string;
    };
    value: {
      label: string;
      title: string;
      lede: string;
      lenses: string[]; // 6
      p1: string;
      p2: string;
    };
    returnBand: { label: string; lines: string[]; body: string }; // 2 lines
    faq: { label: string; title: string; all: string };
    finalCta: {
      label: string;
      title: string;
      lede: string;
      achievements: string;
    };
  };
};

const en: PagesMessages = {
  footer: {
    explore: "Explore",
    exploreLinks: [
      "How it works",
      "Treatments",
      "Hospitals",
      "Doctors",
      "Cost calculator",
      "Reality check",
      "India's Medical Achievements",
    ],
    learn: "Learn",
    learnLinks: [
      "Research",
      "Medical travel guide",
      "Patient stories",
      "FAQ",
      "About",
      "Contact",
      "Verify a call",
    ],
    legal: "Legal",
    legalLinks: [
      "Privacy",
      "Terms",
      "Refund policy",
      "Cookies",
      "Partner disclosure",
      "Accessibility",
      "Emergency information",
    ],
    promise:
      "An international planned-care decision and coordination platform helping people understand whether treatment in India may be worth investigating.",
    line: "Better decisions start with better information.",
    trust: [
      "Sometimes India may make sense.",
      "Sometimes it may not.",
      "Either way, you deserve to know.",
    ],
    aboutLabel: "About DCredit",
    about:
      "DCredit is an international planned-care decision and coordination platform. We are not a hospital, physician, insurer, emergency medical service or diagnostic service.",
    importantLabel: "Important",
    important1:
      "Information on this website is educational and for coordination purposes. The $5 initial care conversation is with a DCredit care coordinator, not a clinical assessment, specialist opinion, diagnosis or medical-record review.",
    important2:
      "Treatment decisions should be made with qualified healthcare professionals. Costs, availability, treatment plans, outcomes and travel requirements vary.",
    medicalLabel: "Medical information",
    medical:
      "DCredit does not provide emergency medical care. If you are experiencing an emergency, contact your local emergency services.",
    cross:
      "For cross-border care, consult the healthcare professionals, insurer, public health authority or funding body relevant to your home country before making treatment decisions.",
    copy: "© 2026 Doctor's Credit. All rights reserved.",
  },
  home: {
    heroAria: "Doctor's Credit homepage",
    heroLabel: "World-class care. A brighter tomorrow.",
    heroBefore: "India is a global destination for ",
    heroEm: "life-changing care.",
    heroAfter: "",
    heroLede:
      "Patients anywhere in the world explore India for advanced medical expertise, modern hospitals, compassionate care and outstanding value. We help you decide whether that journey is the right choice for the care you are considering.",
    talk: "Talk to a care coordinator",
    watchTitle: "Watch our story",
    watchSub: "2 minutes",
    heroAlt:
      "Editorial photograph of a relaxed international couple at a historic waterfront in India. Generated imagery, not a photograph of DCredit patients.",
    handwrite: ["“New Treatment", "New Hope", "A Brighter Tomorrow”"],
    capabilitiesAria: "Capabilities found across India healthcare",
    capabilities: [
      {
        title: "World-class",
        line: "Specialists",
        text: "Renowned doctors and centres of excellence",
      },
      {
        title: "Modern",
        line: "Hospitals",
        text: "Advanced technology and global standards",
      },
      {
        title: "Compassionate",
        line: "Care",
        text: "Patients are treated with respect and warmth",
      },
      {
        title: "Greater",
        line: "Value",
        text: "High-quality care with significant cost advantages",
      },
      {
        title: "A smoother",
        line: "Journey",
        text: "Support from planning to your return home",
      },
      {
        title: "Better",
        line: "Tomorrows",
        text: "People return to their lives with renewed hope",
      },
    ],
    stories: {
      label: "Real people. Real journeys.",
      lines: ["Lives changed.", "Futures regained."],
      liveLede: "Patient stories, shared with permission.",
      cta: "Read more patient stories",
    },
    quality: {
      label: "Quality",
      title: "Quality deserves to be investigated.",
      lede: "India is a large and diverse healthcare market. Capabilities vary by hospital, department and physician. That is why provider-level information matters.",
      lenses: [
        "Accreditation",
        "Specialist experience",
        "Technology",
        "Infrastructure",
        "Patient safety",
        "Continuity",
      ],
      note: "DCredit does not assume that every hospital or physician offers the same level of care. Accreditation is useful information, but it is not a guarantee of outcome.",
      link: "How we evaluate providers →",
    },
    achievements: {
      caption:
        "Selected tertiary centres offer advanced diagnostics. Capability is institution-specific.",
      imgAlt:
        "Diagnostic imaging slices illustrating medical technology. Not associated with a named hospital or patient.",
      label: "India's Medical Achievements",
      title: "A healthcare story that goes beyond affordability.",
      lede: "India's medical story includes decades of specialist medicine, complex surgery, transplantation, cancer care, pharmaceuticals, vaccines, medical devices and digital health.",
      body: "India has developed substantial capabilities in complex and specialized care. The right hospital, physician and procedure must still be evaluated individually.",
      cta: "Explore India's Medical Achievements",
    },
    treatments: {
      label: "Treatments",
      title: "Where India's capabilities may be worth exploring.",
      lede: "Different treatments call for different questions. Explore the procedures and specialties people commonly investigate in India.",
      all: "All treatments →",
    },
    regions: {
      label: "International patients",
      title: "Care knows no single border.",
      lede: "People considering treatment in India come from many healthcare systems and many parts of the world. These regions describe who DCredit is written for. They are not patient counts.",
      items: [
        "North America",
        "Europe",
        "Australia",
        "Africa",
        "Middle East",
        "Asia",
      ],
    },
    journey: {
      label: "The journey",
      title: "A structured decision. Not a sales pitch.",
      lede: "You have not already chosen India by starting this conversation. Your first step is a conversation with a DCredit care coordinator.",
      rail: [
        {
          rail: "Understand",
          body: "Share the care you are considering, your general situation, healthcare coverage or funding, timeline and goals. This is a conversation with DCredit, not a diagnosis or medical evaluation.",
        },
        {
          rail: "Explore",
          body: "We help organize the questions that matter before deciding whether India is worth investigating, including information you may later need to gather from clinicians at home.",
        },
        {
          rail: "Compare",
          body: "When enough information is available, we look at what you may need to pay yourself at home: private, public or self-funded care, not a hospital sticker price alone.",
        },
        {
          rail: "Review",
          body: "Hospital capability, technology, accreditation, travel, recovery and continuity of care all belong in the decision, before anyone books a flight.",
        },
        {
          rail: "Decide",
          body: "There is no obligation to travel or to purchase a later coordination service. Sometimes India may make sense. Sometimes it may not. The decision remains yours.",
        },
        {
          rail: "Plan",
          body: "We are building DCredit in stages, starting with the decision itself. Future services may include deeper provider coordination and travel or care support when those offerings become available.",
        },
        {
          rail: "Return home",
          body: "Discharge information, medications, imaging, travel fitness and communication with healthcare professionals at home belong in the plan from the start.",
        },
      ],
      full: "Full 7-step journey",
    },
    value: {
      label: "Total value",
      title: "It is not only about the price.",
      lede: "Cost may be part of the reason someone looks abroad. It should not be the only reason. Cost is one part of total value.",
      lenses: [
        "Expertise",
        "Quality",
        "Technology",
        "Access",
        "Value",
        "Continuity",
      ],
      p1: "A treatment price is only one part of a medical journey. The fuller picture includes healthcare costs at home, treatment cost in India, travel, accommodation, companion costs, recovery time, follow-up and continuity of care.",
      p2: "Sometimes India may offer strong value. Sometimes it may not. The calculator is an estimate only. Savings are not guaranteed.",
    },
    returnBand: {
      label: "Return-home planning",
      lines: [
        "Treatment may happen in India.",
        "Your life continues at home.",
      ],
      body: "Planning does not end when treatment ends. Travel, recovery, follow-up and communication with healthcare professionals at home all matter. DCredit does not itself provide clinical follow-up.",
    },
    faq: { label: "Questions", title: "Asked plainly.", all: "All questions →" },
    finalCta: {
      label: "Your first step is a conversation",
      title: "Could India be worth considering for you?",
      lede: "Start with a conversation. Understand the possibilities. Decide for yourself.",
      achievements: "Explore India's Medical Achievements",
    },
  },
};

const es: PagesMessages = {
  footer: {
    explore: "Explorar",
    exploreLinks: [
      "Cómo funciona",
      "Tratamientos",
      "Hospitales",
      "Médicos",
      "Calculadora de costos",
      "Chequeo de realidad",
      "Logros médicos de la India",
    ],
    learn: "Aprender",
    learnLinks: [
      "Investigación",
      "Guía de viaje médico",
      "Historias de pacientes",
      "Preguntas frecuentes",
      "Nosotros",
      "Contacto",
      "Verificar una llamada",
    ],
    legal: "Legal",
    legalLinks: [
      "Privacidad",
      "Términos",
      "Política de reembolso",
      "Cookies",
      "Divulgación de socios",
      "Accesibilidad",
      "Información de emergencia",
    ],
    promise:
      "Una plataforma internacional de decisión y coordinación de atención planificada que ayuda a las personas a entender si vale la pena investigar un tratamiento en la India.",
    line: "Las mejores decisiones empiezan con mejor información.",
    trust: [
      "A veces la India puede tener sentido.",
      "A veces puede que no.",
      "En cualquier caso, usted merece saberlo.",
    ],
    aboutLabel: "Acerca de DCredit",
    about:
      "DCredit es una plataforma internacional de decisión y coordinación de atención planificada. No somos un hospital, un médico, una aseguradora, un servicio médico de emergencia ni un servicio de diagnóstico.",
    importantLabel: "Importante",
    important1:
      "La información de este sitio web es educativa y tiene fines de coordinación. La conversación inicial de atención de $5 es con un coordinador de atención de DCredit; no es una evaluación clínica, una opinión de especialista, un diagnóstico ni una revisión de historiales médicos.",
    important2:
      "Las decisiones sobre el tratamiento deben tomarse con profesionales de la salud calificados. Los costos, la disponibilidad, los planes de tratamiento, los resultados y los requisitos de viaje varían.",
    medicalLabel: "Información médica",
    medical:
      "DCredit no presta atención médica de emergencia. Si tiene una emergencia, comuníquese con los servicios de emergencia de su localidad.",
    cross:
      "Para la atención transfronteriza, consulte a los profesionales de la salud, la aseguradora, la autoridad de salud pública o la entidad de financiamiento correspondiente a su país de origen antes de tomar decisiones sobre el tratamiento.",
    copy: "© 2026 Doctor's Credit. Todos los derechos reservados.",
  },
  home: {
    heroAria: "Página de inicio de Doctor's Credit",
    heroLabel: "Atención de clase mundial. Un mañana más luminoso.",
    heroBefore: "La India es un destino global para ",
    heroEm: "una atención que cambia vidas.",
    heroAfter: "",
    heroLede:
      "Pacientes de todo el mundo exploran la India en busca de experiencia médica avanzada, hospitales modernos, atención compasiva y un valor sobresaliente. Le ayudamos a decidir si ese viaje es la opción adecuada para la atención que está considerando.",
    talk: "Hablar con un coordinador de atención",
    watchTitle: "Ver nuestra historia",
    watchSub: "2 minutos",
    heroAlt:
      "Fotografía editorial de una pareja internacional relajada en un malecón histórico de la India. Imagen generada, no una fotografía de pacientes de DCredit.",
    handwrite: ["“Nuevo tratamiento", "Nueva esperanza", "Un mañana más luminoso”"],
    capabilitiesAria: "Capacidades presentes en la atención médica de la India",
    capabilities: [
      {
        title: "Especialistas",
        line: "de clase mundial",
        text: "Médicos reconocidos y centros de excelencia",
      },
      {
        title: "Hospitales",
        line: "modernos",
        text: "Tecnología avanzada y estándares globales",
      },
      {
        title: "Atención",
        line: "compasiva",
        text: "Los pacientes son tratados con respeto y calidez",
      },
      {
        title: "Mayor",
        line: "valor",
        text: "Atención de alta calidad con ventajas de costo significativas",
      },
      {
        title: "Un viaje",
        line: "más fluido",
        text: "Apoyo desde la planificación hasta su regreso a casa",
      },
      {
        title: "Mejores",
        line: "mañanas",
        text: "Las personas vuelven a su vida con esperanza renovada",
      },
    ],
    stories: {
      label: "Personas reales. Viajes reales.",
      lines: ["Vidas transformadas.", "Futuros recuperados."],
      liveLede: "Historias de pacientes, compartidas con su permiso.",
      cta: "Leer más historias de pacientes",
    },
    quality: {
      label: "Calidad",
      title: "La calidad merece ser investigada.",
      lede: "La India es un mercado de salud grande y diverso. Las capacidades varían según el hospital, el departamento y el médico. Por eso importa la información a nivel de cada proveedor.",
      lenses: [
        "Acreditación",
        "Experiencia de los especialistas",
        "Tecnología",
        "Infraestructura",
        "Seguridad del paciente",
        "Continuidad",
      ],
      note: "DCredit no asume que todos los hospitales o médicos ofrezcan el mismo nivel de atención. La acreditación es información útil, pero no garantiza un resultado.",
      link: "Cómo evaluamos a los proveedores →",
    },
    achievements: {
      caption:
        "Algunos centros de atención terciaria ofrecen diagnósticos avanzados. La capacidad es específica de cada institución.",
      imgAlt:
        "Cortes de imágenes diagnósticas que ilustran la tecnología médica. Sin relación con un hospital o paciente concreto.",
      label: "Logros médicos de la India",
      title: "Una historia de salud que va más allá de la asequibilidad.",
      lede: "La historia médica de la India incluye décadas de medicina especializada, cirugía compleja, trasplantes, atención del cáncer, productos farmacéuticos, vacunas, dispositivos médicos y salud digital.",
      body: "La India ha desarrollado capacidades considerables en atención compleja y especializada. Aun así, cada hospital, médico y procedimiento debe evaluarse de forma individual.",
      cta: "Explorar los logros médicos de la India",
    },
    treatments: {
      label: "Tratamientos",
      title: "Dónde las capacidades de la India podrían valer la pena explorarse.",
      lede: "Cada tratamiento exige preguntas distintas. Explore los procedimientos y especialidades que las personas suelen investigar en la India.",
      all: "Todos los tratamientos →",
    },
    regions: {
      label: "Pacientes internacionales",
      title: "La atención no conoce una sola frontera.",
      lede: "Las personas que consideran un tratamiento en la India provienen de muchos sistemas de salud y de muchas partes del mundo. Estas regiones describen para quién está escrito DCredit. No son cifras de pacientes.",
      items: [
        "Norteamérica",
        "Europa",
        "Australia",
        "África",
        "Medio Oriente",
        "Asia",
      ],
    },
    journey: {
      label: "El recorrido",
      title: "Una decisión estructurada. No un discurso de ventas.",
      lede: "Al iniciar esta conversación no ha elegido ya la India. Su primer paso es una conversación con un coordinador de atención de DCredit.",
      rail: [
        {
          rail: "Comprender",
          body: "Cuéntenos qué atención está considerando, su situación general, su cobertura o financiamiento de salud, sus plazos y sus objetivos. Es una conversación con DCredit, no un diagnóstico ni una evaluación médica.",
        },
        {
          rail: "Explorar",
          body: "Le ayudamos a ordenar las preguntas importantes antes de decidir si vale la pena investigar la India, incluida la información que más adelante tal vez deba reunir con los profesionales de salud de su país.",
        },
        {
          rail: "Comparar",
          body: "Cuando hay información suficiente, revisamos lo que usted podría tener que pagar por su cuenta en su país: atención privada, pública o autofinanciada, no solo el precio de lista de un hospital.",
        },
        {
          rail: "Revisar",
          body: "La capacidad del hospital, la tecnología, la acreditación, el viaje, la recuperación y la continuidad de la atención forman parte de la decisión, antes de que alguien reserve un vuelo.",
        },
        {
          rail: "Decidir",
          body: "No hay obligación de viajar ni de comprar un servicio de coordinación posterior. A veces la India puede tener sentido. A veces puede que no. La decisión sigue siendo suya.",
        },
        {
          rail: "Planificar",
          body: "Estamos construyendo DCredit por etapas, empezando por la decisión en sí. Los servicios futuros podrían incluir una coordinación más profunda con proveedores y apoyo de viaje o atención cuando esas ofertas estén disponibles.",
        },
        {
          rail: "Regreso a casa",
          body: "La información al alta, los medicamentos, las imágenes, la aptitud para viajar y la comunicación con los profesionales de salud en su país deben formar parte del plan desde el principio.",
        },
      ],
      full: "Recorrido completo de 7 pasos",
    },
    value: {
      label: "Valor total",
      title: "No se trata solo del precio.",
      lede: "El costo puede ser parte del motivo para mirar al extranjero, pero no debería ser el único. El costo es solo una parte del valor total.",
      lenses: [
        "Experiencia",
        "Calidad",
        "Tecnología",
        "Acceso",
        "Valor",
        "Continuidad",
      ],
      p1: "El precio de un tratamiento es solo una parte de un viaje médico. El panorama completo incluye los costos de salud en su país, el costo del tratamiento en la India, el viaje, el alojamiento, los costos del acompañante, el tiempo de recuperación, el seguimiento y la continuidad de la atención.",
      p2: "A veces la India puede ofrecer un buen valor. A veces puede que no. La calculadora es solo una estimación. Los ahorros no están garantizados.",
    },
    returnBand: {
      label: "Planificación del regreso a casa",
      lines: [
        "El tratamiento puede realizarse en la India.",
        "Su vida continúa en casa.",
      ],
      body: "La planificación no termina cuando termina el tratamiento. El viaje, la recuperación, el seguimiento y la comunicación con los profesionales de salud en su país son importantes. DCredit no presta por sí mismo seguimiento clínico.",
    },
    faq: {
      label: "Preguntas",
      title: "Dichas con claridad.",
      all: "Todas las preguntas →",
    },
    finalCta: {
      label: "Su primer paso es una conversación",
      title: "¿Podría valer la pena considerar la India para usted?",
      lede: "Empiece con una conversación. Conozca las posibilidades. Decida usted.",
      achievements: "Explorar los logros médicos de la India",
    },
  },
};

const hi: PagesMessages = {
  footer: {
    explore: "देखें",
    exploreLinks: [
      "यह कैसे काम करता है",
      "उपचार",
      "अस्पताल",
      "डॉक्टर",
      "लागत कैलकुलेटर",
      "रियलिटी चेक",
      "भारत की चिकित्सा उपलब्धियाँ",
    ],
    learn: "जानें",
    learnLinks: [
      "शोध",
      "चिकित्सा यात्रा मार्गदर्शिका",
      "मरीज़ों की कहानियाँ",
      "अक्सर पूछे जाने वाले प्रश्न",
      "हमारे बारे में",
      "संपर्क",
      "कॉल सत्यापित करें",
    ],
    legal: "कानूनी",
    legalLinks: [
      "गोपनीयता",
      "शर्तें",
      "रिफ़ंड नीति",
      "कुकीज़",
      "साझेदार प्रकटीकरण",
      "सुगम्यता",
      "आपातकालीन जानकारी",
    ],
    promise:
      "एक अंतरराष्ट्रीय नियोजित-देखभाल निर्णय और समन्वय मंच, जो लोगों को यह समझने में मदद करता है कि भारत में उपचार की जाँच करना सार्थक हो सकता है या नहीं।",
    line: "बेहतर निर्णय बेहतर जानकारी से शुरू होते हैं।",
    trust: [
      "कभी भारत सही विकल्प हो सकता है।",
      "कभी नहीं भी हो सकता।",
      "दोनों ही स्थितियों में, सही जानकारी पाना आपका अधिकार है।",
    ],
    aboutLabel: "DCredit के बारे में",
    about:
      "DCredit एक अंतरराष्ट्रीय नियोजित-देखभाल निर्णय और समन्वय मंच है। हम कोई अस्पताल, चिकित्सक, बीमाकर्ता, आपातकालीन चिकित्सा सेवा या निदान सेवा नहीं हैं।",
    importantLabel: "महत्वपूर्ण",
    important1:
      "इस वेबसाइट की जानकारी शैक्षिक है और समन्वय के उद्देश्य से दी गई है। $5 की प्रारंभिक देखभाल बातचीत DCredit के केयर कोऑर्डिनेटर के साथ होती है; यह कोई क्लिनिकल आकलन, विशेषज्ञ की राय, निदान या मेडिकल रिकॉर्ड की समीक्षा नहीं है।",
    important2:
      "उपचार संबंधी निर्णय योग्य स्वास्थ्य पेशेवरों के साथ मिलकर लिए जाने चाहिए। लागत, उपलब्धता, उपचार योजनाएँ, परिणाम और यात्रा संबंधी आवश्यकताएँ अलग-अलग होती हैं।",
    medicalLabel: "चिकित्सा जानकारी",
    medical:
      "DCredit आपातकालीन चिकित्सा देखभाल प्रदान नहीं करता। यदि आप किसी आपात स्थिति में हैं, तो अपनी स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
    cross:
      "सीमा-पार देखभाल के लिए, उपचार संबंधी निर्णय लेने से पहले अपने देश के संबंधित स्वास्थ्य पेशेवरों, बीमाकर्ता, सार्वजनिक स्वास्थ्य प्राधिकरण या वित्तपोषण संस्था से परामर्श करें।",
    copy: "© 2026 Doctor's Credit. सर्वाधिकार सुरक्षित।",
  },
  home: {
    heroAria: "Doctor's Credit का होमपेज",
    heroLabel: "विश्व-स्तरीय देखभाल। एक बेहतर कल।",
    heroBefore: "भारत ",
    heroEm: "जीवन बदल देने वाली देखभाल",
    heroAfter: " का एक वैश्विक गंतव्य है।",
    heroLede:
      "दुनिया भर के मरीज़ उन्नत चिकित्सा विशेषज्ञता, आधुनिक अस्पतालों, संवेदनशील देखभाल और उत्कृष्ट मूल्य के लिए भारत को देखते हैं। जिस देखभाल पर आप विचार कर रहे हैं, उसके लिए वह यात्रा सही विकल्प है या नहीं, यह तय करने में हम आपकी मदद करते हैं।",
    talk: "केयर कोऑर्डिनेटर से बात करें",
    watchTitle: "हमारी कहानी देखें",
    watchSub: "2 मिनट",
    heroAlt:
      "भारत में एक ऐतिहासिक जलतट पर निश्चिंत अंतरराष्ट्रीय दंपती की संपादकीय तस्वीर। यह जनरेट की गई छवि है, DCredit के मरीज़ों की तस्वीर नहीं।",
    handwrite: ["“नया उपचार", "नई आशा", "एक बेहतर कल”"],
    capabilitiesAria: "भारत की स्वास्थ्य सेवा में मिलने वाली क्षमताएँ",
    capabilities: [
      {
        title: "विश्व-स्तरीय",
        line: "विशेषज्ञ",
        text: "प्रतिष्ठित चिकित्सक और उत्कृष्टता केंद्र",
      },
      {
        title: "आधुनिक",
        line: "अस्पताल",
        text: "उन्नत तकनीक और वैश्विक मानक",
      },
      {
        title: "संवेदनशील",
        line: "देखभाल",
        text: "मरीज़ों के साथ सम्मान और आत्मीयता से व्यवहार",
      },
      {
        title: "अधिक",
        line: "मूल्य",
        text: "बड़े लागत लाभ के साथ उच्च गुणवत्ता वाली देखभाल",
      },
      {
        title: "एक सहज",
        line: "यात्रा",
        text: "योजना बनाने से लेकर घर लौटने तक सहयोग",
      },
      {
        title: "बेहतर",
        line: "कल",
        text: "लोग नई आशा के साथ अपने जीवन में लौटते हैं",
      },
    ],
    stories: {
      label: "असली लोग। असली यात्राएँ।",
      lines: ["बदली हुई ज़िंदगियाँ।", "फिर से पाया भविष्य।"],
      liveLede: "मरीज़ों की कहानियाँ, उनकी अनुमति से साझा की गई।",
      cta: "मरीज़ों की और कहानियाँ पढ़ें",
    },
    quality: {
      label: "गुणवत्ता",
      title: "गुणवत्ता की जाँच होनी चाहिए।",
      lede: "भारत एक विशाल और विविध स्वास्थ्य सेवा बाज़ार है। क्षमताएँ अस्पताल, विभाग और चिकित्सक के अनुसार अलग-अलग होती हैं। इसीलिए प्रदाता-स्तर की जानकारी मायने रखती है।",
      lenses: [
        "मान्यता (एक्रेडिटेशन)",
        "विशेषज्ञ का अनुभव",
        "तकनीक",
        "बुनियादी ढाँचा",
        "मरीज़ की सुरक्षा",
        "निरंतरता",
      ],
      note: "DCredit यह नहीं मानता कि हर अस्पताल या चिकित्सक एक ही स्तर की देखभाल देता है। मान्यता उपयोगी जानकारी है, लेकिन परिणाम की गारंटी नहीं।",
      link: "हम प्रदाताओं का मूल्यांकन कैसे करते हैं →",
    },
    achievements: {
      caption:
        "चुनिंदा तृतीयक देखभाल केंद्र उन्नत जाँच सुविधाएँ देते हैं। क्षमता संस्था-विशेष होती है।",
      imgAlt:
        "चिकित्सा तकनीक को दर्शाते डायग्नोस्टिक इमेजिंग स्लाइस। किसी नामित अस्पताल या मरीज़ से संबंधित नहीं।",
      label: "भारत की चिकित्सा उपलब्धियाँ",
      title: "ऐसी स्वास्थ्य कहानी जो किफ़ायत से कहीं आगे जाती है।",
      lede: "भारत की चिकित्सा कहानी में विशेषज्ञ चिकित्सा, जटिल सर्जरी, प्रत्यारोपण, कैंसर देखभाल, दवा निर्माण, टीके, चिकित्सा उपकरण और डिजिटल स्वास्थ्य के दशक शामिल हैं।",
      body: "भारत ने जटिल और विशेषीकृत देखभाल में उल्लेखनीय क्षमताएँ विकसित की हैं। फिर भी सही अस्पताल, चिकित्सक और प्रक्रिया का मूल्यांकन व्यक्तिगत रूप से करना ज़रूरी है।",
      cta: "भारत की चिकित्सा उपलब्धियाँ देखें",
    },
    treatments: {
      label: "उपचार",
      title: "जहाँ भारत की क्षमताएँ तलाशने लायक हो सकती हैं।",
      lede: "अलग-अलग उपचारों के लिए अलग-अलग सवाल ज़रूरी होते हैं। वे प्रक्रियाएँ और विशेषज्ञताएँ देखें जिनके बारे में लोग आम तौर पर भारत में जानकारी लेते हैं।",
      all: "सभी उपचार →",
    },
    regions: {
      label: "अंतरराष्ट्रीय मरीज़",
      title: "देखभाल किसी एक सीमा को नहीं मानती।",
      lede: "भारत में उपचार पर विचार करने वाले लोग कई स्वास्थ्य प्रणालियों और दुनिया के कई हिस्सों से आते हैं। ये क्षेत्र बताते हैं कि DCredit किनके लिए लिखा गया है। ये मरीज़ों की संख्या नहीं हैं।",
      items: [
        "उत्तरी अमेरिका",
        "यूरोप",
        "ऑस्ट्रेलिया",
        "अफ़्रीका",
        "मध्य पूर्व",
        "एशिया",
      ],
    },
    journey: {
      label: "यात्रा",
      title: "एक सुविचारित निर्णय। बिक्री का दबाव नहीं।",
      lede: "इस बातचीत को शुरू करने का मतलब यह नहीं कि आपने भारत को चुन लिया है। आपका पहला कदम DCredit के केयर कोऑर्डिनेटर से बातचीत है।",
      rail: [
        {
          rail: "समझें",
          body: "आप किस देखभाल पर विचार कर रहे हैं, आपकी सामान्य स्थिति, स्वास्थ्य कवरेज या वित्तपोषण, समय-सीमा और लक्ष्य साझा करें। यह DCredit के साथ बातचीत है, कोई निदान या चिकित्सा मूल्यांकन नहीं।",
        },
        {
          rail: "तलाशें",
          body: "भारत की जाँच करना सार्थक है या नहीं, यह तय करने से पहले हम ज़रूरी सवालों को व्यवस्थित करने में मदद करते हैं, जिसमें वह जानकारी भी शामिल है जो आपको बाद में अपने देश के चिकित्सकों से जुटानी पड़ सकती है।",
        },
        {
          rail: "तुलना करें",
          body: "जब पर्याप्त जानकारी हो जाती है, तो हम देखते हैं कि अपने देश में आपको अपनी जेब से कितना देना पड़ सकता है: निजी, सार्वजनिक या स्वयं-वित्तपोषित देखभाल, सिर्फ़ अस्पताल की सूचीबद्ध कीमत नहीं।",
        },
        {
          rail: "समीक्षा करें",
          body: "अस्पताल की क्षमता, तकनीक, मान्यता, यात्रा, स्वास्थ्य-लाभ और देखभाल की निरंतरता, ये सब निर्णय का हिस्सा हैं, किसी के फ़्लाइट बुक करने से पहले।",
        },
        {
          rail: "निर्णय लें",
          body: "यात्रा करने या बाद की कोई समन्वय सेवा खरीदने की कोई बाध्यता नहीं है। कभी भारत सही हो सकता है। कभी नहीं भी। निर्णय आपका ही रहता है।",
        },
        {
          rail: "योजना बनाएँ",
          body: "हम DCredit को चरणों में बना रहे हैं, शुरुआत निर्णय से। भविष्य की सेवाओं में प्रदाताओं के साथ गहरा समन्वय और यात्रा या देखभाल सहायता शामिल हो सकती है, जब ये सुविधाएँ उपलब्ध होंगी।",
        },
        {
          rail: "घर वापसी",
          body: "डिस्चार्ज की जानकारी, दवाइयाँ, इमेजिंग, यात्रा की उपयुक्तता और अपने देश के स्वास्थ्य पेशेवरों से संवाद, इन सबको शुरू से ही योजना में रखना चाहिए।",
        },
      ],
      full: "पूरी 7-चरणीय यात्रा",
    },
    value: {
      label: "कुल मूल्य",
      title: "बात सिर्फ़ कीमत की नहीं है।",
      lede: "लागत किसी के विदेश में देखने का एक कारण हो सकती है, लेकिन अकेला कारण नहीं होनी चाहिए। लागत कुल मूल्य का सिर्फ़ एक हिस्सा है।",
      lenses: ["विशेषज्ञता", "गुणवत्ता", "तकनीक", "पहुँच", "मूल्य", "निरंतरता"],
      p1: "उपचार की कीमत किसी चिकित्सा यात्रा का सिर्फ़ एक हिस्सा है। पूरी तस्वीर में अपने देश में स्वास्थ्य सेवा की लागत, भारत में उपचार की लागत, यात्रा, ठहरना, साथ जाने वाले व्यक्ति का खर्च, स्वास्थ्य-लाभ का समय, फ़ॉलो-अप और देखभाल की निरंतरता शामिल हैं।",
      p2: "कभी भारत में अच्छा मूल्य मिल सकता है। कभी नहीं भी। कैलकुलेटर सिर्फ़ एक अनुमान है। बचत की कोई गारंटी नहीं है।",
    },
    returnBand: {
      label: "घर वापसी की योजना",
      lines: ["उपचार भारत में हो सकता है।", "आपकी ज़िंदगी घर पर जारी रहती है।"],
      body: "उपचार खत्म होने के साथ योजना खत्म नहीं होती। यात्रा, स्वास्थ्य-लाभ, फ़ॉलो-अप और अपने देश के स्वास्थ्य पेशेवरों से संवाद, सब मायने रखते हैं। DCredit स्वयं क्लिनिकल फ़ॉलो-अप प्रदान नहीं करता।",
    },
    faq: { label: "सवाल", title: "सीधे शब्दों में पूछे गए।", all: "सभी सवाल →" },
    finalCta: {
      label: "आपका पहला कदम एक बातचीत है",
      title: "क्या आपके लिए भारत पर विचार करना सार्थक हो सकता है?",
      lede: "बातचीत से शुरुआत करें। संभावनाओं को समझें। फ़ैसला खुद करें।",
      achievements: "भारत की चिकित्सा उपलब्धियाँ देखें",
    },
  },
};

export const PAGES: Record<Lang, PagesMessages> = { en, es, hi };
