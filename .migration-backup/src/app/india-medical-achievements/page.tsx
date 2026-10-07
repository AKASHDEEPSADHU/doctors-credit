import type { Metadata } from "next";
import Link from "next/link";
import { DigitalHealthVisual } from "@/components/achievements/DigitalHealthVisual";
import { InternationalPatientFramework } from "@/components/achievements/InternationalPatientFramework";
import { MedicalAchievementsHero } from "@/components/achievements/MedicalAchievementsHero";
import { MedicalChapter } from "@/components/achievements/MedicalChapter";
import { MedicalStats } from "@/components/achievements/MedicalStats";
import { MedicalTechnologyGallery } from "@/components/achievements/MedicalTechnologyGallery";
import { MedicalTimeline } from "@/components/achievements/MedicalTimeline";
import { MethodologyPanel } from "@/components/achievements/MethodologyPanel";
import { QuestionAccordion } from "@/components/achievements/QuestionAccordion";
import { SourceCite } from "@/components/achievements/SourceCite";
import { SourceLibrary } from "@/components/achievements/SourceLibrary";
import { TransplantChart } from "@/components/achievements/TransplantChart";
import { WhatThisDoesNotMean } from "@/components/achievements/WhatThisDoesNotMean";
import { FeatureTile } from "@/components/editorial/FeatureTile";
import { SectionLabel } from "@/components/editorial/SectionLabel";
import "./achievements.css";

export const metadata: Metadata = {
  title: "India's Medical Achievements | Doctor's Credit",
  description:
    "Explore India's medical achievements across complex surgery, transplantation, cancer care, pharmaceuticals, vaccines, medical devices, advanced technology and digital health.",
  keywords: [
    "India medical achievements",
    "medical treatment in India",
    "India healthcare",
    "India medical tourism",
    "Indian hospitals",
    "medical care in India",
    "India healthcare capabilities",
    "India transplant medicine",
    "India cancer treatment",
    "India robotic surgery",
    "India pharmaceutical industry",
  ],
};

const BEYOND = [
  {
    href: "#pharmaceuticals",
    kicker: "Pharmaceuticals",
    title: "Medicines at global scale",
    metric: "~20%",
    image: "/images/editorial/innovation-laboratory.jpg",
    position: "52% 40%",
  },
  {
    href: "#vaccines",
    kicker: "Vaccines",
    title: "A global manufacturing powerhouse",
    metric: "~60%",
    image: "/images/editorial/innovation-laboratory.jpg",
    position: "30% 60%",
  },
  {
    href: "#medical-devices",
    kicker: "Medical devices",
    title: "Indigenous clinical engineering",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "70% 40%",
  },
  {
    href: "#advanced-technology",
    kicker: "Advanced technology",
    title: "Selected tertiary capability",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "40% 28%",
  },
  {
    href: "#transplantation",
    kicker: "Transplantation",
    title: "National program growth",
    metric: "~20,000",
    image: "/images/editorial/innovation-imaging.jpg",
    position: "28% 20%",
  },
  {
    href: "#digital-health",
    kicker: "Digital health",
    title: "A connected public system",
    metric: "94.87 crore",
    image: "/images/editorial/innovation-laboratory.jpg",
    position: "35% 25%",
  },
] as const;

const DEVICE_TILES = [
  "Artificial heart valves",
  "Blood bags",
  "Membrane oxygenators",
  "Hydrocephalus shunts",
  "Biomedical composites",
  "Respiratory devices",
] as const;

export default function IndiaMedicalAchievementsPage() {
  return (
    <main id="main" className="achievements-page">
      <MedicalAchievementsHero />
      <MedicalStats />
      <MedicalTimeline />

      <section className="ed-dark ma-beyond" id="beyond-surgery">
        <div className="shell">
          <SectionLabel>Beyond the operating theatre</SectionLabel>
          <h2>The story did not stop with surgery.</h2>
          <ul className="ed-mosaic ma-beyond-mosaic">
            {BEYOND.map((item, index) => (
              <li key={item.href}>
                <FeatureTile
                  href={item.href}
                  kicker={item.kicker}
                  title={item.title}
                  metric={"metric" in item ? item.metric : undefined}
                  image={item.image}
                  imageAlt={`Representative image for ${item.kicker}. Not a named facility.`}
                  imagePosition={item.position}
                  size={index === 0 ? "lg" : index < 3 ? "md" : "sm"}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MedicalChapter
        id="pharmaceuticals"
        kicker="Pharmaceuticals"
        title="Medicines at global scale"
        statistic="~20%"
        statisticNote="Approximate share of the world's generic medicines, with exports reaching around 200 countries and territories."
        image="/images/editorial/innovation-laboratory.jpg"
        imageAlt="Representative laboratory image illustrating pharmaceutical research and manufacturing. Not a named plant."
        imagePosition="52% 40%"
        sourceId="pib-pharma"
      />

      <MedicalChapter
        id="vaccines"
        kicker="Vaccines"
        title="A global manufacturing powerhouse"
        statistic="~60%"
        statisticNote="Approximate share of global vaccine production by volume. Indian manufacturers also supply international procurement systems."
        image="/images/editorial/innovation-laboratory.jpg"
        imageAlt="Representative laboratory image illustrating vaccine development and manufacture. Not a named facility."
        imagePosition="30% 60%"
        sourceId="pib-vaccines"
      />

      <section className="ma-devices" id="medical-devices">
        <div className="shell ed-split">
          <figure className="ed-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/innovation-imaging.jpg"
              alt="Representative imaging still used to illustrate indigenous medical-device development. Not a named device photograph."
              style={{ objectPosition: "70% 40%" }}
            />
            <figcaption>Representative image</figcaption>
          </figure>
          <div>
            <SectionLabel>Medical devices</SectionLabel>
            <h2>Indigenous clinical engineering</h2>
            <p>
              Sree Chitra Tirunal Institute for Medical Sciences and Technology
              developed and commercialized technologies including the examples
              below.
            </p>
            <ul className="ed-chip-grid">
              {DEVICE_TILES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <SourceCite id="sctimst" />
            <SourceCite id="dst-chitra-valve" />
          </div>
        </div>
      </section>

      <MedicalTechnologyGallery />
      <TransplantChart />
      <DigitalHealthVisual />
      <InternationalPatientFramework />
      <QuestionAccordion />

      <section className="ma-cost" id="cost">
        <div className="shell">
          <SectionLabel>Total value</SectionLabel>
          <h2>Cost is part of the picture.</h2>
          <ol className="ed-process">
            <li>Treatment</li>
            <li>Journey</li>
            <li>Continuity</li>
          </ol>
          <p>
            A lower quoted treatment price can become much less attractive
            after travel, accommodation, companion costs, recovery time,
            complications, repeat procedures and follow-up are considered.
          </p>
        </div>
      </section>

      <WhatThisDoesNotMean />

      <section className="ma-view" id="dcredit-perspective">
        <div className="shell">
          <SectionLabel>The DCredit view</SectionLabel>
          <h2 className="ed-display">
            India may be worth exploring.
            <br />
            The question is whether it is right for you.
          </h2>
          <p>
            India has developed substantial healthcare capabilities. The
            individual decision still comes down to the specific treatment,
            physician, hospital, quality evidence, practical realities and
            total journey.
          </p>
          <Link className="btn-solid" href="/enroll">
            Talk to a care coordinator
          </Link>
        </div>
      </section>

      <SourceLibrary />
      <MethodologyPanel />

      <section className="ma-legal">
        <div className="shell">
          <h2>Medical achievements are not medical advice.</h2>
          <p>
            India&apos;s healthcare achievements are presented for informational
            and educational purposes only. Nothing on this page constitutes a
            diagnosis, treatment recommendation, medical clearance, or
            guarantee of outcome. Patients should consult appropriately
            qualified healthcare professionals and independently evaluate
            hospitals, physicians, procedures, risks, costs and follow-up
            arrangements.
          </p>
        </div>
      </section>
    </main>
  );
}
