import Link from "next/link";
import { SITE } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="shell foot-grid">
        <div className="foot-brand">
          <p className="wordmark">Doctor&apos;s Credit</p>
          <p>
            Independent Hyderabad direction for patients who have to hold a
            diagnosis, a budget, a city, and a calendar in the same hand.
          </p>
        </div>
        <div>
          <p className="foot-label">Visit</p>
          <a href="/#path">The path</a>
          <a href="/#services">Support</a>
          <a href="/#packages">Beginnings</a>
          <a href="/#story">The people</a>
        </div>
        <div>
          <p className="foot-label">File</p>
          <Link href="/signin">Sign in with Google</Link>
          <Link href="/account">Your file</Link>
          <Link href="/enroll">Orientation · $5</Link>
          <a href={`https://${SITE.domain}`}>{SITE.domain}</a>
        </div>
        <div>
          <p className="foot-label">Legal</p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="shell foot-end">
        <p className="closing">
          We are not the palace. We are the people who have studied which rooms
          are built for which work.
        </p>
        <p className="fine">
          Not a hospital. Not a medical practice. Not insurance. Not a lender.
          We do not diagnose, prescribe, or take commissions from hospitals.
        </p>
      </div>
    </footer>
  );
}
