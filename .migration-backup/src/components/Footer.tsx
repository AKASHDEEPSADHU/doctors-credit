import { Fragment } from "react";
import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";
import { SITE } from "@/lib/contact";
import { getPages } from "@/lib/i18n/server";

// Hrefs only. Labels come from lib/i18n/pages.ts, in the same order.
const EXPLORE = [
  "/how-it-works",
  "/treatments",
  "/hospitals",
  "/doctors",
  "/cost-calculator",
  "/reality-check",
  "/india-medical-achievements",
] as const;

const LEARN = [
  "/research",
  "/guide",
  "/stories",
  "/faq",
  "/about",
  "/contact",
  "/verify",
] as const;

const LEGAL = [
  "/privacy",
  "/terms",
  "/refund",
  "/cookies",
  "/partners",
  "/accessibility",
  "/emergency",
] as const;

export default async function Footer() {
  const { t } = await getPages();
  const f = t.footer;
  return (
    <footer className="site-foot">
      <div className="shell">
        <div className="foot-grid">
          <div className="foot-brand">
            <BrandLockup href="/" variant="footer" />
            <p className="foot-promise">{f.promise}</p>
            <p className="foot-line">{f.line}</p>
          </div>
          <nav className="foot-col" aria-label={f.explore}>
            <p className="foot-label">{f.explore}</p>
            {EXPLORE.map((href, i) => (
              <Link key={href} href={href}>
                {f.exploreLinks[i]}
              </Link>
            ))}
          </nav>
          <nav className="foot-col" aria-label={f.learn}>
            <p className="foot-label">{f.learn}</p>
            {LEARN.map((href, i) => (
              <Link key={href} href={href}>
                {f.learnLinks[i]}
              </Link>
            ))}
          </nav>
          <nav className="foot-col foot-col-legal" aria-label={f.legal}>
            <p className="foot-label">{f.legal}</p>
            {LEGAL.map((href, i) => (
              <Link key={href} href={href}>
                {f.legalLinks[i]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="foot-close">
          <p className="foot-trust">
            {f.trust.map((line, i) => (
              <Fragment key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>

          <div className="foot-info">
            <div>
              <p className="foot-label">{f.aboutLabel}</p>
              <p>{f.about}</p>
            </div>
            <div>
              <p className="foot-label">{f.importantLabel}</p>
              <p>{f.important1}</p>
              <p>{f.important2}</p>
            </div>
          </div>

          <div className="foot-safety">
            <p className="foot-label">{f.medicalLabel}</p>
            <p>{f.medical}</p>
          </div>

          <p className="foot-cross">{f.cross}</p>
        </div>

        <p className="foot-copy">
          {f.copy}
          <span>{SITE.domain}</span>
        </p>
      </div>
    </footer>
  );
}
