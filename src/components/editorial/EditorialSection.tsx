import type { ReactNode } from "react";

export function EditorialSection({
  id,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: "light" | "paper" | "mist" | "dark";
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "dark"
      ? "ed-dark"
      : tone === "mist"
        ? "ed-mist"
        : tone === "paper"
          ? "ed-paper"
          : "";
  return (
    <section id={id} className={[toneClass, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
