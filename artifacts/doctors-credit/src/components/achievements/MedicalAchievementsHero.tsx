import Link from "next/link";

export function MedicalAchievementsHero() {
  return (
    <section className="ed-hero" aria-label="India's Medical Achievements">
      <div className="ed-hero-bleed">
        <div className="ed-hero-copy">
          <p className="ed-label">Research note</p>
          <h1>
            India&apos;s Medical
            <br />
            Achievements
          </h1>
          <p className="ed-lede">
            A closer look at the healthcare capabilities behind India&apos;s
            growing role in global care.
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
        <figure className="ed-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/editorial/hero-india-care.jpg"
            alt="Editorial reconstruction of people in an Indian urban setting, used as the research-note hero. Generated imagery, not a photograph of DCredit patients."
          />
        </figure>
      </div>
    </section>
  );
}
