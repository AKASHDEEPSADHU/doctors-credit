import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";
import { DISCLAIMER, SITE } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="shell foot-grid">
        <div className="foot-brand">
          <BrandLockup href="/" variant="footer" />
          <p>
            An international planned-care decision and coordination platform.
            We help you understand whether planned treatment in India may be
            worth investigating, and we will say so when it does not.
          </p>
        </div>
        <div>
          <p className="foot-label">Explore</p>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/treatments">Treatments</Link>
          <Link href="/hospitals">Hospitals</Link>
          <Link href="/doctors">Doctors</Link>
          <Link href="/cost-calculator">Cost calculator</Link>
          <Link href="/reality-check">Reality check</Link>
        </div>
        <div>
          <p className="foot-label">Learn</p>
          <Link href="/research">Research</Link>
          <Link href="/india-medical-achievements">India&apos;s Medical Achievements</Link>
          <Link href="/guide">Medical travel guide</Link>
          <Link href="/stories">Patient stories</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/verify">Verify a call</Link>
        </div>
        <div>
          <p className="foot-label">Legal</p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/disclaimer">Medical disclaimer</Link>
          <Link href="/refund">Refund policy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/partners">Partner disclosure</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/emergency">Emergency information</Link>
        </div>
      </div>
      <div className="shell foot-end">
        <p className="closing">
          Sometimes India may make sense. Sometimes it may not. Either way,
          you deserve to know.
        </p>
        <p className="fine">{DISCLAIMER}</p>
        <p className="fine">
          {SITE.domain} · Not a hospital · Not a physician · Not insurance · Not
          an emergency service · Not a diagnostic service
        </p>
      </div>
    </footer>
  );
}
