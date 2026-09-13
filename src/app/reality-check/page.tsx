import RealityCheck from "@/components/RealityCheck";

export const metadata = { title: "Reality check — Doctor's Credit" };

export default function RealityPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Reality Check</p>
      <h1>Should you consider exploring treatment in India?</h1>
      <p>
        Green, yellow or red is an informational screening aid. It is not a
        medical assessment, diagnosis, clearance to fly, or a promise of
        savings. Speak with your US healthcare professional before making a
        treatment decision.
      </p>
      <RealityCheck />
    </main>
  );
}
