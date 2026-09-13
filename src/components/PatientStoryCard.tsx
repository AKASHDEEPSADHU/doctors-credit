import Link from "next/link";
import {
  RESERVED_STORY_SLOTS,
  formatStoryDate,
  type PatientStory,
} from "@/lib/patient-stories";

export function PatientStoryCard({ story }: { story: PatientStory }) {
  const photo = story.photo;
  const showVerified = story.verified && story.consentToPublish;
  const photoIsPatient = photo?.kind === "patient";

  return (
    <article className="patient-story-card">
      {photo && photoIsPatient ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.src} alt={photo.alt} />
      ) : (
        <div className="patient-story-photo-fallback" aria-hidden="true" />
      )}
      <div className="patient-story-body">
        {showVerified ? <p className="patient-story-label">Verified patient story</p> : null}
        {story.quote ? <blockquote>{story.quote}</blockquote> : null}
        <p className="patient-story-name">{story.displayName}</p>
        <p className="patient-story-meta">
          <span>{story.country}</span>
          <em>{story.treatmentCategory}</em>
        </p>
        {story.publishedAt ? (
          <p className="patient-story-date">{formatStoryDate(story.publishedAt)}</p>
        ) : null}
        <Link className="patient-story-read" href={`/stories/${story.slug}`}>
          Read the story <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function ReservedStoryCard({ index }: { index: number }) {
  const visual = RESERVED_STORY_SLOTS[index % RESERVED_STORY_SLOTS.length];
  return (
    <article className="patient-story-card is-reserved">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={visual.src}
        alt={visual.alt}
        style={{ objectPosition: visual.position }}
      />
      <div className="patient-story-body">
        <p className="patient-story-slot">Coming soon</p>
        <p>A reserved place for a verified patient story.</p>
      </div>
    </article>
  );
}
