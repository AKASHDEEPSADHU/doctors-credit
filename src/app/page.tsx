import Link from "next/link";
import CostCalculator from "@/components/CostCalculator";
import { IndiaDecisionMap } from "@/components/IndiaDecisionMap";
import RealityCheck from "@/components/RealityCheck";
import Reveal from "@/components/Reveal";
import { currentPackage } from "@/lib/packages";
import { FAQS } from "@/lib/faq";
import { JOURNEY, PROTECT, TRUST_PILLARS } from "@/lib/journey";
import { INDIA_STATS, SOURCES } from "@/lib/sources";
import { SUITABILITY_LABEL, TREATMENTS, suitabilityClass } from "@/lib/treatments";

const featured = TREATMENTS.filter((t) =>
  ["knee-replacement", "ivf", "dental-implants", "cabg", "cataract", "hip-replacement"].includes(
    t.slug
  )
);

const assessment = currentPackage();

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">International patients · Planned care · India options</p>
            <h1>Could India be the right place for the care you are considering?</h1>
            <p className="lede">
              DCredit helps people considering planned care across borders
              understand whether India is worth investigating for their
              particular situation. The decision is not based on cost alone. It
              may involve specialist expertise, treatment capability, hospital
              quality systems, technology, availability, timing, travel
              requirements, total expected cost and continuity of care after
              returning home.
            </p>
            <div className="hero-actions">
              <Link className="btn-solid" href="/enroll">
                Start my $5 Assessment
              </Link>
              <a className="btn-ghost" href="#how">
                See how it works
              </a>
            </div>
            <p className="trust-mini">
              Wondering whether India is worth considering for your situation?
              Start with a conversation about whether exploring India makes
              sense for you. This is not a clinical assessment, diagnosis or
              medical clearance.
            </p>
          </div>
          <div className="hero-visual">
            <p className="eyebrow">The journey we actually map</p>
            <ul className="path-rail">
              <li>Home</li>
              <li>Decision support</li>
              <li>India options</li>
              <li>Practical review</li>
              <li>Your decision</li>
              <li>Home</li>
            </ul>
            <p className="section-lede" style={{ marginTop: "1.4rem" }}>
              We do not begin by selling an Indian hospital. We begin by
              understanding your situation, and we will not recommend exploring
              India simply because a treatment price looks lower.
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

      <section className="band-soft">
        <div className="shell editorial-split">
          <figure className="editorial-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/editorial/innovation-laboratory.jpg"
              alt="Laboratory work illustrating healthcare capability that should be investigated at the provider level, not assumed from a destination."
            />
            <figcaption>
              Some Indian tertiary centres offer highly specialized care and
              advanced technology. Provider-level evidence still matters.
            </figcaption>
          </figure>
          <div>
            <p className="eyebrow">Quality first</p>
            <h2>Quality deserves to be investigated directly.</h2>
            <p className="section-lede">
              India should be considered on more than price. Relevant
              accreditation, specialist experience, hospital infrastructure,
              ICU capability where relevant, technology, patient safety
              systems, infection control and post-treatment planning all belong
              in the picture.
            </p>
            <p>
              Capabilities vary by hospital, department and physician.
              Accreditation is useful information, but it is not a guarantee of
              outcome. DCredit will publish provider information only when it
              can be checked against reliable sources.
            </p>
          </div>
        </div>
      </section>

      <IndiaDecisionMap />

      <section>
        <div className="shell split">
          <Reveal>
            <p className="eyebrow">The decision</p>
            <h2>Cost is part of the decision, not the entire decision.</h2>
          </Reveal>
          <Reveal>
            <p className="section-lede">
              A lower quoted treatment price does not automatically make a
              medical journey better. The meaningful comparison is the complete
              picture: expected healthcare costs at home, expected treatment
              cost in India, travel, accommodation, companion costs, time away
              from home, recovery, possible follow-up and continuity of care.
            </p>
            <p>
              Sometimes India may offer strong value. Sometimes it may not.
              High cost does not automatically mean higher quality either.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band-soft" id="calculator">
        <div className="shell split">
          <div>
            <p className="eyebrow">Compare the total journey</p>
            <h2>Home country versus India.</h2>
            <p className="section-lede">
              If expected costs at home are $5,500 and the India journey is
              $7,500, India may not offer better value. That is exactly why
              DCredit exists. The calculator is an estimate only, not a quote
              and not medical advice. Savings are not guaranteed.
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
              We are building DCredit in stages, starting with the decision
              itself. The current paid service is the $5 Initial Assessment: a
              conversation that helps you decide whether exploring India further
              may be worth investigating. You have not already chosen India by
              starting that conversation.
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
            <p className="eyebrow">Why India</p>
            <h2>Why might someone consider India?</h2>
          </div>
          <div>
            <p className="section-lede">
              Possible reasons to investigate include specialist expertise,
              specific treatment capability, advanced technology, access to
              certain procedures, availability and timing, healthcare
              infrastructure, total value, cost and international patient
              experience. These are reasons to investigate, not guarantees.
            </p>
            <p className="section-lede">
              Whether you are considering care from the United States, Canada,
              Europe, Australia, Africa, the Middle East or elsewhere, the
              question remains the same: could India be the right place for the
              care you are considering?
            </p>
          </div>
        </div>
      </section>

      <section className="band-navy">
        <div className="shell split">
          <div>
            <p className="eyebrow">Honesty</p>
            <h2>India is not automatically the right answer.</h2>
          </div>
          <div>
            <p>
              Stay where you are when the real math, the medicine, or the
              travel risk says so. Emergencies, unstable cardiac conditions,
              urgent stroke, acute trauma, and cases where long-distance travel
              is unsafe are not DCredit pathways.
            </p>
            <p>
              Sometimes India may make sense. Sometimes it may not. Either way,
              you deserve to know.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="shell split">
          <div>
            <p className="eyebrow">Evidence</p>
            <h2>India has a healthcare ecosystem worth investigating.</h2>
            <p className="section-lede">
              India has major tertiary-care hospitals and specialized centres.
              Some Indian institutions have developed extensive expertise in
              complex procedures. Selected hospitals offer advanced
              technologies such as robotic surgery and proton therapy.
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
              later published, they will be labeled by source. We do not invent
              accreditation.
            </p>
            <p>
              <Link href="/india-medical-achievements">India&apos;s Medical Achievements →</Link>
            </p>
            <Link href="/hospitals">How we will publish hospitals →</Link>
          </div>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell">
          <p className="eyebrow">Treatments</p>
          <h2>What should you investigate?</h2>
          <p className="section-lede">
            These notes are editorial and informational. They do not determine
            whether any individual patient should travel. Speak with your own
            healthcare professionals before making a treatment decision.
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
        <div className="shell split">
          <div>
            <p className="eyebrow">Hospitals</p>
            <h2>Provider-level evidence matters.</h2>
          </div>
          <div>
            <p className="section-lede">
              Verified provider profiles are being developed. DCredit will
              publish provider information only when it can be checked against
              reliable sources. Until then, we will not populate a directory
              with invented names, logos or outcomes. DCredit does not operate
              or own hospitals.
            </p>
            <Link href="/hospitals">Hospital information →</Link>
          </div>
        </div>
      </section>

      <section className="band-soft">
        <div className="shell split">
          <div>
            <p className="eyebrow">Return-home planning</p>
            <h2>The journey does not end when treatment ends.</h2>
          </div>
          <div>
            <p className="section-lede">
              Continuity of care matters: discharge information, medications,
              imaging, follow-up, travel fitness and communication with
              healthcare professionals at home. In V1 we explain why
              return-home planning belongs in the decision. A detailed
              return-home packet or clinician handoff is a future service.
              DCredit does not itself provide clinical follow-up.
            </p>
          </div>
        </div>
      </section>

      <section id="reality">
        <div className="shell split">
          <div>
            <p className="eyebrow">DCredit Reality Check</p>
            <h2>Green, yellow, or red: an informational screening aid.</h2>
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
              <p>Foreign medical-purpose arrivals to India in 2025. Not a count from any one country.</p>
            </div>
            <div>
              <strong>{INDIA_STATS.fta2025}</strong>
              <p>Total foreign tourist arrivals. Medical-purpose share {INDIA_STATS.medicalShare}.</p>
            </div>
            <div>
              <strong>CDC</strong>
              <p>
                For example, in the United States, CDC background material
                describes residents traveling abroad for medical care, with
                real risks DCredit exists to help you think through, not to
                erase.
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
            <p className="eyebrow">$5 Initial Assessment</p>
            <h2>Your health. Your decision.</h2>
            <p className="section-lede">
              {assessment.blurb}
            </p>
            <p className="section-lede">
              There is no obligation to continue. Savings are not guaranteed.
              This is not medical advice, insurance verification or a specialist
              consultation.
            </p>
            <div className="hero-actions">
              <Link className="btn-solid" href="/enroll">
                Start my $5 Assessment
              </Link>
              <Link className="btn-ghost" href="/reality-check">
                Try the Reality Check
              </Link>
            </div>
          </div>
          <article className="treat-card">
            <small>{assessment.priceLabel}</small>
            <h3>{assessment.name}</h3>
            <p className="muted">What it includes</p>
            <ul className="protect" style={{ columns: 1 }}>
              {assessment.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="muted" style={{ marginTop: "1rem" }}>
              What it does not include
            </p>
            <ul className="protect" style={{ columns: 1 }}>
              {assessment.excludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="fine">{assessment.note}</p>
          </article>
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
