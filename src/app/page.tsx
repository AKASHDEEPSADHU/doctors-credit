import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import RealityCheck from "@/components/RealityCheck";
import Reveal from "@/components/Reveal";
import { PACKAGES } from "@/lib/packages";
import { FAQS } from "@/lib/faq";
import { JOURNEY, PROTECT, TRUST_PILLARS } from "@/lib/journey";
import { INDIA_STATS, SOURCES } from "@/lib/sources";
import { TREATMENTS } from "@/lib/treatments";

const featured = TREATMENTS.filter((t) =>
  ["knee-replacement", "ivf", "dental-implants", "cabg", "cataract", "hip-replacement"].includes(
    t.slug
  )
);

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">US patients · Planned care · India options</p>
            <h1>Could India be the smarter choice for your planned treatment?</h1>
            <p className="lede">
              DCredit helps US patients compare the real cost, medical options,
              timeline and logistics of receiving planned treatment in India —
              before making a decision.
            </p>
            <div className="hero-actions">
              <Link className="btn-solid" href="/enroll">
                Start my $5 consultation
              </Link>
              <a className="btn-ghost" href="#how">
                See how it works
              </a>
            </div>
            <p className="trust-mini">
              Independent decision support. Transparent costs. Coordinated care.
            </p>
          </div>
          <div className="hero-visual">
            <p className="eyebrow">The journey we actually map</p>
            <ul className="path-rail">
              <li>USA</li>
              <li>Clinical review</li>
              <li>India specialist</li>
              <li>Treatment</li>
              <li>Recovery</li>
              <li>USA</li>
            </ul>
            <p className="section-lede" style={{ marginTop: "1.4rem" }}>
              We do not begin by selling an Indian hospital. We begin by
              understanding your situation — and we will not recommend India
              simply because treatment is cheaper.
            </p>
          </div>
        </div>
      </section>

      <p className="trust-line">
        <span>Not a hospital</span>
        <span>Not a diagnosis</span>
        <span>No guaranteed savings</span>
        <span>No emergency care</span>
      </p>

      <section>
        <div className="shell split">
          <Reveal>
            <p className="eyebrow">The problem</p>
            <h2>Healthcare shouldn’t be a financial mystery.</h2>
          </Reveal>
          <Reveal>
            <p className="section-lede">
              A US hospital price is not what you pay. An India hospital quote is
              not the journey. We compare estimated US patient responsibility
              against the complete India journey — flights, visa, stay,
              companion costs and follow-up — then tell you if the trip is even
              worth discussing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft" id="calculator">
        <div className="shell split">
          <div>
            <p className="eyebrow">Don’t compare hospital bills</p>
            <h2>Compare your real cost.</h2>
            <p className="section-lede">
              If your US exposure is $5,500 and the India journey is $7,500,
              India may not save you money. That’s exactly why DCredit exists.
            </p>
          </div>
          <CostCalculator />
        </div>
      </section>

      <section id="how">
        <div className="shell split">
          <div>
            <p className="eyebrow">How DCredit works</p>
            <h2>A structured decision. Not a sales pitch.</h2>
            <p className="section-lede">
              For $5, speak with a care coordinator who will understand your
              treatment need, insurance situation, timeline and goals.
            </p>
            <Link className="btn-solid" href="/how-it-works">
              Full 7-step journey
            </Link>
          </div>
          <div className="steps">
            {JOURNEY.map((s) => (
              <article className="step" key={s.n}>
                <span>{s.n}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p className="muted">{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell split">
          <div>
            <p className="eyebrow">Why patients look abroad</p>
            <h2>Why patients consider India.</h2>
          </div>
          <div>
            <p className="section-lede">
              High deductibles. Limited dental or fertility coverage. Cash prices
              that do not match billed charges. Sometimes access and scheduling
              matter as much as money. Appointment availability varies by
              hospital, doctor, procedure and condition — we do not claim zero
              waiting time.
            </p>
            <p className="section-lede">
              We will not recommend India simply because treatment is cheaper.
            </p>
          </div>
        </div>
      </section>

      <section className="band-navy">
        <div className="shell split">
          <div>
            <p className="eyebrow">Honesty</p>
            <h2>But India isn’t always the answer.</h2>
          </div>
          <div>
            <p>
              Stay in the US when the real math, the medicine, or the travel risk
              says so. Emergencies, unstable cardiac conditions, urgent stroke,
              acute trauma, and cases where long-distance travel is unsafe are
              not DCredit pathways.
            </p>
            <p>Sometimes the right answer is India. Sometimes it isn’t. We’ll tell you which.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="shell split">
          <div>
            <p className="eyebrow">Quality</p>
            <h2>Lower cost does not have to mean lower standards.</h2>
            <p className="section-lede">
              India has major tertiary-care hospitals with internationally
              recognized accreditation systems and highly specialized clinicians.
              DCredit evaluates healthcare providers individually. We never claim
              that all Indian hospitals are world-class.
            </p>
          </div>
          <div>
            <p>
              <strong>NABH</strong> is an independent accreditation framework
              focused on healthcare quality and patient safety, covering patient
              rights, infection control, medication management and quality
              improvement. Source: {SOURCES.nabh.publisher}. Accreditation is not
              a guarantee of outcome.
            </p>
            <p className="muted">
              Where JCI, bed counts, ICU capability or procedure volume are
              published, they are labeled by source. We do not invent
              accreditation.
            </p>
            <Link href="/hospitals">How we verify hospitals →</Link>
          </div>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <p className="eyebrow">Treatments</p>
          <h2>Where India may make the most sense.</h2>
          <div className="treat-grid">
            {featured.map((t) => (
              <Link className="treat-card" href={`/treatments/${t.slug}`} key={t.slug}>
                <small>{t.category}</small>
                <h3>{t.name}</h3>
                <p className="muted">{t.why}</p>
                <span
                  className={
                    t.suitability === "YES"
                      ? "flag flag-yes"
                      : t.suitability === "POSSIBLY"
                        ? "flag flag-maybe"
                        : "flag flag-no"
                  }
                >
                  Medical travel: {t.suitability}
                </span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem" }}>
            <Link href="/treatments">All treatments →</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="shell split">
          <div>
            <p className="eyebrow">Hospitals</p>
            <h2>We verify before we publish.</h2>
          </div>
          <div>
            <p className="section-lede">
              Profiles appear only after accreditation and key facts are checked
              against official sources. Until then, we will not populate a
              directory with invented names, logos or outcomes.
            </p>
            <Link href="/hospitals">Hospital verification →</Link>
          </div>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell split">
          <div>
            <p className="eyebrow">Return-home plan</p>
            <h2>Your journey doesn’t end when you leave India.</h2>
          </div>
          <div>
            <p className="section-lede">
              Discharge summary, operative notes, medications, imaging, labs,
              follow-up schedule, warning signs and recommended US review —
              packed so a US clinician can continue care. DCredit does not itself
              provide US medical treatment.
            </p>
          </div>
        </div>
      </section>

      <section id="reality">
        <div className="shell split">
          <div>
            <p className="eyebrow">DCredit Reality Check</p>
            <h2>Green, yellow, or red — not a diagnosis.</h2>
            <ul className="protect">
              {PROTECT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <RealityCheck />
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <p className="eyebrow">Medical travel intelligence</p>
          <h2>Data, with sources.</h2>
          <div className="stat-row">
            <div>
              <strong>{INDIA_STATS.medicalPurpose2025}</strong>
              <p>Foreign medical-purpose arrivals to India in 2025. Not a US-patient count.</p>
            </div>
            <div>
              <strong>{INDIA_STATS.fta2025}</strong>
              <p>Total foreign tourist arrivals. Medical-purpose share {INDIA_STATS.medicalShare}.</p>
            </div>
            <div>
              <strong>CDC</strong>
              <p>
                US residents do travel abroad for medical care — with real risks
                DCredit exists to help coordinate, not to erase.
              </p>
            </div>
          </div>
          <p className="source">
            India figures: {SOURCES.indiaMedicalArrivals2025.publisher}. Last
            verified {SOURCES.indiaMedicalArrivals2025.verified}.{" "}
            <Link href="/research">Research notes →</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="shell split">
          <div>
            <p className="eyebrow">Patient stories</p>
            <h2>DCredit stories coming soon.</h2>
          </div>
          <p className="section-lede">
            We do not publish fictional patients or fabricated testimonials.
            Verified stories, with permission, will appear here.
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
            {FAQS.slice(0, 8).map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell split">
          <div>
            <p className="eyebrow">Begin</p>
            <h2>Your health. Your money. Your decision.</h2>
            <p className="section-lede">
              DCredit gives you the information, medical coordination and support
              to make that decision with confidence.
            </p>
            <div className="hero-actions">
              <Link className="btn-solid" href="/enroll">
                Start my $5 assessment
              </Link>
              <Link className="btn-ghost" href="/reality-check">
                See if India makes sense for me
              </Link>
            </div>
          </div>
          <div className="treat-grid" style={{ gridTemplateColumns: "1fr" }}>
            {PACKAGES.map((p) => (
              <article className="treat-card" key={p.sku}>
                <small>{p.priceLabel}</small>
                <h3>{p.name}</h3>
                <p className="muted">{p.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <p className="eyebrow">Why trust DCredit?</p>
          <div className="pillars">
            {TRUST_PILLARS.map((p) => (
              <article key={p.t}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
