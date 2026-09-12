import { DISCLAIMER } from "@/lib/contact";

export const metadata = { title: "Medical disclaimer — Doctor's Credit" };

export default function DisclaimerPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Disclaimer</p>
      <h1>What this website is not.</h1>
      <p>{DISCLAIMER}</p>
    </main>
  );
}
