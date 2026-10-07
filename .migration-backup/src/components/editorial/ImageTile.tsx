import type { CSSProperties } from "react";

export function ImageTile({
  title,
  text,
  note,
  image,
  imageAlt,
  imagePosition,
  size = "md",
}: {
  title: string;
  text: string;
  note?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  size?: "lg" | "md" | "sm";
}) {
  return (
    <article className={`ed-tile ed-tile-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={imageAlt} style={{ objectPosition: imagePosition } as CSSProperties} />
      <div className="ed-tile-body">
        <h3>{title}</h3>
        <p>{text}</p>
        {note ? <small>{note}</small> : null}
      </div>
    </article>
  );
}
