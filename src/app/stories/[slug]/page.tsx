import Link from "next/link";
import { notFound } from "next/navigation";
import { DISCLAIMER } from "@/lib/contact";
import {
  formatStoryDate,
  publishedStories,
  publishedStoryBySlug,
} from "@/lib/patient-stories";
import { TREATMENTS } from "@/lib/treatments";

export function generateStaticParams() {
  return publishedStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = publishedStoryBySlug(slug);
  if (!story) return { title: "Patient story | Doctor's Credit" };
  return { title: `${story.title} | Doctor's Credit` };
}

export default async function PatientStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = publishedStoryBySlug(slug);
  if (!story) notFound();

  const treatment = story.treatmentSlug
    ? TREATMENTS.find((item) => item.slug === story.treatmentSlug)
    : undefined;
  const photo = story.photo?.kind === "patient" ? story.photo : undefined;

  return (
    <main id="main" className="stories-page">
      <article className="shell story-article">
        <p className="eyebrow">Verified patient story</p>
        <h1>{story.title}</h1>
        <p className="story-article-byline">
          {story.displayName}
          <span>{story.country}</span>
          <span>{story.treatmentCategory}</span>
          {story.publishedAt ? <span>{formatStoryDate(story.publishedAt)}</span> : null}
        </p>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="story-article-hero" src={photo.src} alt={photo.alt} />
        ) : null}
        {story.quote ? <blockquote className="story-article-quote">{story.quote}</blockquote> : null}
        {story.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {story.hospitalName ? (
          <p className="fine">Provider named with the patient&apos;s permission: {story.hospitalName}.</p>
        ) : null}
        {treatment ? (
          <p>
            Related treatment:{" "}
            <Link href={`/treatments/${treatment.slug}`}>{treatment.name}</Link>
          </p>
        ) : null}
        <p className="fine">{DISCLAIMER}</p>
        <p className="story-cta">
          <Link className="btn-ghost" href="/stories">
            All patient stories
          </Link>
        </p>
      </article>
    </main>
  );
}
