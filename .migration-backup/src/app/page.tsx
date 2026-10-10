import { Fragment } from "react";
import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import { IndiaDecisionMap } from "@/components/IndiaDecisionMap";
import { PatientStoriesGrid } from "@/components/PatientStoriesGrid";
import { FeedbackSlider } from "@/components/editorial/FeedbackSlider";
import Reveal from "@/components/Reveal";
import { FAQS } from "@/lib/faq";
import { JOURNEY } from "@/lib/journey";
import { STORY_CONSENT_COPY, publishedStories } from "@/lib/patient-stories";
import { SUITABILITY_LABEL, TREATMENTS, suitabilityClass } from "@/lib/treatments";
import { getPages } from "@/lib/i18n/server";

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

// Icons stay here; every visible string comes from lib/i18n/pages.ts (same order).
const CAPABILITY_ICONS = [
  "expertise",
  "hospital",
  "care",
  "value",
  "journey",
  "people",
] as const;

const QUALITY_ICONS = [
  "hospital",
  "expertise",
  "tech",
  "value",
  "care",
  "journey",
] as const;

// Step numbers shown on the homepage rail (the rail skips step 04 by design).
const JOURNEY_NUMBERS = [
  JOURNEY[0].n,
  JOURNEY[1].n,
  JOURNEY[2].n,
  JOURNEY[4].n,
  JOURNEY[5].n,
  JOURNEY[6].n,
  "07",
] as const;

function LineIcon({
  name,
}: {
  name: (typeof CAPABILITY_ICONS)[number] | "tech";
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

export default async function Home() {
  const { t } = await getPages();
  const h = t.home;
  const liveStories = publishedStories();
  const hasStories = liveStories.length > 0;

  return (
    <main id="main">
      <section className="ed-home-hero" aria-label={h.heroAria}>
        <div className="ed-hero-bleed">
          <div className="ed-hero-copy">
            <p className="ed-label">{h.heroLabel}</p>
            <h1>
              {h.heroBefore}
              <em>{h.heroEm}</em>
              {h.heroAfter}
            </h1>
            <p className="ed-lede">{h.heroLede}</p>
            <div className="hero-actions">
              <Link className="btn-solid" href="/enroll">
                {h.talk}
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
                  <strong>{h.watchTitle}</strong>
                  <small>{h.watchSub}</small>
                </span>
              </button>
            </div>
          </div>
          <figure className="ed-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/hero-gateway-couple.jpg"
              width={2000}
              height={1333}
              alt={h.heroAlt}
              fetchPriority="high"
            />
            <p className="ed-handwrite" aria-hidden="true">
              {h.handwrite.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
              <span />
            </p>
            <FeedbackSlider variant="float" />
          </figure>
        </div>
      </section>

      <section className="ed-band" aria-label={h.capabilitiesAria}>
        <div className="shell">
          <ul>
            {h.capabilities.map((item, i) => (
              <li key={item.line}>
                <LineIcon name={CAPABILITY_ICONS[i]} />
                <strong>
                  {item.title} {item.line}
                </strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ed-home-stories" id="stories">
        <div className="shell ed-home-split">
          <Reveal>
            <p className="ed-label">{h.stories.label}</p>
            <h2 className="ed-display">
              {h.stories.lines[0]}
              <br />
              {h.stories.lines[1]}
            </h2>
            <p className="section-lede">
              {hasStories ? h.stories.liveLede : STORY_CONSENT_COPY}
            </p>
            <Link className="btn-ghost story-cta" href="/stories">
              {h.stories.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          {hasStories ? (
            <PatientStoriesGrid stories={liveStories} />
          ) : (
            <FeedbackSlider variant="panel" />
          )}
        </div>
      </section>

      <IndiaDecisionMap />

      <section>
        <div className="shell">
          <Reveal>
            <p className="ed-label">{h.quality.label}</p>
            <h2 className="ed-display">{h.quality.title}</h2>
            <p className="section-lede">{h.quality.lede}</p>
          </Reveal>
          <ul className="quality-ribbon is-compact">
            {h.quality.lenses.map((title, i) => (
              <li key={QUALITY_ICONS[i] + title}>
                <LineIcon name={QUALITY_ICONS[i]} />
                <strong>{title}</strong>
              </li>
            ))}
          </ul>
          <p>{h.quality.note}</p>
          <p className="section-link">
            <Link href="/hospitals">{h.quality.link}</Link>
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
              alt={h.achievements.imgAlt}
              loading="lazy"
            />
            <figcaption>{h.achievements.caption}</figcaption>
          </figure>
          <Reveal>
            <p className="ed-label">{h.achievements.label}</p>
            <h2 className="ed-display">{h.achievements.title}</h2>
            <p className="section-lede">{h.achievements.lede}</p>
            <p>{h.achievements.body}</p>
            <Link className="btn-solid" href="/india-medical-achievements">
              {h.achievements.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="shell">
          <Reveal>
            <p className="ed-label">{h.treatments.label}</p>
            <h2 className="ed-display">{h.treatments.title}</h2>
            <p className="section-lede">{h.treatments.lede}</p>
          </Reveal>
          <div className="treat-mosaic">
            {featured.map((tr) => {
              const visual = TREAT_VISUAL[tr.slug];
              return (
                <Link className="treat-visual" href={`/treatments/${tr.slug}`} key={tr.slug}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visual.src}
                    alt=""
                    style={{ objectPosition: visual.position }}
                  />
                  <div className="treat-visual-body">
                    <small>{tr.category}</small>
                    <h3>{tr.name}</h3>
                    <p className="muted">{tr.why}</p>
                    <span className={suitabilityClass(tr.suitability)}>
                      {SUITABILITY_LABEL[tr.suitability]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="section-link">
            <Link href="/treatments">{h.treatments.all}</Link>
          </p>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <p className="ed-label">{h.regions.label}</p>
          <h2>{h.regions.title}</h2>
          <p className="section-lede">{h.regions.lede}</p>
          <ul className="region-grid is-compact">
            {h.regions.items.map((region) => (
              <li key={region}>{region}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how">
        <div className="shell">
          <Reveal>
            <p className="ed-label">{h.journey.label}</p>
            <h2 className="ed-display">{h.journey.title}</h2>
            <p className="section-lede">{h.journey.lede}</p>
          </Reveal>
          <ol className="journey-rail">
            {h.journey.rail.map((item, i) => (
              <li key={JOURNEY_NUMBERS[i] + item.rail}>
                <span>{JOURNEY_NUMBERS[i]}</span>
                <strong>{item.rail}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <Link className="btn-ghost" href="/how-it-works">
            {h.journey.full}
          </Link>
        </div>
      </section>

      <section className="band-soft" id="calculator">
        <div className="shell">
          <Reveal>
            <p className="ed-label">{h.value.label}</p>
            <h2 className="ed-display">{h.value.title}</h2>
            <p className="section-lede">{h.value.lede}</p>
          </Reveal>
          <ul className="value-formula">
            {h.value.lenses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="split cost-split">
            <div>
              <p className="section-lede">{h.value.p1}</p>
              <p>{h.value.p2}</p>
            </div>
            <CostCalculator />
          </div>
        </div>
      </section>

      <section className="band-navy return-band">
        <div className="shell return-split">
          <div>
            <p className="ed-label">{h.returnBand.label}</p>
            <h2 className="ed-display">
              {h.returnBand.lines[0]}
              <br />
              {h.returnBand.lines[1]}
            </h2>
          </div>
          <p>{h.returnBand.body}</p>
        </div>
      </section>

      <section className="band-soft" id="faq">
        <div className="shell split">
          <div>
            <p className="ed-label">{h.faq.label}</p>
            <h2>{h.faq.title}</h2>
            <Link href="/faq">{h.faq.all}</Link>
          </div>
          <div className="faq faq-editorial">
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
          <p className="ed-label">{h.finalCta.label}</p>
          <h2 className="ed-display">{h.finalCta.title}</h2>
          <p className="section-lede">{h.finalCta.lede}</p>
          <div className="hero-actions">
            <Link className="btn-solid" href="/enroll">
              {h.talk}
            </Link>
            <Link className="btn-ghost" href="/india-medical-achievements">
              {h.finalCta.achievements}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
