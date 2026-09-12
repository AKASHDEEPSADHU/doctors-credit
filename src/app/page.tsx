import { Suspense } from "react";
import EnrollForm from "@/components/EnrollForm";
import Founders from "@/components/Founders";
import { PACKAGES } from "@/lib/packages";
import { SITE } from "@/lib/contact";

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

const services = [
  {
    t: "Plain-language orientation",
    d: "Sit with what you have been told — reports, scans, the sentence that changed the week — until it can be spoken without panic.",
  },
  {
    t: "Hyderabad pathway direction",
    d: "An independent reading of which kind of centre in this city is built for this work. No tie-up. No steered list.",
  },
  {
    t: "Records, in order",
    d: "A packet a specialist can actually use: history, imaging, medicines, what has already been tried.",
  },
  {
    t: "Reading a quote",
    d: "What is in the number, what is not, and what a surprise bill usually hides. We do not inflate it.",
  },
  {
    t: "India medical visa",
    d: "e-Medical and attendant visas, documents, and the quiet sequence that keeps a date from slipping.",
  },
  {
    t: "Payments that clear",
    d: "Hospital accounts, international cards, wires, and converting USD or another currency into INR without theatre.",
  },
  {
    t: "Travel, stay, attendant",
    d: "Who flies with you, where you sleep near the campus, how many nights the body actually needs.",
  },
  {
    t: "On the ground in Hyderabad",
    d: "A liaison through admission and discharge — not a tour. Then a briefing your clinician at home can continue from.",
  },
];

const steps = [
  ["Write to us", "Five dollars opens a file. If Hyderabad is the wrong answer, we say so."],
  ["We listen to the case", "Not to sell a package. To see whether direction here is honest."],
  ["A map, then a door", "Which kind of hospital, what to ask, what it costs, when to fly."],
  ["You choose the clinician", "We do not book you into a contracted theatre. You walk in with your eyes open."],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Hyderabad · Independent · For patients far from home</p>
        <h1>
          When the diagnosis is new,
          <br />
          everything else arrives at once.
        </h1>
        <p className="lede">
          Money. The right treatment. The right room in {SITE.city}. The right
          week to go. {SITE.name} is a direction service for families in the
          United States, Canada, Europe, New Zealand, and Australia who are
          holding all four — and who will not be steered by a hospital&apos;s
          contract.
        </p>
        <div className="hero-actions">
          <a className="btn-gold" href="#enroll">
            Begin orientation · $5
          </a>
          <a className="btn-ghost" href="#independence">
            How we stay independent
          </a>
        </div>
      </section>

      <section id="path" className="band-dark">
        <p className="eyebrow light">The four weights</p>
        <h2>Care is not only clinical.</h2>
        <p className="section-lede light">
          A person who has never met this illness before is asked, in the same
          fortnight, to become a student of medicine, a treasurer, a travel
          agent, and a judge of hospitals. That is not a character test. It is
          a design failure. We exist for that fortnight.
        </p>
        <div className="grid-4">
          {tensions.map((x) => (
            <article key={x.k}>
              <span>{x.k}</span>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="independence">
        <p className="eyebrow">Independence</p>
        <h2>We do not have a tie-up with any hospital.</h2>
        <p className="section-lede">
          That sentence is the product. A tied desk will walk you toward a
          contract. We keep a working understanding of which Hyderabad centres
          are strong for which work — cardiac, oncology, orthopaedics, fertility,
          transplants, complex medicine — and we point you toward the facility
          that fits the case. We are not on their payroll. We do not take a
          commission on your surgery. You pay the hospital yourself.
        </p>
        <blockquote>
          We are not the best hospital in Hyderabad. We are the people who have
          studied which rooms are built for which work, so you do not have to
          learn that from a brochure at 2 a.m.
        </blockquote>
      </section>

      <section id="services" className="band-paper">
        <p className="eyebrow">Coordinated support</p>
        <h2>What we actually do.</h2>
        <div className="grid-2 services">
          {services.map((s) => (
            <article key={s.t}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
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
      </section>

      <section id="packages" className="band-dark">
        <p className="eyebrow light">Beginnings</p>
        <h2>Three ways in. Hospital care is never inside the price.</h2>
        <div className="packages">
          {PACKAGES.map((p) => (
            <article key={p.sku} className={p.featured ? "featured" : ""}>
              <p className="pkg-name">{p.name}</p>
              <p className="pkg-price">{p.priceLabel}</p>
              <p>{p.blurb}</p>
              <ul>
                {p.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="pkg-note">{p.note}</p>
              <a className="btn-gold" href={`/?sku=${p.sku}#enroll`}>
                Choose {p.name}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="story">
        <p className="eyebrow">The people</p>
        <h2>A couple, a city, a refusal to sell you a theatre.</h2>
        <p className="section-lede">
          We are {SITE.founders.him.name} and his wife — co-founders of{" "}
          {SITE.name}. We have sat with families who were intelligent, devout,
          and one PDF away from the wrong door. The fear is not only the
          illness. It is choosing, while you are still learning the words, among
          money you may not have, a treatment you do not yet understand, a
          hospital you cannot walk through, and a date that will not wait.
        </p>
        <p className="section-lede">
          Hyderabad is our ground. Not because it is fashionable, but because we
          know its campuses well enough to tell you who is built for what —
          without owing any of them your case. Portraits will sit here when we
          send them. The work does not wait on a photograph.
        </p>
        <Founders />
      </section>

      <section id="enroll" className="band-paper">
        <p className="eyebrow">Orientation</p>
        <h2>Five dollars so the first conversation is real.</h2>
        <p className="section-lede">
          You receive an account: payments, orders, the history of what we have
          done together. If India is not the honest path, we will say so and
          still mean the five dollars.
        </p>
        <Suspense fallback={<p className="fine">Preparing enrollment…</p>}>
          <EnrollForm />
        </Suspense>
      </section>
    </main>
  );
}
