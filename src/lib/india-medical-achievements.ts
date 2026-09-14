export type LegacySourceGroup =
  | "Government of India"
  | "ICMR / NIV"
  | "AIIMS"
  | "NOTTO"
  | "NABH"
  | "Peer-reviewed medical literature"
  | "Hospital/institutional sources";

export type LibraryGroup =
  | "Government"
  | "Peer-reviewed"
  | "Institutional"
  | "Quality / Accreditation"
  | "Digital Health";

export type SourceBadge =
  | "Government"
  | "Peer-reviewed"
  | "Institutional"
  | "Provider-reported"
  | "Verified";

export type AchievementSource = {
  id: string;
  label: string;
  title: string;
  href: string;
  group: LegacySourceGroup;
  libraryGroup: LibraryGroup;
  publisher: string;
  year: string;
  verified: string;
  badge: SourceBadge;
  note?: string;
};

const VERIFIED = "September 2026";

export const ACHIEVEMENT_SOURCES: AchievementSource[] = [
  {
    id: "pib-medical-arrivals-2025",
    label:
      "Government of India, Press Information Bureau: foreign nationals arriving for medical treatment, 2025",
    title: "Foreign nationals arriving for medical treatment, 2025",
    href: "https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=158426&lang=1&reg=3",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Press Information Bureau, Government of India",
    year: "2025",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "pib-transplants-2025",
    label: "Government of India, Press Information Bureau: organ transplantation update, 2025",
    title: "Organ transplantation update, 2025",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231563&lang=2&reg=3",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Press Information Bureau, Government of India",
    year: "2025",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "pib-vaccines",
    label: "Government of India, Press Information Bureau: vaccine manufacturing",
    title: "Vaccine manufacturing capacity",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241066&lang=1&reg=3",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Press Information Bureau, Government of India",
    year: "2025",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "pib-pharma",
    label: "Government of India, Press Information Bureau: pharmaceutical industry and exports",
    title: "Pharmaceutical industry and exports",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234141&lang=2&reg=3",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Press Information Bureau, Government of India",
    year: "2025",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "pib-abdm-2026",
    label:
      "Government of India, Press Information Bureau: Ayushman Bharat Digital Mission status, 20 July 2026",
    title: "Ayushman Bharat Digital Mission status, 20 July 2026",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2288848&lang=1&reg=48",
    group: "Government of India",
    libraryGroup: "Digital Health",
    publisher: "Press Information Bureau, Government of India",
    year: "2026",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "pib-usfda-plants",
    label:
      "Government of India, Press Information Bureau: USFDA-approved pharmaceutical plants outside the United States",
    title: "USFDA-approved pharmaceutical plants outside the United States",
    href: "https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=157889&id=157889&lang=2&reg=3",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Press Information Bureau, Government of India",
    year: "2025",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "pib-tandem-asct-2026",
    label:
      "Government of India, Press Information Bureau: tandem autologous stem-cell transplant, February 2026",
    title: "Tandem autologous stem-cell transplant, February 2026",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231557&lang=2&reg=48",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Press Information Bureau, Government of India",
    year: "2026",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "notto-annual-2025-26",
    label: "Ministry of Health and Family Welfare / NOTTO: annual report 2025-2026",
    title: "NOTTO annual report 2025-2026",
    href: "https://notto.mohfw.gov.in/WriteReadData/Portal/News/951_1_Annual_Report_of_the_MoH_FW__2025_-_2026.pdf",
    group: "NOTTO",
    libraryGroup: "Government",
    publisher: "Ministry of Health and Family Welfare / NOTTO",
    year: "2026",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "notto-home",
    label: "National Organ and Tissue Transplant Organization",
    title: "National Organ and Tissue Transplant Organization",
    href: "https://notto.mohfw.gov.in/",
    group: "NOTTO",
    libraryGroup: "Government",
    publisher: "National Organ and Tissue Transplant Organization",
    year: "2026",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "abdm-hpr",
    label: "Ayushman Bharat Digital Mission: Healthcare Professionals Registry",
    title: "Healthcare Professionals Registry",
    href: "https://abdm.gov.in/healthcare-professionals",
    group: "Government of India",
    libraryGroup: "Digital Health",
    publisher: "Ayushman Bharat Digital Mission",
    year: "2026",
    verified: VERIFIED,
    badge: "Government",
  },
  {
    id: "nabh-find",
    label:
      "National Accreditation Board for Hospitals & Healthcare Providers: find a healthcare organisation",
    title: "Find a healthcare organisation",
    href: "https://nabh.co/find-a-healthcare-organisation/",
    group: "NABH",
    libraryGroup: "Quality / Accreditation",
    publisher: "National Accreditation Board for Hospitals & Healthcare Providers",
    year: "2026",
    verified: VERIFIED,
    badge: "Verified",
  },
  {
    id: "niv-covaxin",
    label: "ICMR-National Institute of Virology: Covaxin development role",
    title: "Covaxin development role",
    href: "https://niv.icmr.org.in/show_content.php?lang=1&level=1&lid=2&ls_id=223&page=221",
    group: "ICMR / NIV",
    libraryGroup: "Institutional",
    publisher: "ICMR-National Institute of Virology",
    year: "2021",
    verified: VERIFIED,
    badge: "Institutional",
  },
  {
    id: "pmc-gopinath-1961",
    label:
      "Peer-reviewed account of open-heart surgery at Christian Medical College, Vellore, 1961",
    title: "Open-heart surgery at CMC Vellore, 1961",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5963231/",
    group: "Peer-reviewed medical literature",
    libraryGroup: "Peer-reviewed",
    publisher: "PubMed Central / peer-reviewed literature",
    year: "1961",
    verified: VERIFIED,
    badge: "Peer-reviewed",
  },
  {
    id: "ijn-kidney-1971",
    label: "Indian Journal of Nephrology: kidney transplantation in India",
    title: "Kidney transplantation in India",
    href: "https://indianjnephrol.org/kidney-transplantation-in-indiapast-present-and-future/",
    group: "Peer-reviewed medical literature",
    libraryGroup: "Peer-reviewed",
    publisher: "Indian Journal of Nephrology",
    year: "1971",
    verified: VERIFIED,
    badge: "Peer-reviewed",
  },
  {
    id: "aiims-patient-care",
    label: "All India Institute of Medical Sciences, New Delhi: patient care",
    title: "AIIMS New Delhi patient care",
    href: "https://www.aiims.edu/index.php/en/patient-care",
    group: "AIIMS",
    libraryGroup: "Institutional",
    publisher: "All India Institute of Medical Sciences, New Delhi",
    year: "1994",
    verified: VERIFIED,
    badge: "Institutional",
  },
  {
    id: "apollo-transplant-milestones",
    label: "Apollo Hospitals: transplantation milestones",
    title: "Transplantation milestones",
    href: "https://www.apollohospitals.com/departments/transplantation/our-milestones",
    group: "Hospital/institutional sources",
    libraryGroup: "Institutional",
    publisher: "Apollo Hospitals",
    year: "1998",
    verified: VERIFIED,
    badge: "Provider-reported",
    note: "Hospital-reported milestone",
  },
  {
    id: "apollo-robotic-urology",
    label: "Apollo Hospitals: robotic urology in India",
    title: "Robotic urology in India",
    href: "https://www.apollohospitals.com/corporate/patient-care/health-and-lifestyle/our-doctors-talk/robotic-urology-in-india/",
    group: "Hospital/institutional sources",
    libraryGroup: "Institutional",
    publisher: "Apollo Hospitals",
    year: "2006",
    verified: VERIFIED,
    badge: "Provider-reported",
    note: "Hospital/institutional account",
  },
  {
    id: "apollo-proton-2019",
    label: "Apollo Hospitals: Apollo Proton Cancer Centre inauguration, 2019",
    title: "Apollo Proton Cancer Centre inauguration, 2019",
    href: "https://www.apollohospitals.com/corporate/apollo-in-the-news/apollo-hospitals-inaugurated-the-apollo-proton-cancer-centre-south-east-asia-s-first-proton-therapy/",
    group: "Hospital/institutional sources",
    libraryGroup: "Institutional",
    publisher: "Apollo Hospitals",
    year: "2019",
    verified: VERIFIED,
    badge: "Provider-reported",
    note: "Hospital-reported milestone",
  },
  {
    id: "sctimst",
    label: "Sree Chitra Tirunal Institute for Medical Sciences and Technology",
    title: "Sree Chitra Tirunal Institute for Medical Sciences and Technology",
    href: "https://www.sctimst.ac.in/",
    group: "Hospital/institutional sources",
    libraryGroup: "Institutional",
    publisher: "Sree Chitra Tirunal Institute for Medical Sciences and Technology",
    year: "2026",
    verified: VERIFIED,
    badge: "Institutional",
  },
  {
    id: "dst-chitra-valve",
    label:
      "Department of Science & Technology: Sree Chitra heart valve as frugal medical innovation",
    title: "Sree Chitra heart valve as frugal medical innovation",
    href: "https://dst.gov.in/node/7586",
    group: "Government of India",
    libraryGroup: "Government",
    publisher: "Department of Science and Technology, Government of India",
    year: "2026",
    verified: VERIFIED,
    badge: "Government",
  },
];

export function sourceById(id: string) {
  const source = ACHIEVEMENT_SOURCES.find((item) => item.id === id);
  if (!source) throw new Error(`Unknown achievement source: ${id}`);
  return source;
}

export const SOURCE_GROUPS = [
  "Government of India",
  "ICMR / NIV",
  "AIIMS",
  "NOTTO",
  "NABH",
  "Peer-reviewed medical literature",
  "Hospital/institutional sources",
] as const;

export const LIBRARY_GROUPS: LibraryGroup[] = [
  "Government",
  "Peer-reviewed",
  "Institutional",
  "Quality / Accreditation",
  "Digital Health",
];

export const GLANCE_STATS = [
  {
    id: "arrivals",
    featured: true,
    display: "500,000+",
    numeric: 500000,
    prefix: "",
    suffix: "+",
    label: "Foreign nationals arriving in India specifically for medical treatment in 2025.",
    sourceId: "pib-medical-arrivals-2025",
  },
  {
    id: "transplants",
    featured: false,
    display: "~20,000",
    numeric: 20000,
    prefix: "~",
    suffix: "",
    label: "Organ transplants performed in India in 2025.",
    sourceId: "pib-transplants-2025",
  },
  {
    id: "vaccines",
    featured: false,
    display: "~60%",
    numeric: 60,
    prefix: "~",
    suffix: "%",
    label: "Approximate share of global vaccine production by volume.",
    sourceId: "pib-vaccines",
  },
  {
    id: "generics",
    featured: false,
    display: "~20%",
    numeric: 20,
    prefix: "~",
    suffix: "%",
    label: "Approximate share of the world's generic medicines supplied by India.",
    sourceId: "pib-pharma",
  },
  {
    id: "abha",
    featured: false,
    display: "94.87 crore",
    numeric: 94.87,
    prefix: "",
    suffix: " crore",
    label: "ABHA digital health IDs reported by 20 July 2026.",
    sourceId: "pib-abdm-2026",
  },
  {
    id: "usfda",
    featured: false,
    display: "Global footprint",
    numeric: null,
    prefix: "",
    suffix: "",
    label:
      "Highest number of USFDA-approved pharmaceutical manufacturing plants outside the United States.",
    sourceId: "pib-usfda-plants",
  },
] as const;

export const TIMELINE_CHAPTERS = [
  {
    year: "1961",
    title: "Open-heart surgery",
    image: "/images/editorial/innovation-laboratory.jpg",
    imagePosition: "48% 40%",
    imageKind: "Representative image",
    lead: "In May 1961, Dr. N. Gopinath and his team at Christian Medical College, Vellore, performed an open-heart operation using a pump-oxygenator to close a ventricular septal defect.",
    body: "This was a landmark in the development of open-heart surgery in India and illustrates the development of the specialist surgical infrastructure required for complex cardiac care.",
    why: "The development of open-heart surgery required specialist surgical teams, cardiopulmonary bypass capability, anesthesia and supporting hospital infrastructure.",
    sourceId: "pmc-gopinath-1961",
  },
  {
    year: "1971",
    title: "Kidney transplantation",
    image: "/images/editorial/innovation-imaging.jpg",
    imagePosition: "50% 42%",
    imageKind: "Representative image",
    lead: "The first successful kidney transplant in India was performed at Christian Medical College, Vellore, on 2 February 1971.",
    body: "The milestone marked the beginning of sustained development of kidney-transplant programs across India.",
    why: "Kidney transplantation helped establish a foundation for the development of transplant medicine in India.",
    sourceId: "ijn-kidney-1971",
  },
  {
    year: "1994",
    title: "Heart transplantation",
    image: "/images/editorial/innovation-imaging.jpg",
    imagePosition: "28% 20%",
    imageKind: "Representative image",
    lead: "On 3 August 1994, AIIMS New Delhi performed India's first successful heart transplant.",
    body: "Heart transplantation requires much more than an operation. It depends on transplant medicine, intensive care, immunosuppression, organ procurement, tissue matching and long-term follow-up. This milestone does not mean that all cardiac programs in India later developed equivalent capabilities.",
    why: "A transplant program depends on more than an operation.",
    chips: [
      "Organ procurement",
      "Transplant medicine",
      "Intensive care",
      "Immunosuppression",
      "Long-term follow-up",
    ],
    sourceId: "aiims-patient-care",
  },
  {
    year: "1998",
    title: "Liver transplantation",
    image: "/images/editorial/innovation-laboratory.jpg",
    imagePosition: "70% 55%",
    imageKind: "Representative image",
    lead: "Apollo Hospitals reports that India's first successful pediatric and adult liver transplant procedures were performed at Indraprastha Apollo Hospitals in New Delhi in 1998.",
    body: "Liver transplantation represents highly multidisciplinary care involving hepatology, transplant surgery, anesthesia, intensive care, infectious disease management and long-term follow-up.",
    why: "This is a hospital-reported milestone. It should not be read as a nationwide claim.",
    sourceId: "apollo-transplant-milestones",
  },
  {
    year: "2006",
    title: "Robotic surgery enters Indian practice",
    image: "/images/editorial/innovation-imaging.jpg",
    imagePosition: "62% 48%",
    imageKind: "Representative image",
    lead: "Institutional accounts describe the introduction of robotic-assisted surgery in India, including a successful robotic radical prostatectomy at AIIMS in 2006.",
    body: "Robotic surgery subsequently expanded into specialties such as urology, gynecology, thoracic surgery, cardiac surgery and others. Robotic surgery does not mean a robot performs surgery independently. The surgeon controls the robotic system.",
    why: "The surgeon remains in control of the robotic system.",
    flow: ["Surgeon", "Robotic system", "Precision instruments"],
    sourceId: "apollo-robotic-urology",
  },
  {
    year: "2019",
    title: "Proton therapy",
    image: "/images/editorial/innovation-imaging.jpg",
    imagePosition: "40% 30%",
    imageKind: "Representative image",
    lead: "Apollo Proton Cancer Centre in Chennai became India's first proton therapy centre, with the facility inaugurated in 2019.",
    body: "Proton therapy is an advanced form of radiation treatment that can be useful in selected cancers where limiting radiation exposure to surrounding tissues is important. That does not mean proton therapy is automatically better than other radiation treatments.",
    why: "Useful in selected cases. Not automatically superior for every cancer.",
    flow: ["Proton therapy", "Targeted radiation", "Selected patients"],
    sourceId: "apollo-proton-2019",
  },
  {
    year: "2026",
    title: "Specialized care continues to evolve",
    image: "/images/editorial/innovation-laboratory.jpg",
    imagePosition: "35% 25%",
    imageKind: "Representative image",
    lead: "In February 2026, the Government of India reported a first-in-India tandem autologous stem-cell transplant for a rare pediatric brain tumor at Homi Bhabha Cancer Hospital and Research Centre, a Tata Memorial Centre unit.",
    body: "This illustrates that Indian tertiary-care medicine continues to expand into highly specialized and technically demanding areas. It is an institution-specific development, not a statement about every cancer centre.",
    why: "The story is still being written.",
    sourceId: "pib-tandem-asct-2026",
  },
] as const;

export const DEVICE_EXAMPLES = [
  "Artificial heart valves",
  "Blood bags",
  "Membrane oxygenators",
  "Hydrocephalus shunts",
  "Biomedical composites",
  "Diagnostic technologies",
  "Respiratory devices",
] as const;

export const TECHNOLOGY_CARDS = [
  {
    title: "Robotic surgery",
    text: "The surgeon controls a robotic system. Availability depends on the hospital, specialty and team.",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "62% 48%",
  },
  {
    title: "Proton therapy",
    text: "An advanced radiation option used in selected cancers. It is not automatically better than other radiation treatments.",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "40% 28%",
  },
  {
    title: "PET-CT / PET-MRI",
    text: "Selected tertiary centres use advanced diagnostic imaging. Capability is institution-specific.",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "50% 45%",
  },
  {
    title: "Advanced cardiac intervention",
    text: "Advanced catheterization and transcatheter procedures exist at selected centres, not at every hospital.",
    image: "/images/editorial/innovation-laboratory.jpg",
    position: "48% 40%",
  },
  {
    title: "Transplantation",
    text: "Complex transplant programs require multidisciplinary teams, intensive care and long-term follow-up.",
    image: "/images/editorial/innovation-laboratory.jpg",
    position: "70% 50%",
  },
  {
    title: "Image-guided procedures",
    text: "Image-guided neurological, spine and interventional work is available where the equipment and experience exist together.",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "30% 18%",
  },
] as const;

export const TRANSPLANT_BARS = [
  { year: "2013", value: 4990, label: "4,990", sourceId: "notto-annual-2025-26" },
  { year: "2024", value: 18911, label: "18,911", sourceId: "notto-annual-2025-26" },
  { year: "2025", value: 20000, label: "Nearly 20,000", sourceId: "pib-transplants-2025" },
] as const;

export const DIGITAL_NODES = [
  "Patient",
  "Digital ID",
  "Facility",
  "Professional",
  "Health ecosystem",
] as const;

export const QUALITY_CARDS = [
  {
    title: "Accreditation",
    text: "NABH and other standards describe quality systems. They are useful signals, not guarantees of outcome.",
  },
  {
    title: "Specialist experience",
    text: "Ask who would perform the procedure and how often the team performs it.",
  },
  {
    title: "Technology",
    text: "Advanced equipment matters only when it is appropriate and supported by an experienced team.",
  },
  {
    title: "Infrastructure",
    text: "Intensive care, diagnostics and specialist support decide whether a centre can handle complexity.",
  },
  {
    title: "Patient safety",
    text: "Look at how complications, escalation and unexpected changes are handled.",
  },
  {
    title: "Continuity of care",
    text: "The journey continues after discharge: records, medicines, follow-up and communication at home.",
  },
] as const;

export const PATIENT_FACTORS = [
  "Expertise",
  "Quality",
  "Technology",
  "Access",
  "Value",
  "Continuity",
] as const;

export const INVESTIGATION_QUESTIONS = [
  {
    id: "who",
    question: "Who will perform the procedure?",
    answer:
      "Ask for the name, specialty and relevant experience of the physician who would actually perform the procedure. A hospital's reputation is not a substitute for knowing who will be responsible for your care.",
  },
  {
    id: "volume",
    question: "How frequently does the team perform it?",
    answer:
      "Procedure experience matters. Where reliable information is available, look for relevant procedure volume, specialist experience and the centre's experience with the type of case being considered.",
  },
  {
    id: "accreditation",
    question: "What are the hospital's relevant accreditations?",
    answer:
      "Look at the accreditation that applies to the hospital and, where relevant, the particular service or department. Accreditation can provide useful information about quality systems and patient-safety processes, but it is not a guarantee of outcome.",
  },
  {
    id: "technology",
    question: "What technology and infrastructure are available?",
    answer:
      "Advanced technology matters only when it is appropriate to the procedure and supported by an experienced team. Ask whether the relevant equipment, intensive-care capability, diagnostics and specialist support are actually available at the centre you are considering.",
  },
  {
    id: "unexpected",
    question: "What happens if something unexpected occurs?",
    answer:
      "Ask how the hospital handles complications, escalation of care, intensive-care needs, additional procedures and unexpected changes to the treatment plan.",
  },
  {
    id: "home",
    question: "What happens after the patient returns home?",
    answer:
      "Ask what records, discharge information, medication information and follow-up communication will be available after you return home. The medical journey does not end at hospital discharge.",
  },
] as const;

export const CAUTION_POINTS = [
  {
    title: "India is not one hospital.",
    text: "A national record of capability is not a recommendation for any one patient or any one centre.",
  },
  {
    title: "Capability varies.",
    text: "Hospitals, departments and physicians differ. Institution-specific questions still have to be asked.",
  },
  {
    title: "Technology is not a guarantee.",
    text: "The presence of a technology somewhere in India does not mean it is available, appropriate or outcome-assured in a specific case.",
  },
  {
    title: "Lower cost is not lower risk.",
    text: "A lower quoted procedure price can become much less attractive after travel, recovery, complications and follow-up are considered.",
  },
] as const;
