export type AchievementImageKind =
  | "documentary"
  | "representative"
  | "editorial reconstruction";

export type AchievementImage = {
  id: string;
  src: string;
  section: string;
  description: string;
  source: string;
  sourceUrl: string;
  license: string;
  attribution: string;
  verified: string;
  kind: AchievementImageKind;
  alt: string;
};

export const ACHIEVEMENT_IMAGES: AchievementImage[] = [
  {
    id: "hero-imaging",
    src: "/images/editorial/innovation-imaging.jpg",
    section: "Hero",
    description: "Diagnostic imaging still used as a cinematic research-note visual.",
    source: "DCredit editorial library",
    sourceUrl: "https://dcredit.in/india-medical-achievements",
    license: "Original editorial asset commissioned for DCredit.",
    attribution: "Doctor's Credit editorial library",
    verified: "September 2026",
    kind: "representative",
    alt: "Diagnostic imaging slices used as a representative illustration of advanced medical technology. Not a named hospital or patient.",
  },
  {
    id: "lab-environment",
    src: "/images/editorial/innovation-laboratory.jpg",
    section: "Timeline, pharmaceuticals, vaccines, devices",
    description: "Laboratory environment used as a representative chapter visual.",
    source: "DCredit editorial library",
    sourceUrl: "https://dcredit.in/india-medical-achievements",
    license: "Original editorial asset commissioned for DCredit.",
    attribution: "Doctor's Credit editorial library",
    verified: "September 2026",
    kind: "representative",
    alt: "Laboratory environment used as a representative illustration of research and manufacturing capability. Not a named facility.",
  },
  {
    id: "gateway-couple",
    src: "/images/editorial/hero-gateway-couple.jpg",
    section: "International patient framework",
    description: "Editorial reconstruction of an international couple in India.",
    source: "DCredit editorial library",
    sourceUrl: "https://dcredit.in/india-medical-achievements",
    license: "Original editorial reconstruction. Not a photograph of DCredit patients.",
    attribution: "Doctor's Credit editorial library",
    verified: "September 2026",
    kind: "editorial reconstruction",
    alt: "Editorial reconstruction of a relaxed international couple at a historic Indian waterfront. Generated imagery, not a photograph of DCredit patients.",
  },
];
