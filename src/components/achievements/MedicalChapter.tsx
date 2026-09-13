import type { ReactNode } from "react";
import { SourceCite } from "@/components/achievements/SourceCite";

export function MedicalChapter({
  id,
  kicker,
  title,
  statistic,
  statisticNote,
  image,
  imageAlt,
  imagePosition,
  imageKind,
  sourceId,
  reverse,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  statistic?: string;
  statisticNote?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  imageKind: string;
  sourceId: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={reverse ? "ma-chapter is-reverse" : "ma-chapter"} id={id}>
      <div className="shell ma-chapter-grid">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} style={{ objectPosition: imagePosition }} />
          <figcaption>{imageKind}</figcaption>
        </figure>
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2>{title}</h2>
          {statistic ? <p className="ma-chapter-stat">{statistic}</p> : null}
          {statisticNote ? <p className="ma-chapter-stat-note">{statisticNote}</p> : null}
          {children}
          <SourceCite id={sourceId} />
        </div>
      </div>
    </section>
  );
}
