type Variant = "nav" | "footer" | "mark";

const SRC: Record<Variant, string> = {
  nav: "/brand/nav.png",
  footer: "/brand/lockup.png",
  mark: "/brand/icon-light.png",
};

export default function BrandLockup({
  href = "/#top",
  variant = "nav",
}: {
  href?: string | null;
  variant?: Variant;
}) {
  const img = (
    // Official lockups from the brand package — do not substitute type or redraw the mark.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt="Doctor's Credit"
      className={`brand-img brand-img-${variant}`}
    />
  );
  if (!href) return img;
  return (
    <a href={href} className={`brand-lockup brand-lockup-${variant}`}>
      {img}
    </a>
  );
}
