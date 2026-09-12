import Link from "next/link";
import { SOURCES } from "@/lib/sources";

export const metadata = { title: "Hospitals — Doctor's Credit" };

export default function HospitalsPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Find the right hospital</p>
      <h1>We do not list hospitals we have not verified.</h1>
      <p>
        A directory of names and logos is how medical-tourism sites manufacture
        trust. DCredit publishes a hospital profile only after we can cite
        accreditation and key facts against official sources.
      </p>
      <h2>What a future profile will contain</h2>
      <p>
        Name, city, specialties, NABH status, JCI status if applicable, beds and
        ICU capability where verified, international patient department, official
        website, and the date we last checked accreditation. Estimated treatment
        ranges will be labeled ESTIMATE or PROVIDER-REPORTED.
      </p>
      <h2>What we will not do</h2>
      <p>
        Invent doctors, fabricate testimonials, or imply that accreditation
        guarantees outcomes. DCredit evaluates healthcare providers individually.
      </p>
      <p className="source">
        NABH: {SOURCES.nabh.publisher}. {SOURCES.nabh.url}
      </p>
      <Link href="/enroll">Start with an assessment, not a hospital brochure →</Link>
    </main>
  );
}
