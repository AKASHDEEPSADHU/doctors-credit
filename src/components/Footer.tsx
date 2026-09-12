import Link from "next/link";
import { SITE } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div>
        <p className="wordmark">Doctor&apos;s Credit</p>
        <p>
          Independent Hyderabad direction for patients who have to hold a
          diagnosis, a budget, a city, and a calendar in the same hand.
        </p>
      </div>
      <div>
        <a href={`https://${SITE.domain}`}>{SITE.domain}</a>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/account">Your file</Link>
      </div>
      <p className="fine">
        Not a hospital. Not a medical practice. Not insurance. Not a lender.
        We do not diagnose, prescribe, or take commissions from hospitals.
      </p>
    </footer>
  );
}
