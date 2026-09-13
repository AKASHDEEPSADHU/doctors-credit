import Link from "next/link";
import { SOURCES } from "@/lib/sources";

export const metadata = { title: "Hospitals — Doctor's Credit" };

export default function HospitalsPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Hospitals</p>
      <h1>Verified provider profiles are being developed.</h1>
      <p>
        DCredit will publish provider information only when it can be checked
        against reliable sources. A directory of names and logos is how
        medical-tourism sites manufacture trust. We will not invent hospitals,
        logos or outcomes.
      </p>
      <p>
        We are building DCredit in stages, starting with the decision itself.
        This page is not an operational hospital marketplace.
      </p>
      <h2>What a future profile may contain</h2>
      <p>
        Name, city, specialties, NABH status, JCI status if applicable, beds and
        ICU capability where verified, international patient department, official
        website, and the date we last checked accreditation. Estimated treatment
        ranges will be labeled ESTIMATE or PROVIDER-REPORTED.
      </p>
      <h2>What we will not do</h2>
      <p>
        Invent doctors, fabricate testimonials, or imply that accreditation
        guarantees outcomes. Accreditation is not a guarantee of outcome.
      </p>
      <p className="source">
        NABH: {SOURCES.nabh.publisher}. {SOURCES.nabh.url}
      </p>
      <Link href="/enroll">Start my $5 Assessment →</Link>
    </main>
  );
}
