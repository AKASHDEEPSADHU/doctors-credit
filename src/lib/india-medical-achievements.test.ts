import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACHIEVEMENT_SOURCES,
  GLANCE_STATS,
  INVESTIGATION_QUESTIONS,
  LIBRARY_GROUPS,
  TIMELINE_CHAPTERS,
  sourceById,
} from "./india-medical-achievements";
import { ACHIEVEMENT_IMAGES } from "./achievement-images";

describe("India medical achievements research record", () => {
  it("keeps every existing source id and outbound href", () => {
    const ids = ACHIEVEMENT_SOURCES.map((source) => source.id);
    assert.deepEqual(ids, [
      "pib-medical-arrivals-2025",
      "pib-transplants-2025",
      "pib-vaccines",
      "pib-pharma",
      "pib-abdm-2026",
      "pib-usfda-plants",
      "pib-tandem-asct-2026",
      "notto-annual-2025-26",
      "notto-home",
      "abdm-hpr",
      "nabh-find",
      "niv-covaxin",
      "pmc-gopinath-1961",
      "ijn-kidney-1971",
      "aiims-patient-care",
      "apollo-transplant-milestones",
      "apollo-robotic-urology",
      "apollo-proton-2019",
      "sctimst",
      "dst-chitra-valve",
    ]);
    for (const source of ACHIEVEMENT_SOURCES) {
      assert.match(source.href, /^https:\/\//);
      assert.ok(source.title);
      assert.ok(source.publisher);
      assert.ok(source.year);
      assert.equal(source.verified, "September 2026");
      assert.ok(LIBRARY_GROUPS.includes(source.libraryGroup));
    }
  });

  it("resolves known sources and rejects unknown ids", () => {
    assert.equal(sourceById("nabh-find").libraryGroup, "Quality / Accreditation");
    assert.throws(() => sourceById("not-a-source"));
  });

  it("keeps glance statistics tied to existing citations", () => {
    assert.equal(GLANCE_STATS.length, 6);
    for (const stat of GLANCE_STATS) {
      assert.ok(sourceById(stat.sourceId));
    }
  });

  it("covers the seven documented firsts", () => {
    assert.deepEqual(
      TIMELINE_CHAPTERS.map((item) => item.year),
      ["1961", "1971", "1994", "1998", "2006", "2019", "2026"]
    );
    for (const chapter of TIMELINE_CHAPTERS) {
      assert.ok(chapter.lead.length > 40);
      assert.ok(sourceById(chapter.sourceId));
    }
  });

  it("gives every investigation question a real answer", () => {
    assert.equal(INVESTIGATION_QUESTIONS.length, 6);
    for (const item of INVESTIGATION_QUESTIONS) {
      assert.ok(item.question.endsWith("?"));
      assert.ok(item.answer.length > 80);
    }
  });

  it("documents editorial images without presenting them as patients", () => {
    assert.ok(ACHIEVEMENT_IMAGES.length >= 3);
    for (const image of ACHIEVEMENT_IMAGES) {
      assert.match(image.alt, /not/i);
      assert.notEqual(image.kind, "documentary");
    }
  });
});
