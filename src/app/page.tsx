import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import { IndiaDecisionMap } from "@/components/IndiaDecisionMap";
import Reveal from "@/components/Reveal";
import { FAQS } from "@/lib/faq";
import { JOURNEY } from "@/lib/journey";
import { SUITABILITY_LABEL, TREATMENTS, suitabilityClass } from "@/lib/treatments";

const featured = TREATMENTS.filter((t) =>
  ["knee-replacement", "ivf", "dental-implants", "cabg", "cataract", "hip-replacement"].includes(
    t.slug
  )
);

const CAPABILITIES = [
  {
    title: "Clinical expertise",
    text: "Specialist teams and complex-care capabilities",
    icon: "expertise",
  },
  {
    title: "Modern hospitals",
    text: "Advanced infrastructure and quality systems",
    icon: "hospital",
  },
  {
    title: "Advanced technology",
    text: "Modern diagnostic and treatment technologies",
    icon: "tech",
  },
  {
    title: "Compassionate care",
    text: "Care that treats patients with dignity and attention",
    icon: "care",
  },
  {
    title: "Greater value",
    text: "A broader view of cost, quality and practical fit",
    icon: "value",
  },
  {
    title: "A smoother journey",
    text: "Planning from first conversation through return home",
    icon: "journey",
  },
] as const;

const VALUE_LENSES = [
  "Expertise",
  "Quality",
  "Technology",
  "Access",
  "Value",
  "Continuity",
] as const;

const QUALITY_LENSES = [
  "Accreditation",
  "Specialist experience",
  "Technology",
  "Infrastructure",
  "Patient safety",
  "Continuity of care",
] as const;

const REGIONS = [
  "North America",
  "Europe",
  "Australia",
  "Africa",
  "Middle East",
  "Asia",
] as const;

const ILLUSTRATIVE = [
  {
    region: "Canada",
    text: "A person considers India after weighing specialist expertise, access and the total cost of the journey, not a hospital sticker price alone.",
  },
  {
    region: "Australia",
    text: "Someone looks at selected tertiary centres for a planned procedure, then asks whether timing, technology and travel would actually fit.",
  },
  {
    region: "South Africa",
    text: "A family explores whether a particular capability exists in India, and what follow-up would look like after returning home.",
  },
  {
    region: "United Kingdom",
    text: "A patient compares quality systems, waiting time and overall value before deciding whether India is even worth investigating.",
  },
] as const;

const HOME_JOURNEY = [
  { rail: "Understand", step: JOURNEY[0] },
  { rail: "Explore", step: JOURNEY[1] },
  { rail: "Compare", step: JOURNEY[2] },
  { rail: "Review", step: JOURNEY[4] },
  { rail: "Decide", step: JOURNEY[5] },
  { rail: "Plan", step: JOURNEY[6] },
  {
    rail: "Return home",
    step: {
      n: "07",
      title: "Keep life after treatment in view",
      body: "Discharge information, medications, imaging, travel fitness and communication with healthcare professionals at home belong in the plan from the start.",
    },
  },
] as const;

function LineIcon({ name }: { name: (typeof CAPABILITIES)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  return (
    <svg className="cap-icon" {...common}>
      {name === "expertise" ? (
        <>
          <circle cx="9" cy="8" r="2.4" />
          <path d="M4.8 18.5c.4-3 2.2-4.6 4.2-4.6s3.8 1.6 4.2 4.6" />
          <path d="M15 8h5M17.5 5.5v5" />
        </>
      ) : null}
      {name === "hospital" ? (
        <>
          <path d="M5 20V6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V20" />
          <path d="M4 20h16" />
          <path d="M10 20v-4h4v4" />
          <path d="M12 8v5M9.5 10.5h5" />
        </>
      ) : null}
      {name === "tech" ? (
        <>
          <rect x="4" y="5" width="16" height="11" rx="1.4" />
          <path d="M8 20h8M12 16v4" />
          <path d="M8 10h3M8 12.5h2" />
        </>
      ) : null}
      {name === "care" ? (
        <>
          <path d="M12 18.5s-6.2-3.7-6.2-8A3.4 3.4 0 0 1 12 8.2 3.4 3.4 0 0 1 18.2 10.5c0 4.3-6.2 8-6.2 8z" />
        </>
      ) : null}
      {name === "value" ? (
        <>
          <ellipse cx="12" cy="7" rx="6" ry="2.2" />
          <path d="M6 7v3.4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V7" />
          <path d="M6 10.4v3.3c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-3.3" />
        </>
      ) : null}
      {name === "journey" ? (
        <>
          <path d="M4 16.5h9l3-4h4" />
          <path d="M14.2 12.5l2.2-1.4 2.1 3.4-2.4.8z" />
          <circle cx="7" cy="16.5" r="1.5" />
          <path d="M4 9.5h5" />
        </>
      ) : null}
    </svg>
  );
}

export default function Home() {
  return (
    <main id="main">
      <section className="hero hero-editorial">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">International patients · Planned care · India</p>
            <h1>India is a global destination for advanced, compassionate care.</h1>
            <p className="lede">
              People from around the world consider India for complex and
              specialized care. The reasons can go far beyond cost: specialist
              expertise, modern hospitals, advanced technology, access, timing
              and overall value.
            </p>
            <p className="lede">
              DCredit helps you explore whether India is worth considering for
              your particular healthcare journey.
            </p>
            <div className="hero-actions">
              <Link className="btn-solid" href="/enroll">
                Start my $5 Assessment
              </Link>
              <Link className="btn-ghost" href="/india-medical-achievements">
                Explore India&apos;s Medical Achievements
              </Link>
            </div>
            <p className="trust-mini">
              Start with a conversation about whether exploring India makes
              sense for you. This is not a clinical assessment, diagnosis or
              medical clearance.
            </p>
          </div>
          <figure className="hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/hero-india-care.jpg"
              width={1400}
              height={1866}
              alt="Editorial photograph of two people standing together in a modern city at sunset, used to suggest hope after planned care. Not a photograph of a DCredit patient."
              fetchPriority="high"
            />
            <figcaption>
              Editorial imagery. Not a DCredit patient, testimonial or hospital
              affiliation.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="capability-strip" aria-label="Capabilities found across India healthcare">
        <div className="shell">
          <p className="capability-note">
            These are capabilities found across India&apos;s healthcare ecosystem
            and at selected institutions. They are not a description of every
            hospital.
          </p>
          <ul className="capability-grid">
            {CAPABILITIES.map((item) => (
              <li key={item.title}>
                <LineIcon name={item.icon} />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <IndiaDecisionMap />

      <section className="band-soft" id="stories">
        <div className="shell story-split">
          <div>
            <p className="eyebrow">Illustrative patient journeys</p>
            <h2>Lives changed. Futures regained.</h2>
            <p className="section-lede">
              People from many countries choose India for planned medical care.
              The outcomes, experiences and reasons are different for every
              patient.
            </p>
            <p>
              Verified patient stories are coming soon. The cards beside this
              text are illustrative scenarios only. They are not real
              testimonials and they do not describe DCredit customers.
            </p>
            <Link className="btn-ghost" href="/stories">
              Patient stories
            </Link>
          </div>
          <ul className="story-cards">
            {ILLUSTRATIVE.map((card) => (
              <li key={card.region}>
                <p className="story-label">Illustrative scenario</p>
                <p>{card.text}</p>
                <p className="story-meta">
                  Example patient
                  <span>{card.region}</span>
                </p>
                <p className="fine">
                  Illustrative scenario, not a real patient testimonial.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="shell">
          <p className="eyebrow">Not just cost</p>
          <h2>It is not only about the price.</h2>
          <p className="section-lede">
            Cost may be part of the reason someone looks abroad. It should not
            be the only reason.
          </p>
          <ul className="lens-row">
            {VALUE_LENSES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="section-lede">
            A treatment price is only one part of a medical journey. The fuller
            picture includes healthcare costs at home, treatment cost in India,
            travel, accommodation, companion costs, recovery time, follow-up
            and continuity of care.
          </p>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell editorial-split">
          <figure className="editorial-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/innovation-imaging.jpg"
              width={1600}
              height={1067}
              alt="Diagnostic imaging slices illustrating medical technology. Not associated with a named hospital or patient."
              loading="lazy"
            />
            <figcaption>
              Selected tertiary centres offer advanced diagnostics. Capability
              is institution-specific.
            </figcaption>
          </figure>
          <div>
            <p className="eyebrow">India&apos;s Medical Achievements</p>
            <h2>A healthcare story that goes beyond affordability.</h2>
            <p className="section-lede">
              India&apos;s medical story includes decades of specialist medicine,
              complex surgery, transplantation, cancer care, pharmaceuticals,
              vaccines, medical devices and digital health.
            </p>
            <p>
              India has developed substantial capabilities in complex and
              specialized care. The right hospital, physician and procedure
              must still be evaluated individually.
            </p>
            <Link className="btn-solid" href="/india-medical-achievements">
              Explore India&apos;s Medical Achievements
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <p className="eyebrow">Quality</p>
          <h2>Quality deserves to be investigated.</h2>
          <p className="section-lede">
            India is a large and diverse healthcare market. Capabilities vary
            by hospital, department and physician. That is why provider-level
            information matters.
          </p>
          <ul className="lens-row">
            {QUALITY_LENSES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            DCredit does not assume that every hospital or physician offers the
            same level of care. Accreditation is useful information, but it is
            not a guarantee of outcome.
          </p>
          <p style={{ marginTop: "1.2rem" }}>
            <Link href="/hospitals">How we evaluate providers →</Link>
          </p>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <p className="eyebrow">Treatments</p>
          <h2>Where India&apos;s capabilities may be worth exploring.</h2>
          <p className="section-lede">
            Different treatments call for different questions. Explore the
            procedures and specialties people commonly investigate in India.
          </p>
          <div className="treat-grid">
            {featured.map((t) => (
              <Link className="treat-card" href={`/treatments/${t.slug}`} key={t.slug}>
                <small>{t.category}</small>
                <h3>{t.name}</h3>
                <p className="muted">{t.why}</p>
                <span className={suitabilityClass(t.suitability)}>{SUITABILITY_LABEL[t.suitability]}</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem" }}>
            <Link href="/treatments">All treatments →</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="shell">
          <p className="eyebrow">International patients</p>
          <h2>Care knows no single border.</h2>
          <p className="section-lede">
            People considering treatment in India come from many healthcare
            systems and many parts of the world. These regions describe who
            DCredit is written for. They are not patient counts.
          </p>
          <ul className="region-grid">
            {REGIONS.map((region) => (
              <li key={region}>{region}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band-soft" id="how">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">The journey</p>
            <h2>A structured decision. Not a sales pitch.</h2>
            <p className="section-lede">
              You have not already chosen India by starting this conversation.
              The current paid service is the $5 Initial Assessment.
            </p>
          </Reveal>
          <ol className="journey-rail">
            {HOME_JOURNEY.map((item) => (
              <li key={item.rail}>
                <span>{item.step.n}</span>
                <strong>{item.rail}</strong>
                <p>{item.step.body}</p>
              </li>
            ))}
          </ol>
          <Link className="btn-ghost" href="/how-it-works">
            Full 7-step journey
          </Link>
        </div>
      </section>

      <section id="calculator">
        <div className="shell split">
          <div>
            <p className="eyebrow">Home country versus India</p>
            <h2>What does the whole journey look like?</h2>
            <p className="section-lede">
              Compare more than a treatment price. Think about the full
              journey: expected healthcare costs at home, expected treatment
              cost in India, travel, accommodation, companion costs, recovery
              and follow-up.
            </p>
            <p>
              Sometimes India may offer strong value. Sometimes it may not.
              The calculator is an estimate only. Savings are not guaranteed.
            </p>
          </div>
          <CostCalculator />
        </div>
      </section>

      <section className="band-navy">
        <div className="shell split">
          <div>
            <p className="eyebrow">Return-home planning</p>
            <h2>Treatment may happen in India. Your life continues at home.</h2>
          </div>
          <div>
            <p>
              Planning does not end when treatment ends. Travel, recovery,
              follow-up and communication with healthcare professionals at home
              all matter. DCredit does not itself provide clinical follow-up.
            </p>
          </div>
        </div>
      </section>

      <section className="band-soft" id="faq">
        <div className="shell split">
          <div>
            <p className="eyebrow">Questions</p>
            <h2>Asked plainly.</h2>
            <Link href="/faq">All questions →</Link>
          </div>
          <div className="faq">
            {FAQS.slice(0, 6).map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell final-cta">
          <p className="eyebrow">$5 Initial Assessment</p>
          <h2>Could India be worth considering for you?</h2>
          <p className="section-lede">
            Start with a conversation. Understand the possibilities. Decide for
            yourself.
          </p>
          <div className="hero-actions">
            <Link className="btn-solid" href="/enroll">
              Start my $5 Assessment
            </Link>
            <Link className="btn-ghost" href="/how-it-works">
              Explore how it works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
