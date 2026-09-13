import Link from "next/link";

export function MedicalAchievementsHero() {
  return (
    <section className="ma-hero" aria-label="India's Medical Achievements">
      <div className="shell ma-hero-grid">
        <div className="ma-hero-copy">
          <p className="eyebrow ma-hero-kicker">Research note</p>
          <h1>India&apos;s Medical Achievements</h1>
          <p className="ma-hero-lede">
            A closer look at the healthcare capabilities behind India&apos;s
            growing role in global care.
          </p>
          <p>
            India&apos;s healthcare story spans decades of specialist medicine,
            complex surgery, transplantation, cancer care, pharmaceuticals,
            vaccines, medical devices and digital health.
          </p>
          <div className="hero-actions">
            <a className="btn-solid" href="#india-at-a-glance">
              Explore the story
            </a>
            <Link className="btn-ghost" href="/enroll">
              Talk to a care coordinator
            </Link>
          </div>
        </div>
        <figure className="ma-hero-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/editorial/innovation-imaging.jpg"
            alt="Diagnostic imaging slices used as a representative illustration of advanced medical technology. Not a named hospital or patient."
          />
          <figcaption>Representative image. Capability is institution-specific.</figcaption>
        </figure>
      </div>
    </section>
  );
}
