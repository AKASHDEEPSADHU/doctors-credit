export type AchievementSource = {
  id: string;
  label: string;
  href: string;
  group:
    | "Government of India"
    | "ICMR / NIV"
    | "AIIMS"
    | "NOTTO"
    | "NABH"
    | "Peer-reviewed medical literature"
    | "Hospital/institutional sources";
  note?: string;
};

export const ACHIEVEMENT_SOURCES: AchievementSource[] = [
  {
    id: "pib-medical-arrivals-2025",
    label: "Government of India, Press Information Bureau: foreign nationals arriving for medical treatment, 2025",
    href: "https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=158426&lang=1&reg=3",
    group: "Government of India",
  },
  {
    id: "pib-transplants-2025",
    label: "Government of India, Press Information Bureau: organ transplantation update, 2025",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231563&lang=2&reg=3",
    group: "Government of India",
  },
  {
    id: "pib-vaccines",
    label: "Government of India, Press Information Bureau: vaccine manufacturing",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241066&lang=1&reg=3",
    group: "Government of India",
  },
  {
    id: "pib-pharma",
    label: "Government of India, Press Information Bureau: pharmaceutical industry and exports",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234141&lang=2&reg=3",
    group: "Government of India",
  },
  {
    id: "pib-abdm-2026",
    label: "Government of India, Press Information Bureau: Ayushman Bharat Digital Mission status, 20 July 2026",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2288848&lang=1&reg=48",
    group: "Government of India",
  },
  {
    id: "pib-usfda-plants",
    label: "Government of India, Press Information Bureau: USFDA-approved pharmaceutical plants outside the United States",
    href: "https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=157889&id=157889&lang=2&reg=3",
    group: "Government of India",
  },
  {
    id: "pib-tandem-asct-2026",
    label: "Government of India, Press Information Bureau: tandem autologous stem-cell transplant, February 2026",
    href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231557&lang=2&reg=48",
    group: "Government of India",
  },
  {
    id: "notto-annual-2025-26",
    label: "Ministry of Health and Family Welfare / NOTTO: annual report 2025-2026",
    href: "https://notto.mohfw.gov.in/WriteReadData/Portal/News/951_1_Annual_Report_of_the_MoH_FW__2025_-_2026.pdf",
    group: "NOTTO",
  },
  {
    id: "notto-home",
    label: "National Organ and Tissue Transplant Organization",
    href: "https://notto.mohfw.gov.in/",
    group: "NOTTO",
  },
  {
    id: "abdm-hpr",
    label: "Ayushman Bharat Digital Mission: Healthcare Professionals Registry",
    href: "https://abdm.gov.in/healthcare-professionals",
    group: "Government of India",
  },
  {
    id: "nabh-find",
    label: "National Accreditation Board for Hospitals & Healthcare Providers: find a healthcare organisation",
    href: "https://nabh.co/find-a-healthcare-organisation/",
    group: "NABH",
  },
  {
    id: "niv-covaxin",
    label: "ICMR-National Institute of Virology: Covaxin development role",
    href: "https://niv.icmr.org.in/show_content.php?lang=1&level=1&lid=2&ls_id=223&page=221",
    group: "ICMR / NIV",
  },
  {
    id: "pmc-gopinath-1961",
    label: "Peer-reviewed account of open-heart surgery at Christian Medical College, Vellore, 1961",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5963231/",
    group: "Peer-reviewed medical literature",
  },
  {
    id: "ijn-kidney-1971",
    label: "Indian Journal of Nephrology: kidney transplantation in India",
    href: "https://indianjnephrol.org/kidney-transplantation-in-indiapast-present-and-future/",
    group: "Peer-reviewed medical literature",
  },
  {
    id: "aiims-patient-care",
    label: "All India Institute of Medical Sciences, New Delhi: patient care",
    href: "https://www.aiims.edu/index.php/en/patient-care",
    group: "AIIMS",
  },
  {
    id: "apollo-transplant-milestones",
    label: "Apollo Hospitals: transplantation milestones",
    href: "https://www.apollohospitals.com/departments/transplantation/our-milestones",
    group: "Hospital/institutional sources",
    note: "Hospital-reported milestone",
  },
  {
    id: "apollo-robotic-urology",
    label: "Apollo Hospitals: robotic urology in India",
    href: "https://www.apollohospitals.com/corporate/patient-care/health-and-lifestyle/our-doctors-talk/robotic-urology-in-india/",
    group: "Hospital/institutional sources",
    note: "Hospital/institutional account",
  },
  {
    id: "apollo-proton-2019",
    label: "Apollo Hospitals: Apollo Proton Cancer Centre inauguration, 2019",
    href: "https://www.apollohospitals.com/corporate/apollo-in-the-news/apollo-hospitals-inaugurated-the-apollo-proton-cancer-centre-south-east-asia-s-first-proton-therapy/",
    group: "Hospital/institutional sources",
    note: "Hospital-reported milestone",
  },
  {
    id: "sctimst",
    label: "Sree Chitra Tirunal Institute for Medical Sciences and Technology",
    href: "https://www.sctimst.ac.in/",
    group: "Hospital/institutional sources",
  },
  {
    id: "dst-chitra-valve",
    label: "Department of Science & Technology: Sree Chitra heart valve as frugal medical innovation",
    href: "https://dst.gov.in/node/7586",
    group: "Government of India",
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
