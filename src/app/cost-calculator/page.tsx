import CostCalculator from "@/components/CostCalculator";

export const metadata = { title: "Cost calculator — Doctor's Credit" };

export default function CostPage() {
  return (
    <main id="main" className="legal" style={{ maxWidth: "52rem" }}>
      <p className="eyebrow">US vs India</p>
      <h1>Don’t compare hospital bills. Compare your real cost.</h1>
      <p>
        A $45,000 US price can become a few thousand dollars of patient
        responsibility — or remain a cash bill. India can look cheaper until you
        add flights, visa, stay, companion costs and follow-up. Potential savings
        are not guaranteed.
      </p>
      <CostCalculator />
    </main>
  );
}
