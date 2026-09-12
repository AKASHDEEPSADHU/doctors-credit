export type Source = {
  label: string;
  publisher: string;
  year: string;
  url: string;
  verified: string;
  kind: "VERIFIED" | "ESTIMATE" | "PROVIDER-REPORTED" | "PROJECTION";
};

export const SOURCES = {
  indiaMedicalArrivals2025: {
    label: "India foreign medical-purpose arrivals, 2025",
    publisher: "Government of India, Ministry of Tourism / Press Information Bureau (citing Bureau of Immigration)",
    year: "2025",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?lang=1&PRID=2257447",
    verified: "2026-09-12",
    kind: "VERIFIED",
  },
  cdcMedicalTourism: {
    label: "Medical tourism among US residents",
    publisher: "Centers for Disease Control and Prevention, Yellow Book, Medical Tourism",
    year: "2024",
    url: "https://www.cdc.gov/yellow-book/hcp/travelers-with-additional-considerations/medical-tourism.html",
    verified: "2026-09-12",
    kind: "VERIFIED",
  },
  nabh: {
    label: "NABH accreditation standards",
    publisher: "National Accreditation Board for Hospitals & Healthcare Providers",
    year: "2024",
    url: "https://nabh.co/",
    verified: "2026-09-12",
    kind: "VERIFIED",
  },
} as const satisfies Record<string, Source>;

export const INDIA_STATS = {
  fta2025: "9.15 million",
  medicalPurpose2025: "507,244",
  medicalShare: "approximately 5.5%",
  topSource: "Bangladesh — 325,127 medical-purpose arrivals",
  otherSources: ["Iraq", "Uzbekistan", "Somalia", "Turkmenistan", "Oman", "Kenya"],
  caveat:
    "These figures are foreign medical-purpose arrivals, not a count of US elective-surgery patients. They are not a measure of clinical outcomes.",
};
