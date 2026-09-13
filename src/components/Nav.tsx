"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";

const links = [
  ["/how-it-works", "How it works"],
  ["/treatments", "Treatments"],
  ["/hospitals", "Hospitals"],
  ["/cost-calculator", "Cost calculator"],
  ["/research", "Research"],
  ["/about", "About"],
];

export default function Nav({ signedIn }: { signedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={scrolled ? "nav is-scrolled" : "nav"}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <BrandLockup href="/" variant="nav" />
      <nav className="nav-desktop" aria-label="Primary">
        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        <Link className="nav-cta" href="/enroll">
          Start my $5 Assessment
        </Link>
      </nav>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span className={open ? "nav-toggle-bars is-open" : "nav-toggle-bars"} />
      </button>
      {open ? (
        <div id={panelId} className="nav-overlay" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="nav-overlay-inner">
            {links.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link className="btn-solid" href="/enroll" onClick={() => setOpen(false)}>
              Start my $5 Assessment
            </Link>
            <Link href={signedIn ? "/account" : "/signin?next=%2Faccount"} onClick={() => setOpen(false)}>
              {signedIn ? "Your file" : "Sign in"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
