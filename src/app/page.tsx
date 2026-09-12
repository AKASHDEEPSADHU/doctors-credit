import EnrollForm from "@/components/EnrollForm";
import Founders from "@/components/Founders";
import HeroArt from "@/components/HeroArt";
import Reveal from "@/components/Reveal";
import ServicesRail from "@/components/ServicesRail";
import WhyDoctorsCredit from "@/components/WhyDoctorsCredit";
import { PACKAGES } from "@/lib/packages";
import { SITE } from "@/lib/contact";
import { getSession } from "@/lib/session";
import { getPatientById } from "@/lib/store";

const tensions = [
  {
    k: "01",
    t: "The condition",
    d: "A new diagnosis arrives in language that is not yours. You need it in human words before you can choose anything else.",
  },
  {
    k: "02",
    t: "The money",
    d: "Sticker prices at home are not what you actually pay. Sticker prices abroad are not the journey. We count both.",
  },
  {
    k: "03",
    t: "The place",
    d: "Hyderabad has many excellent rooms. They are not interchangeable. The right theatre for a knee is not the right theatre for a valve.",
  },
  {
    k: "04",
    t: "The time",
    d: "Some things can wait. Some cannot. Flying too soon and waiting too long are both a kind of harm.",
  },
];

const steps = [
  [
    "Sign in",
    "Google opens the file. Nothing is charged until you choose a beginning.",
  ],
  [
    "We listen to the case",
    "Not to sell a package. To see whether direction here is honest.",
  ],
  [
    "A map, then a door",
    "Which kind of hospital, what to ask, what it costs, when to fly.",
  ],
  [
    "You choose the clinician",
    "We do not book you into a contracted theatre. You walk in with your eyes open.",
  ],
];

const faqs = [
  [
    "Are you a hospital?",
    "No. We are an independent direction service. You pay the hospital yourself. We are not on their payroll.",
  ],
  [
    "Why Google, and why five dollars?",
    "Google signs the file to you before money moves. Five dollars is Orientation: a first conversation, and a written reading of where you stand. If India is the wrong answer, we say so.",
  ],
  [
    "Who is this for?",
    "Families in the United States, Canada, Europe, New Zealand, and Australia. We are not a neighbourhood clinic for Hyderabad.",
  ],
  [
    "Do you take a commission on surgery?",
    "No. No tie-ups, no steered list, no markup on clinical care. Direction is an opinion about fitness of facility to case.",
  ],
];

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ sku?: string | string[]; enrollError?: string | string[] }>;
}) {
  const q = (await searchParams) || {};
  const session = await getSession();
  const patient = session ? getPatientById(session.patientId) : null;

  return (
    <main id="main">
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-kicker">Hyderabad · Independent · Far from home</p>
            <h1>
              When the diagnosis is new,
              <br />
              everything else arrives at once.
            </h1>
            <p className="lede">
              Money. The right treatment. The right room in {SITE.city}. The right
              week to go. {SITE.name} is a direction service for families in the
              United States, Canada, Europe, New Zealand, and Australia — who
              will not be steered by a hospital&apos;s contract.
            </p>
            <div className="hero-actions">
              <a className="btn-solid" href="/enroll">
                Begin orientation · $5
              </a>
              <a className="btn-ghost" href="#independence">
                How we stay independent
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <HeroArt />
          </div>
        </div>
      </section>

      <p className="trust-line">
        <span>No hospital tie-ups</span>
        <span>No commissions</span>
        <span>Google sign-in before payment</span>
        <span>Hyderabad, known — not sold</span>
      </p>

      <section id="path">
        <div className="shell split">
          <Reveal>
            <p className="eyebrow">The four weights</p>
            <h2>Care is not only clinical.</h2>
          </Reveal>
          <p className="section-lede">
            A person who has never met this illness before is asked, in the same
            fortnight, to become a student of medicine, a treasurer, a travel
            agent, and a judge of hospitals. That is not a character test. It is
            a design failure. We exist for that fortnight.
          </p>
        </div>
        <div className="shell weights">
          {tensions.map((x) => (
            <article key={x.k}>
              <span>{x.k}</span>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="independence" className="band-maroon">
        <div className="shell">
          <p className="eyebrow gold">Independence</p>
          <h2>We do not have a tie-up with any hospital.</h2>
          <p className="section-lede on-dark">
            That sentence is the product. A tied desk will walk you toward a
            contract. We keep a working understanding of which Hyderabad centres
            are strong for which work — cardiac, oncology, orthopaedics,
            fertility, transplants, complex medicine — and we point you toward
            the facility that fits the case. You pay the hospital yourself.
          </p>
          <blockquote>
            We are not the best hospital in Hyderabad. We are the people who have
            studied which rooms are built for which work, so you do not have to
            learn that from a brochure at 2 a.m.
          </blockquote>
        </div>
      </section>

      <section id="services">
        <div className="shell split">
          <div>
            <p className="eyebrow">Coordinated support</p>
            <h2>What we actually do.</h2>
          </div>
          <p className="section-lede">
            Not a tour. Not a package holiday with a surgeon attached. Six
            capacities, used only as the case requires.
          </p>
        </div>
        <div className="shell">
          <ServicesRail />
        </div>
      </section>

      <section id="method" className="band-walnut">
        <div className="shell">
          <p className="eyebrow">Sequence</p>
          <h2>A quiet order.</h2>
          <ol className="steps">
            {steps.map(([t, d], i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="packages">
        <div className="shell">
          <p className="eyebrow">Beginnings</p>
          <h2>Three ways in. Hospital care is never inside the price.</h2>
        </div>
        <div className="shell packages">
          {PACKAGES.map((p) => (
            <article key={p.sku} className={p.featured ? "featured" : undefined}>
              <header>
                <p className="pkg-name">{p.name}</p>
                <p className="pkg-price">{p.priceLabel}</p>
              </header>
              <p>{p.blurb}</p>
              <ul>
                {p.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="pkg-note">{p.note}</p>
              <a className="text-link" href={`/enroll?sku=${p.sku}`}>
                Choose {p.name}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="story">
        <div className="shell split">
          <div>
            <p className="eyebrow">The people</p>
            <h2>A couple, a city, a refusal to sell you a theatre.</h2>
          </div>
          <div>
            <p className="section-lede">
              We are {SITE.founders.him.name} and his wife — co-founders of{" "}
              {SITE.name}. We have sat with families who were intelligent,
              devout, and one PDF away from the wrong door. The fear is not only
              the illness. It is choosing, while you are still learning the
              words, among money you may not have, a treatment you do not yet
              understand, a hospital you cannot walk through, and a date that
              will not wait.
            </p>
            <p className="section-lede">
              Hyderabad is our ground. Not because it is fashionable, but
              because we know its campuses well enough to tell you who is built
              for what — without owing any of them your case. Portraits will sit
              here when we send them.
            </p>
          </div>
        </div>
        <div className="shell">
          <Founders />
        </div>
      </section>

      <WhyDoctorsCredit />

      <section id="faq" className="band-paper">
        <div className="shell faq-grid">
          <div>
            <p className="eyebrow">Questions</p>
            <h2>Said plainly.</h2>
          </div>
          <div className="faq">
            {faqs.map(([qst, a]) => (
              <details key={qst}>
                <summary>{qst}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enroll" className="band-close">
        <div className="shell enroll-layout">
          <div>
            <p className="eyebrow gold">Orientation</p>
            <h2>Five dollars so the first conversation is real.</h2>
            <p className="section-lede on-dark">
              Sign in with Google. Then pay. You receive a file: payments,
              orders, the history of what we have done together. If India is not
              the honest path, we will say so and still mean the five dollars.
            </p>
          </div>
          <EnrollForm
            patient={patient}
            sku={first(q.sku)}
            error={first(q.enrollError)}
          />
        </div>
      </section>
    </main>
  );
}
