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

export const STORY_CONSENT_COPY =
  "We share the verified patient stories as they provide consent.";

export const SERVICE_FEEDBACK_SLIDES = [
  {
    quote: "We share the verified patient stories as they provide consent.",
    label: "Publication standard",
    detail: "Verified first. Shared only with permission.",
    src: "/images/editorial/story-us.jpg",
    position: "50% 18%",
  },
  {
    quote: "The first step is a conversation, not a booking.",
    label: "Care coordination",
    detail: "You have not already chosen India by starting here.",
    src: "/images/editorial/story-au.jpg",
    position: "50% 20%",
  },
  {
    quote: "Cost can open the conversation. It should not end it.",
    label: "Total value",
    detail: "Quality, timing, access and continuity sit beside price.",
    src: "/images/editorial/story-za.jpg",
    position: "50% 18%",
  },
  {
    quote: "If India is not the better option, we will say so.",
    label: "Honest advice",
    detail: "Sometimes the right next step is to stay.",
    src: "/images/editorial/story-uk.jpg",
    position: "50% 22%",
  },
  {
    quote: "We check the account before anything is published.",
    label: "Verification",
    detail: "No invented names, photographs or outcomes.",
    src: "/images/editorial/story-us.jpg",
    position: "28% 16%",
  },
  {
    quote: "Continuity at home belongs in the plan from the start.",
    label: "Return-home planning",
    detail: "Treatment may happen in India. Life continues at home.",
    src: "/images/editorial/story-au.jpg",
    position: "62% 24%",
  },
  {
    quote: "One person's journey is not a guarantee of yours.",
    label: "What a story is not",
    detail: "Results vary. Suitability is always individual.",
    src: "/images/editorial/story-za.jpg",
    position: "40% 20%",
  },
] as const;

export const RESERVED_STORY_SLOTS = [
  {
    src: "/images/editorial/story-us.jpg",
    position: "50% 18%",
    alt: "Editorial portrait used to illustrate how DCredit publishes stories. Not a DCredit patient.",
    label: "Verified first",
    text: "We check the account before anything is published.",
  },
  {
    src: "/images/editorial/story-au.jpg",
    position: "50% 20%",
    alt: "Editorial portrait used to illustrate how DCredit publishes stories. Not a DCredit patient.",
    label: "Shared with consent",
    text: "A story appears only when the person agrees to share it.",
  },
  {
    src: "/images/editorial/story-za.jpg",
    position: "50% 18%",
    alt: "Editorial portrait used to illustrate how DCredit publishes stories. Not a DCredit patient.",
    label: "In their words",
    text: "We do not invent names, photographs or outcomes.",
  },
  {
    src: "/images/editorial/story-uk.jpg",
    position: "50% 22%",
    alt: "Editorial portrait used to illustrate how DCredit publishes stories. Not a DCredit patient.",
    label: "Not a promise",
    text: "One person's journey is not a guarantee of yours.",
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
