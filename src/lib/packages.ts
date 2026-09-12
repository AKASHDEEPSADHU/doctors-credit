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
    name: "Orientation",
    priceLabel: "$5",
    amountCents: 500,
    cadence: "once",
    blurb:
      "The doorway. A patient account, a first conversation, and a written reading of where you actually stand.",
    includes: [
      "Your Doctor's Credit account",
      "A first conversation (WhatsApp or scheduled call)",
      "Plain-language notes on the condition as described",
      "Whether Hyderabad is even the right next step",
    ],
    note: "If India is not the honest answer, we will say so. The five dollars still stand.",
    featured: true,
  },
  {
    sku: "direction",
    name: "Direction",
    priceLabel: "$450",
    amountCents: 45000,
    cadence: "once",
    blurb:
      "A map, not a brochure. Which kind of Hyderabad centre fits this work, what to ask, and what the journey really costs.",
    includes: [
      "Specialty landscape in Hyderabad for your case",
      "Questions to take to any specialist",
      "US / home-country out-of-pocket versus India journey cost",
      "Timing: wait, treat locally, or fly",
    ],
    note: "Hospital fees are never inside this number. We do not mark up clinical care.",
  },
  {
    sku: "journey",
    name: "Journey",
    priceLabel: "$2,400",
    amountCents: 240000,
    cadence: "coordination",
    blurb:
      "The practical path: visa, payments, currency, travel, and someone who knows the city when you land.",
    includes: [
      "India e-Medical visa guidance",
      "Cross-border payment rails and INR conversion",
      "Travel, stay, and attendant planning",
      "On-ground Hyderabad liaison through the admission window",
    ],
    note: "You pay the hospital yourself. We coordinate. We are not on their payroll.",
  },
];

export function packageBySku(sku: string) {
  return PACKAGES.find((p) => p.sku === sku) ?? null;
}
