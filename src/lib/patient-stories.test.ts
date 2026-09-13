import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PATIENT_STORIES,
  isPublishedStory,
  publishedStories,
  publishedStoryBySlug,
  type PatientStory,
} from "./patient-stories";

function story(overrides: Partial<PatientStory> = {}): PatientStory {
  return {
    slug: "draft-story",
    title: "Draft",
    displayName: "Draft name",
    country: "Canada",
    treatmentCategory: "Cardiac Treatment",
    summary: "Internal draft only.",
    body: ["Internal draft only."],
    publishedAt: "2026-01-01",
    verified: false,
    consentToPublish: false,
    ...overrides,
  };
}

describe("patient story publication rules", () => {
  it("keeps the public catalog empty until verified consented stories exist", () => {
    assert.equal(PATIENT_STORIES.length, 0);
    assert.deepEqual(publishedStories(), []);
  });

  it("does not publish an unverified story", () => {
    const draft = story({ verified: false, consentToPublish: true });
    assert.equal(isPublishedStory(draft), false);
    assert.equal(publishedStories([draft]).length, 0);
  });

  it("does not publish a verified story without consent", () => {
    const draft = story({ verified: true, consentToPublish: false });
    assert.equal(isPublishedStory(draft), false);
    assert.equal(publishedStoryBySlug("draft-story", [draft]), null);
  });

  it("publishes only when verified and consentToPublish are both true", () => {
    const live = story({
      slug: "approved-story",
      verified: true,
      consentToPublish: true,
    });
    const hidden = story({ slug: "hidden-story", verified: true, consentToPublish: false });
    const published = publishedStories([live, hidden]);
    assert.equal(published.length, 1);
    assert.equal(published[0].slug, "approved-story");
    assert.equal(publishedStoryBySlug("approved-story", [live, hidden])?.slug, "approved-story");
    assert.equal(publishedStoryBySlug("hidden-story", [live, hidden]), null);
  });
});
