import type { CSSProperties, ReactNode } from "react";

export function FeatureTile({
  kicker,
  title,
  metric,
  text,
  image,
  imageAlt,
  imagePosition,
  href,
  size = "lg",
  children,
}: {
  kicker: string;
  title: string;
  metric?: string;
  text?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  href?: string;
  size?: "lg" | "md" | "sm";
  children?: ReactNode;
}) {
  const body = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={imageAlt} style={{ objectPosition: imagePosition } as CSSProperties} />
      <div className="ed-tile-body">
        <small>{kicker}</small>
        <h3>{title}</h3>
        {metric ? <strong className="ed-tile-metric">{metric}</strong> : null}
        {text ? <p>{text}</p> : null}
        {children}
      </div>
    </>
  );

  const className = `ed-tile ed-tile-${size}`;
  if (href) {
    return (
      <a className={className} href={href}>
        {body}
      </a>
    );
  }
  return <article className={className}>{body}</article>;
}
