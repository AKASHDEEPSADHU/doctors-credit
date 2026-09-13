import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import { IndiaDecisionMap } from "@/components/IndiaDecisionMap";
import { PatientStoriesGrid } from "@/components/PatientStoriesGrid";
import Reveal from "@/components/Reveal";
import { FAQS } from "@/lib/faq";
import { JOURNEY } from "@/lib/journey";
import { publishedStories } from "@/lib/patient-stories";
import { SUITABILITY_LABEL, TREATMENTS, suitabilityClass } from "@/lib/treatments";

const featured = TREATMENTS.filter((t) =>
  ["knee-replacement", "ivf", "dental-implants", "cabg", "cataract", "hip-replacement"].includes(
    t.slug
  )
);

const TREAT_VISUAL: Record<string, { src: string; position: string }> = {
  "knee-replacement": {
    src: "/images/editorial/innovation-laboratory.jpg",
    position: "50% 40%",
  },
  ivf: {
    src: "/images/editorial/hero-india-care.jpg",
    position: "50% 30%",
  },
  "dental-implants": {
    src: "/images/editorial/innovation-laboratory.jpg",
    position: "70% 55%",
  },
  cabg: {
    src: "/images/editorial/innovation-imaging.jpg",
    position: "50% 45%",
  },
  cataract: {
    src: "/images/editorial/innovation-imaging.jpg",
    position: "30% 20%",
  },
  "hip-replacement": {
    src: "/images/editorial/hero-india-care.jpg",
    position: "62% 55%",
  },
};

const CAPABILITIES = [
  {
    title: "World-class",
    line: "Specialists",
    text: "Renowned doctors and centres of excellence",
    icon: "expertise",
  },
  {
    title: "Modern",
    line: "Hospitals",
    text: "Advanced technology and global standards",
    icon: "hospital",
  },
  {
    title: "Compassionate",
    line: "Care",
    text: "Patients are treated with respect and warmth",
    icon: "care",
  },
  {
    title: "Greater",
    line: "Value",
    text: "High-quality care with significant cost advantages",
    icon: "value",
  },
  {
    title: "A smoother",
    line: "Journey",
    text: "Support from planning to your return home",
    icon: "journey",
  },
  {
    title: "Better",
    line: "Tomorrows",
    text: "People return to their lives with renewed hope",
    icon: "people",
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
  { title: "Accreditation", icon: "hospital" },
  { title: "Specialist experience", icon: "expertise" },
  { title: "Technology", icon: "tech" },
  { title: "Infrastructure", icon: "value" },
  { title: "Patient safety", icon: "care" },
  { title: "Continuity", icon: "journey" },
] as const;

const REGIONS = [
  "North America",
  "Europe",
  "Australia",
  "Africa",
  "Middle East",
  "Asia",
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

function LineIcon({
  name,
}: {
  name: (typeof CAPABILITIES)[number]["icon"] | "tech";
}) {
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
      {name === "people" ? (
        <>
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="16" cy="9" r="1.8" />
          <path d="M4.6 18.4c.5-2.8 2.2-4.3 4.4-4.3s3.9 1.5 4.4 4.3" />
          <path d="M13.6 18.4c.3-1.8 1.4-2.9 2.8-2.9 1.5 0 2.6 1.1 2.9 2.9" />
        </>
      ) : null}
    </svg>
  );
}

export default function Home() {
  const liveStories = publishedStories();
  const hasStories = liveStories.length > 0;

  return (
    <main id="main">
      <section className="hero-scene" aria-label="Doctor's Credit homepage">
        <div className="hero-copy-wrap">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">World-class care. A brighter tomorrow.</p>
            <h1>
              India is a global
              <br />
              destination for
              <br />
              <span>life-changing care.</span>
            </h1>
            <p className="hero-lede">
              People from around the world choose India for advanced medical
              expertise, modern hospitals, compassionate care and outstanding
              value. We help you explore whether India is the right choice for
              your treatment journey.
            </p>
            <p className="hero-support">
              Start a conversation about your planned care, goals, timing and
              whether India may be worth exploring.
            </p>
            <div className="hero-actions">
              <Link className="btn-solid hero-cta" href="/enroll">
                Talk to a care coordinator
                <span aria-hidden="true">→</span>
              </Link>
              <button className="hero-watch" type="button">
                <span className="hero-watch-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10.2" />
                    <path d="M10 8.6v6.8l6-3.4z" />
                  </svg>
                </span>
                <span className="hero-watch-copy">
                  <strong>Watch our story</strong>
                  <small>2 minutes</small>
                </span>
              </button>
            </div>
          </div>
        </div>

        <figure className="hero-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/editorial/hero-gateway-couple.jpg"
            width={2000}
            height={1333}
            alt="Editorial photograph of a relaxed international couple at a historic waterfront in India. Generated imagery, not a photograph of DCredit patients."
            fetchPriority="high"
          />
          <figcaption className="sr-only">
            Editorial imagery. Not a DCredit patient, testimonial or hospital
            affiliation.
          </figcaption>
          <p className="hero-handwrite" aria-hidden="true">
            “New Treatment
            <br />
            New Hope
            <br />
            A Brighter Tomorrow”
            <span className="hero-handwrite-stroke" />
          </p>
        </figure>
      </section>

      <section className="capability-strip" aria-label="Capabilities found across India healthcare">
        <div className="shell">
          <ul className="capability-grid">
            {CAPABILITIES.map((item, index) => (
              <li key={item.line} style={{ animationDelay: `${index * 80}ms` }}>
                <LineIcon name={item.icon} />
                <strong>
                  {item.title}
                  <span>{item.line}</span>
                </strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="story-band" id="stories">
        <div className="shell story-split">
          <Reveal>
            <p className="eyebrow">Real patient stories</p>
            <h2 className="home-display">
              Lives changed.
              <br />
              Futures regained.
            </h2>
            <p className="section-lede">
              {hasStories
                ? "Patient stories, shared with permission."
                : "We are building this section from real patient experiences. Verified stories will appear here as patients choose to share them."}
            </p>
            <Link className="btn-ghost story-cta" href="/stories">
              {hasStories ? "Read more patient stories" : "Patient stories coming soon"}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <PatientStoriesGrid stories={liveStories} />
        </div>
      </section>

      <IndiaDecisionMap />

      <section>
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Quality</p>
            <h2 className="home-display">Quality deserves to be investigated.</h2>
            <p className="section-lede">
              India is a large and diverse healthcare market. Capabilities vary
              by hospital, department and physician. That is why provider-level
              information matters.
            </p>
          </Reveal>
          <ul className="quality-ribbon">
            {QUALITY_LENSES.map((item) => (
              <li key={item.title}>
                <LineIcon name={item.icon} />
                <strong>{item.title}</strong>
              </li>
            ))}
          </ul>
          <p>
            DCredit does not assume that every hospital or physician offers the
            same level of care. Accreditation is useful information, but it is
            not a guarantee of outcome.
          </p>
          <p className="section-link">
            <Link href="/hospitals">How we evaluate providers →</Link>
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
          <Reveal>
            <p className="eyebrow">India&apos;s Medical Achievements</p>
            <h2 className="home-display">A healthcare story that goes beyond affordability.</h2>
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
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Treatments</p>
            <h2 className="home-display">Where India&apos;s capabilities may be worth exploring.</h2>
            <p className="section-lede">
              Different treatments call for different questions. Explore the
              procedures and specialties people commonly investigate in India.
            </p>
          </Reveal>
          <div className="treat-visual-grid">
            {featured.map((t) => {
              const visual = TREAT_VISUAL[t.slug];
              return (
                <Link className="treat-visual" href={`/treatments/${t.slug}`} key={t.slug}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visual.src}
                    alt=""
                    style={{ objectPosition: visual.position }}
                  />
                  <div className="treat-visual-body">
                    <small>{t.category}</small>
                    <h3>{t.name}</h3>
                    <p className="muted">{t.why}</p>
                    <span className={suitabilityClass(t.suitability)}>
                      {SUITABILITY_LABEL[t.suitability]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="section-link">
            <Link href="/treatments">All treatments →</Link>
          </p>
        </div>
      </section>

      <section className="band-soft">
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

      <section id="how">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">The journey</p>
            <h2 className="home-display">A structured decision. Not a sales pitch.</h2>
            <p className="section-lede">
              You have not already chosen India by starting this conversation.
              Your first step is a conversation with a DCredit care coordinator.
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

      <section className="band-soft" id="calculator">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Total value</p>
            <h2 className="home-display">It is not only about the price.</h2>
            <p className="section-lede">
              Cost may be part of the reason someone looks abroad. It should not
              be the only reason. Cost is one part of total value.
            </p>
          </Reveal>
          <ul className="value-formula">
            {VALUE_LENSES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="split cost-split">
            <div>
              <p className="section-lede">
                A treatment price is only one part of a medical journey. The
                fuller picture includes healthcare costs at home, treatment
                cost in India, travel, accommodation, companion costs, recovery
                time, follow-up and continuity of care.
              </p>
              <p>
                Sometimes India may offer strong value. Sometimes it may not.
                The calculator is an estimate only. Savings are not guaranteed.
              </p>
            </div>
            <CostCalculator />
          </div>
        </div>
      </section>

      <section className="band-navy return-band">
        <div className="shell return-split">
          <div>
            <p className="eyebrow">Return-home planning</p>
            <h2 className="home-display">
              Treatment may happen in India.
              <br />
              Your life continues at home.
            </h2>
          </div>
          <p>
            Planning does not end when treatment ends. Travel, recovery,
            follow-up and communication with healthcare professionals at home
            all matter. DCredit does not itself provide clinical follow-up.
          </p>
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
          <p className="eyebrow">Your first step is a conversation</p>
          <h2 className="home-display">Could India be worth considering for you?</h2>
          <p className="section-lede">
            Start with a conversation. Understand the possibilities. Decide for
            yourself.
          </p>
          <div className="hero-actions">
            <Link className="btn-solid" href="/enroll">
              Talk to a care coordinator
            </Link>
            <Link className="btn-ghost" href="/india-medical-achievements">
              Explore India&apos;s Medical Achievements
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
