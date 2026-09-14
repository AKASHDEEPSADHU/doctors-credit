export type PatientStoryPhoto = {
  src: string;
  alt: string;
  kind: "patient" | "editorial";
};

export type PatientStory = {
  slug: string;
  title: string;
  displayName: string;
  country: string;
  treatmentCategory: string;
  treatmentSlug?: string;
  quote?: string;
  summary: string;
  body: string[];
  photo?: PatientStoryPhoto;
  hospitalName?: string;
  publishedAt: string;
  verified: boolean;
  consentToPublish: boolean;
};

export const RESERVED_STORY_SLOTS = [
  {
    src: "/images/editorial/story-us.jpg",
    position: "50% 18%",
    alt: "Editorial portrait reserved for a future verified patient story. Not a DCredit patient.",
  },
  {
    src: "/images/editorial/story-au.jpg",
    position: "50% 20%",
    alt: "Editorial portrait reserved for a future verified patient story. Not a DCredit patient.",
  },
  {
    src: "/images/editorial/story-za.jpg",
    position: "50% 18%",
    alt: "Editorial portrait reserved for a future verified patient story. Not a DCredit patient.",
  },
  {
    src: "/images/editorial/story-uk.jpg",
    position: "50% 22%",
    alt: "Editorial portrait reserved for a future verified patient story. Not a DCredit patient.",
  },
] as const;

/**
 * Internal catalog. A story is public only when both verification and
 * publication consent are recorded as true.
 */
export const PATIENT_STORIES: PatientStory[] = [];

export function isPublishedStory(story: PatientStory) {
  return story.verified === true && story.consentToPublish === true;
}

export function publishedStories(stories: PatientStory[] = PATIENT_STORIES) {
  return stories.filter(isPublishedStory);
}

export function publishedStoryBySlug(
  slug: string,
  stories: PatientStory[] = PATIENT_STORIES
) {
  return publishedStories(stories).find((story) => story.slug === slug) ?? null;
}

export function formatStoryDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
