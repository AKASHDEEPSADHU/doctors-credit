import Link from "next/link";
import { PatientStoriesGrid } from "@/components/PatientStoriesGrid";
import { FeedbackSlider } from "@/components/editorial/FeedbackSlider";
import { DISCLAIMER } from "@/lib/contact";
import { STORY_CONSENT_COPY, publishedStories } from "@/lib/patient-stories";

export const metadata = { title: "Patient stories | Doctor's Credit" };

export default function StoriesPage() {
  const stories = publishedStories();
  const hasStories = stories.length > 0;

  return (
    <main id="main" className="stories-page">
      <section className="story-band stories-hero">
        <div className="shell story-split">
          <div>
            <p className="eyebrow">Real patient stories</p>
            <h1 className="home-display">
              Lives changed.
              <br />
              Futures regained.
            </h1>
            <p className="section-lede">
              {hasStories
                ? "Patient stories, shared with permission."
                : STORY_CONSENT_COPY}
            </p>
            <p>
              Real experiences, shared by patients. DCredit does not invent
              names, photographs or outcomes for this page.
            </p>
            <p className="story-cta">
              <Link className="btn-ghost" href="/enroll">
                Talk to a care coordinator
              </Link>
            </p>
          </div>
          {hasStories ? (
            <PatientStoriesGrid stories={stories} />
          ) : (
            <FeedbackSlider variant="panel" />
          )}
        </div>
      </section>

      <section>
        <div className="shell stories-note">
          <p className="eyebrow">Important</p>
          <h2>Stories are published only with permission.</h2>
          <p>
            A story appears here only after it has been verified and the
            patient has consented to publication. Results vary. A published
            story is not a guarantee of outcome, savings or suitability for
            another person.
          </p>
          <p className="fine">{DISCLAIMER}</p>
        </div>
      </section>
    </main>
  );
}
