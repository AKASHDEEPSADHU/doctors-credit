import { PatientStoryCard, ReservedStoryCard } from "@/components/PatientStoryCard";
import { publishedStories, type PatientStory } from "@/lib/patient-stories";

export function PatientStoriesGrid({
  stories = publishedStories(),
  slots = 4,
}: {
  stories?: PatientStory[];
  slots?: number;
}) {
  const published = stories.slice(0, slots);
  const reserved = Math.max(0, slots - published.length);

  return (
    <ul className="patient-story-grid">
      {published.map((story) => (
        <li key={story.slug}>
          <PatientStoryCard story={story} />
        </li>
      ))}
      {Array.from({ length: reserved }, (_, index) => (
        <li key={`reserved-${index}`}>
          <ReservedStoryCard index={index} />
        </li>
      ))}
    </ul>
  );
}
