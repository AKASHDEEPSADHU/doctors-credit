export type PackageSku = "orientation" | "direction" | "journey";

export type CarePackage = {
  sku: PackageSku;
  name: string;
  priceLabel: string;
  amountCents: number;
  cadence: string;
  blurb: string;
  includes: string[];
  note: string;
  featured?: boolean;
};

export const PACKAGES: CarePackage[] = [
  {
    sku: "orientation",
    name: "$5 Initial Assessment",
    priceLabel: "$5",
    amountCents: 500,
    cadence: "once",
    blurb:
      "For $5, speak with a DCredit care coordinator who will understand your treatment need, insurance situation, timeline and goals, and explain how the India-care pathway works.",
    includes: [
      "Care coordinator call",
      "Basic case understanding",
      "India suitability discussion",
      "Process explanation",
      "Initial document checklist",
    ],
    note: "If India is not a sensible option for you, we will say so. The five dollars still stand.",
    featured: true,
  },
  {
    sku: "direction",
    name: "India Care Evaluation",
    priceLabel: "$450",
    amountCents: 45000,
    cadence: "once",
    blurb:
      "A structured comparison of your likely US financial exposure against a complete India journey estimate — plus specialist and hospital options where appropriate.",
    includes: [
      "Medical record review",
      "Specialist opinion coordination",
      "Hospital options (individually evaluated)",
      "Treatment estimate",
      "Timeline estimate",
      "US vs India cost comparison",
    ],
    note: "Hospital clinical fees are billed by the provider. DCredit does not diagnose or prescribe.",
  },
  {
    sku: "journey",
    name: "Complete India Care Coordination",
    priceLabel: "$2,400",
    amountCents: 240000,
    cadence: "coordination",
    blurb:
      "End-to-end coordination before travel, during your India stay, and after you return home — without pressure to proceed.",
    includes: [
      "Specialist and hospital coordination",
      "Treatment scheduling",
      "Visa guidance",
      "Airport transfer and accommodation coordination",
      "Local transportation and patient coordinator",
      "Medical records and return-home plan",
      "Follow-up coordination",
    ],
    note: "You decide whether to travel. Coordination fees are disclosed before you proceed.",
  },
];

export function packageBySku(sku: string) {
  return PACKAGES.find((p) => p.sku === sku) ?? null;
}
