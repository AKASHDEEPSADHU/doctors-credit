import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";
import { SITE } from "@/lib/contact";

const EXPLORE = [
  ["/how-it-works", "How it works"],
  ["/treatments", "Treatments"],
  ["/hospitals", "Hospitals"],
  ["/doctors", "Doctors"],
  ["/cost-calculator", "Cost calculator"],
  ["/reality-check", "Reality check"],
  ["/india-medical-achievements", "India's Medical Achievements"],
] as const;

const LEARN = [
  ["/research", "Research"],
  ["/guide", "Medical travel guide"],
  ["/stories", "Patient stories"],
  ["/faq", "FAQ"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/verify", "Verify a call"],
] as const;

const LEGAL = [
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/refund", "Refund policy"],
  ["/cookies", "Cookies"],
  ["/partners", "Partner disclosure"],
  ["/accessibility", "Accessibility"],
  ["/emergency", "Emergency information"],
] as const;

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="shell">
        <div className="foot-grid">
          <div className="foot-brand">
            <BrandLockup href="/" variant="footer" />
            <p className="foot-promise">
              An international planned-care decision and coordination platform
              helping people understand whether treatment in India may be worth
              investigating.
            </p>
            <p className="foot-line">Better decisions start with better information.</p>
          </div>
          <nav className="foot-col" aria-label="Explore">
            <p className="foot-label">Explore</p>
            {EXPLORE.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <nav className="foot-col" aria-label="Learn">
            <p className="foot-label">Learn</p>
            {LEARN.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <nav className="foot-col foot-col-legal" aria-label="Legal">
            <p className="foot-label">Legal</p>
            {LEGAL.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="foot-close">
          <p className="foot-trust">
            Sometimes India may make sense.
            <br />
            Sometimes it may not.
            <br />
            Either way, you deserve to know.
          </p>

          <div className="foot-info">
            <div>
              <p className="foot-label">About DCredit</p>
              <p>
                DCredit is an international planned-care decision and
                coordination platform. We are not a hospital, physician,
                insurer, emergency medical service or diagnostic service.
              </p>
            </div>
            <div>
              <p className="foot-label">Important</p>
              <p>
                Information on this website is educational and for coordination
                purposes. The $5 initial care conversation is with a DCredit
                care coordinator, not a clinical assessment, specialist
                opinion, diagnosis or medical-record review.
              </p>
              <p>
                Treatment decisions should be made with qualified healthcare
                professionals. Costs, availability, treatment plans, outcomes
                and travel requirements vary.
              </p>
            </div>
          </div>

          <div className="foot-safety">
            <p className="foot-label">Medical information</p>
            <p>
              DCredit does not provide emergency medical care. If you are
              experiencing an emergency, contact your local emergency services.
            </p>
          </div>

          <p className="foot-cross">
            For cross-border care, consult the healthcare professionals,
            insurer, public health authority or funding body relevant to your
            home country before making treatment decisions.
          </p>
        </div>

        <p className="foot-copy">
          © 2026 Doctor&apos;s Credit. All rights reserved.
          <span>{SITE.domain}</span>
        </p>
      </div>
    </footer>
  );
}
