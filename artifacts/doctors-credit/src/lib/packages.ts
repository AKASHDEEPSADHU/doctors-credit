export type PackageSku = "orientation" | "direction" | "journey";

export type CarePackage = {
  sku: PackageSku;
  name: string;
  priceLabel: string;
  amountCents: number;
  cadence: string;
  blurb: string;
  includes: string[];
  excludes: string[];
  note: string;
  featured?: boolean;
  /** Public V1 may sell only packages marked available. */
  available: boolean;
};

export const CURRENT_SKU: PackageSku = "orientation";

export const PACKAGES: CarePackage[] = [
  {
    sku: "orientation",
    name: "Initial Care Conversation",
    priceLabel: "$5 USD",
    amountCents: 500,
    cadence: "once",
    available: true,
    featured: true,
    blurb:
      "Talk with a DCredit care coordinator about what you are considering, your goals, timing and whether exploring care in India may make sense for you.",
    includes: [
      "A conversation with a DCredit care coordinator",
      "Discussion of the care you are considering",
      "Discussion of your healthcare coverage or funding situation, not a benefits verification",
      "Discussion of your timeline and goals",
      "An explanation of how DCredit works",
      "Help deciding whether exploring India may be worth investigating further",
      "A list of information you may later need to gather",
      "An explanation of possible next steps",
    ],
    excludes: [
      "Medical diagnosis or treatment recommendation",
      "Clinical assessment or medical clearance",
      "Specialist opinion or medical-record review",
      "Insurance verification",
      "Hospital or travel booking",
      "A guarantee of savings or outcomes",
    ],
    note: "If India does not appear worth investigating for you, we will say so. The five dollars still stand. There is no obligation to continue.",
  },
  {
    sku: "direction",
    name: "India Care Evaluation",
    priceLabel: "$450",
    amountCents: 45000,
    cadence: "once",
    available: false,
    blurb:
      "A later-phase service for a structured comparison of expected costs at home against a complete India journey estimate, plus specialist and hospital options where appropriate.",
    includes: [
      "Planned: medical-record review by a qualified professional, when a secure process is available",
      "Planned: specialist opinion coordination",
      "Planned: individually evaluated hospital options",
      "Planned: treatment and timeline estimates",
      "Planned: home-country versus India total-journey comparison",
    ],
    excludes: [],
    note: "Coming in a later phase. Not available for purchase in V1.",
  },
  {
    sku: "journey",
    name: "Complete India Care Coordination",
    priceLabel: "$2,400",
    amountCents: 240000,
    cadence: "coordination",
    available: false,
    blurb:
      "A later-phase service for end-to-end coordination before travel, during an India stay, and after return home, without pressure to proceed.",
    includes: [
      "Planned: specialist and hospital coordination",
      "Planned: treatment scheduling and visa guidance",
      "Planned: travel and on-the-ground support",
      "Planned: medical records and return-home coordination",
      "Planned: follow-up coordination",
    ],
    excludes: [],
    note: "Coming in a later phase. Not available for purchase in V1.",
  },
];

export function packageBySku(sku: string) {
  return PACKAGES.find((p) => p.sku === sku) ?? null;
}

/** V1 public checkout may sell only packages marked available (orientation). */
export function purchasablePackage(sku: string) {
  const pkg = packageBySku(sku);
  if (!pkg || !pkg.available) return null;
  return pkg;
}

export function currentPackage() {
  return PACKAGES.find((p) => p.sku === CURRENT_SKU)!;
}

export function availablePackages() {
  return PACKAGES.filter((p) => p.available);
}
