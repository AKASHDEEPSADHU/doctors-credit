"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

export default function Nav({ signedIn }: { signedIn: boolean }) {
  const { t } = useLanguage();
  const links = [
    ["/how-it-works", t.nav.howItWorks],
    ["/treatments", t.nav.treatments],
    ["/hospitals", t.nav.hospitals],
    ["/cost-calculator", t.nav.costCalculator],
    ["/research", t.nav.research],
    ["/stories", t.nav.stories],
    ["/about", t.nav.about],
  ];
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
    <header className={["nav", scrolled ? "is-scrolled" : "", open ? "is-open" : ""].filter(Boolean).join(" ")}>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <BrandLockup href="/" variant="nav" />
      <nav className="nav-desktop" aria-label={t.nav.primary}>
        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        <Link className="nav-cta" href="/enroll">
          {t.nav.cta}
        </Link>
        <Link className="nav-account" href={signedIn ? "/account" : "/signin?next=%2Faccount"}>
          {signedIn ? t.nav.myAccount : t.nav.signIn}
        </Link>
      </nav>
      {/* Phones/tablets: next to the menu button. On desktop the picker lives in
          the top strip (see .topbar-lang) because this row has no spare width. */}
      <div className="nav-lang ml-auto">
        <LanguageSelector />
      </div>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? t.nav.closeMenu : t.nav.openMenu}</span>
        <span className={open ? "nav-toggle-bars is-open" : "nav-toggle-bars"} />
      </button>
      {open ? (
        <div id={panelId} className="nav-overlay" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <div className="nav-overlay-inner">
            {links.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link className="btn-solid" href="/enroll" onClick={() => setOpen(false)}>
              {t.nav.cta}
            </Link>
            <Link href={signedIn ? "/account" : "/signin?next=%2Faccount"} onClick={() => setOpen(false)}>
              {signedIn ? t.nav.myAccount : t.nav.signIn}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
