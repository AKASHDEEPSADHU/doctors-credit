import CostCalculator from "@/components/CostCalculator";

export const metadata = { title: "Cost calculator | Doctor's Credit" };

export default function CostPage() {
  return (
    <main id="main" className="legal" style={{ maxWidth: "52rem" }}>
      <p className="eyebrow">Home country versus India</p>
      <h1>Compare the total cost of the journey.</h1>
      <p>
        Cost is part of the decision, not the entire decision. A hospital price
        at home is not what you pay. An India quote is not the journey. The
        meaningful comparison includes expected healthcare costs at home,
        expected treatment cost in India, travel, accommodation, companion
        costs, time away, recovery and possible follow-up.
      </p>
      <p>
        The calculator can use a United States plan-math example when that is
        the relevant starting point. It is not a global insurance model.
        Sometimes India may offer strong value. Sometimes it may not. Potential
        savings are not guaranteed. This calculator is an estimate only, not a
        quote, not insurance verification and not medical advice.
      </p>
      <CostCalculator />
    </main>
  );
}
