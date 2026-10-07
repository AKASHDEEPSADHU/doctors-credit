import type { ReactNode } from "react";
import { FeatureTile } from "@/components/editorial/FeatureTile";
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
  sourceId,
}: {
  id: string;
  kicker: string;
  title: string;
  statistic?: string;
  statisticNote?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  imageKind?: string;
  sourceId: string;
  reverse?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="ma-feature" id={id}>
      <div className="shell">
        <FeatureTile
          kicker={kicker}
          title={title}
          metric={statistic}
          text={statisticNote}
          image={image}
          imageAlt={imageAlt}
          imagePosition={imagePosition}
          size="lg"
        >
          <SourceCite id={sourceId} />
        </FeatureTile>
      </div>
    </section>
  );
}
