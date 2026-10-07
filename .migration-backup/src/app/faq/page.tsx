import Link from "next/link";
import { FAQS } from "@/lib/faq";

export const metadata = { title: "FAQ | Doctor's Credit" };

export default function FaqPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">FAQ</p>
      <h1>Questions worth answering before you travel.</h1>
      <div className="faq">
        {FAQS.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <p>
        <Link className="btn-solid" href="/enroll">
          Talk to a care coordinator
        </Link>
      </p>
    </main>
  );
}
