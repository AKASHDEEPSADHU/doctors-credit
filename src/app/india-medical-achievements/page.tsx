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
import { DEVICE_EXAMPLES } from "@/lib/india-medical-achievements";
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

export default function IndiaMedicalAchievementsPage() {
  return (
    <main id="main" className="achievements-page">
      <MedicalAchievementsHero />
      <MedicalStats />
      <MedicalTimeline />

      <section className="ma-beyond" id="beyond-surgery">
        <div className="shell">
          <p className="eyebrow">Beyond the operating theatre</p>
          <h2>The story did not stop with surgery.</h2>
          <p>
            India&apos;s healthcare ecosystem extends into medicines, vaccines,
            medical devices, digital health and advanced technology. None of
            these, taken alone, tells a patient which hospital or physician is
            appropriate.
          </p>
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
        imageKind="Representative image"
        sourceId="pib-pharma"
      >
        <p>
          The Government of India describes India as the third-largest
          pharmaceutical industry in the world by volume and the largest
          supplier of generic medicines. Government data also states that India
          supplies more than 70% of global antiretroviral medicines.
        </p>
        <aside className="ma-why">
          <p>What this means</p>
          <p>
            India has built a large pharmaceutical manufacturing and export
            ecosystem. That does not mean every medicine or manufacturer has
            identical standards.
          </p>
        </aside>
        <SourceCite id="pib-usfda-plants" />
      </MedicalChapter>

      <MedicalChapter
        id="vaccines"
        kicker="Vaccines"
        title="Vaccines at global scale"
        statistic="~60%"
        statisticNote="Approximate share of global vaccine production by volume."
        image="/images/editorial/innovation-laboratory.jpg"
        imageAlt="Representative laboratory image illustrating vaccine development and manufacture. Not a named facility."
        imagePosition="30% 60%"
        imageKind="Representative image"
        sourceId="pib-vaccines"
        reverse
      >
        <p>
          India has become one of the world&apos;s major vaccine manufacturing
          centres. Indian manufacturers also supply vaccines to international
          procurement systems and global health programs.
        </p>
        <div className="ma-inset">
          <h3>Indigenous development</h3>
          <p>
            The ICMR-National Institute of Virology played a major role in
            development of Covaxin, India&apos;s indigenous COVID-19 vaccine.
            That is a documented development role. It is not a comparative
            claim about effectiveness or safety versus other vaccines.
          </p>
          <SourceCite id="niv-covaxin" />
        </div>
      </MedicalChapter>

      <MedicalChapter
        id="medical-devices"
        kicker="Medical devices"
        title="Medical-device innovation"
        image="/images/editorial/innovation-imaging.jpg"
        imageAlt="Representative imaging still used to illustrate indigenous medical-device development. Not a named device photograph."
        imagePosition="70% 40%"
        imageKind="Representative image"
        sourceId="sctimst"
      >
        <p>
          Sree Chitra Tirunal Institute for Medical Sciences and Technology has
          developed and commercialized technologies including the examples
          below. One example is the Sree Chitra heart valve, cited by
          India&apos;s Department of Science &amp; Technology as frugal medical
          innovation.
        </p>
        <ul className="ma-chips">
          {DEVICE_EXAMPLES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <SourceCite id="dst-chitra-valve" />
        <p>
          These examples illustrate a history of combining clinical medicine,
          engineering and cost-conscious innovation. They do not mean every
          device used in India is indigenous.
        </p>
      </MedicalChapter>

      <MedicalTechnologyGallery />
      <TransplantChart />
      <DigitalHealthVisual />
      <InternationalPatientFramework />
      <QuestionAccordion />

      <section className="ma-cost" id="cost">
        <div className="shell">
          <p className="eyebrow">Total value</p>
          <h2>Cost is part of the picture.</h2>
          <ol className="ma-cost-layers">
            <li>Treatment</li>
            <li>Journey</li>
            <li>Continuity</li>
          </ol>
          <div className="ma-cost-compare">
            <p>Home country</p>
            <span>versus</span>
            <p>India</p>
          </div>
          <p>
            A lower quoted treatment price can become much less attractive
            after travel, accommodation, companion costs, recovery time,
            complications, repeat procedures and follow-up are considered. The
            correct comparison is total expected cost at home versus the total
            expected India journey, together with quality, clinical
            suitability, risk and continuity of care.
          </p>
        </div>
      </section>

      <WhatThisDoesNotMean />

      <section className="ma-view" id="dcredit-perspective">
        <div className="shell">
          <p className="eyebrow">The DCredit view</p>
          <h2>
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
          <p>
            DCredit does not ask a patient to trust India simply because India
            has impressive medical achievements. Sometimes India may make
            sense. Sometimes it may not. The point is to make the decision with
            better information.
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
