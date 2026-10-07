import { sourceById } from "@/lib/india-medical-achievements";

export function SourceCite({ id }: { id: string }) {
  const source = sourceById(id);
  return (
    <p className="ma-cite">
      <span>{source.badge}</span>
      <a href={source.href} rel="noreferrer noopener" target="_blank">
        {source.title}
      </a>
      {source.note ? <em>{source.note}</em> : null}
    </p>
  );
}
