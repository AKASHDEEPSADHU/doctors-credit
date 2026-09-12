import RealityCheck from "@/components/RealityCheck";

export const metadata = { title: "Reality check — Doctor's Credit" };

export default function RealityPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Decision support</p>
      <h1>Should you consider treatment in India?</h1>
      <p>
        Green, yellow or red is a coordination classification. It is not a
        diagnosis, a clearance to fly, or a promise of savings.
      </p>
      <RealityCheck />
    </main>
  );
}
