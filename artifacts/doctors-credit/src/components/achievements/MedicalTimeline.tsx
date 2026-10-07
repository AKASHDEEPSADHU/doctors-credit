"use client";

import { useEffect, useRef, useState } from "react";
import { TIMELINE_CHAPTERS } from "@/lib/india-medical-achievements";
import { SourceCite } from "@/components/achievements/SourceCite";

function ChapterBody({
  chapter,
}: {
  chapter: (typeof TIMELINE_CHAPTERS)[number];
}) {
  return (
    <>
      <p className="ma-chapter-year">{chapter.year}</p>
      <h3 className="ed-display">{chapter.title}</h3>
      <p>{chapter.lead}</p>
      <p>{chapter.body}</p>
      {"chips" in chapter && chapter.chips ? (
        <ul className="ma-chips">
          {chapter.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      ) : null}
      {"flow" in chapter && chapter.flow ? (
        <ol className="ma-flow">
          {chapter.flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      <aside className="ma-why">
        <p>Why it mattered</p>
        <p>{chapter.why}</p>
      </aside>
      <SourceCite id={chapter.sourceId} />
    </>
  );
}

export function MedicalTimeline() {
  const [active, setActive] = useState<string>(TIMELINE_CHAPTERS[0].year);
  const sensors = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const nodes = TIMELINE_CHAPTERS.map((chapter) => sensors.current[chapter.year]).filter(
      (node): node is HTMLElement => Boolean(node)
    );
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const year = visible?.target.getAttribute("data-year");
        if (year) setActive(year);
      },
      { rootMargin: "-28% 0px -38% 0px", threshold: [0.2, 0.45, 0.7] }
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const chapter = TIMELINE_CHAPTERS.find((item) => item.year === active) ?? TIMELINE_CHAPTERS[0];

  return (
    <section className="ma-firsts" id="medical-firsts" aria-labelledby="medical-firsts-title">
      <div className="shell">
        <p className="ed-label">Selected milestones</p>
        <h2 id="medical-firsts-title">A history of medical firsts</h2>
        <p className="section-lede">
          These dates mark documented developments at specific institutions.
          They are not a ranking of Indian healthcare, and they do not mean
          every hospital later developed equivalent programs.
        </p>
        <ol className="ma-year-rail" aria-label="The story in numbers">
          {TIMELINE_CHAPTERS.map((item) => (
            <li key={item.year}>
              <a
                href={`#first-${item.year}`}
                className={item.year === active ? "is-active" : undefined}
              >
                {item.year}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="shell ma-timeline-sticky" aria-hidden="true">
        <ol className="ma-timeline-years">
          {TIMELINE_CHAPTERS.map((item) => (
            <li key={item.year}>
              <a
                href={`#first-${item.year}`}
                className={item.year === active ? "is-active" : undefined}
                tabIndex={-1}
              >
                {item.year}
              </a>
            </li>
          ))}
        </ol>
        <article className="ma-timeline-stage">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={chapter.year}
              src={chapter.image}
              alt=""
              style={{ objectPosition: chapter.imagePosition }}
            />
            <figcaption>{chapter.imageKind}</figcaption>
          </figure>
          <div className="ma-timeline-copy" key={`copy-${chapter.year}`}>
            <ChapterBody chapter={chapter} />
          </div>
        </article>
      </div>

      <div className="shell ma-timeline-stack">
        {TIMELINE_CHAPTERS.map((item) => (
          <article
            key={item.year}
            id={`first-${item.year}`}
            data-year={item.year}
            className="ma-mobile-chapter"
            ref={(node) => {
              sensors.current[item.year] = node;
            }}
          >
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={`${item.imageKind} for ${item.title}. Not a historical photograph of the event.`}
                style={{ objectPosition: item.imagePosition }}
              />
              <figcaption>{item.imageKind}</figcaption>
            </figure>
            <ChapterBody chapter={item} />
          </article>
        ))}
      </div>
    </section>
  );
}
