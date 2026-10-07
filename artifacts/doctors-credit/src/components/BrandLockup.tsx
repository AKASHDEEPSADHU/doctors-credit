type Variant = "nav" | "footer" | "mark";

const SRC: Record<Variant, string> = {
  nav: "/brand/nav-transparent.png",
  footer: "/brand/lockup-transparent.png",
  mark: "/brand/mark-transparent.png",
};

export default function BrandLockup({
  href = "/#top",
  variant = "nav",
}: {
  href?: string | null;
  variant?: Variant;
}) {
  const img = (
    // Official artwork with the plate knocked out so the page color shows through.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt="Doctor's Credit"
      className={`brand-img brand-img-${variant}`}
    />
  );
  if (!href) return <span className={`brand-lockup brand-lockup-${variant}`}>{img}</span>;
  return (
    <a href={href} className={`brand-lockup brand-lockup-${variant}`}>
      {img}
    </a>
  );
}
