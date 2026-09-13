export const JOURNEY = [
  {
    n: "01",
    title: "Tell us what you’re planning",
    body: "Share your planned treatment, general situation, insurance context, timeline and goals. This is a conversation with DCredit — not a diagnosis or medical evaluation.",
  },
  {
    n: "02",
    title: "Understand your starting point",
    body: "We help organize the questions that matter before deciding whether international care is worth exploring, including information you may later need to gather.",
  },
  {
    n: "03",
    title: "Compare the real economics",
    body: "When enough information is available, we look at your likely US financial exposure versus the broader cost of an India journey — flights, stay, companion costs and follow-up, not a hospital sticker price alone.",
  },
  {
    n: "04",
    title: "Explore care options",
    body: "If India appears worth exploring, DCredit can help you understand the types of providers and treatment options that may warrant further review with qualified healthcare professionals.",
  },
  {
    n: "05",
    title: "Review the practical considerations",
    body: "Travel, timing, recovery, continuity of care and why return-home planning matters all belong in the decision — before anyone books a flight.",
  },
  {
    n: "06",
    title: "Decide whether to proceed",
    body: "There is no obligation to travel or to purchase a later coordination service. Sometimes India is worth exploring. Sometimes it isn’t. The decision remains yours.",
  },
  {
    n: "07",
    title: "Coordinate the next stage",
    body: "We are building DCredit in stages, starting with the decision itself. Future services may include deeper provider coordination and travel or care support when those offerings become available.",
  },
] as const;

export const TRUST_PILLARS = [
  {
    t: "We compare the real economics.",
    d: "Not US sticker prices. Your likely patient responsibility, whenever reliable information is available. Savings are never guaranteed.",
  },
  {
    t: "We don’t pressure you to travel.",
    d: "There is no obligation to continue after the $5 Initial Assessment. You do not have to book a flight or buy a later service.",
  },
  {
    t: "We verify before we publish.",
    d: "We intend to verify healthcare providers against reliable sources before publishing provider profiles. Accreditation, when cited, is not a guarantee of outcome.",
  },
  {
    t: "We make costs transparent.",
    d: "Estimates are labeled as estimates. The $5 Initial Assessment fee is disclosed up front. Hidden mandatory charges are not a feature.",
  },
  {
    t: "We coordinate thoughtfully.",
    d: "V1 starts with a clear decision conversation. Later phases may add deeper coordination — we will not describe those as live until they are.",
  },
  {
    t: "We help you think beyond the procedure.",
    d: "Continuity of care and return-home planning matter. In V1 we explain why. Detailed return-home packets are a future service.",
  },
] as const;

export const PROTECT = [
  "Patient identity verification for genuine DCredit communication",
  "No medical-record vault in V1 — do not send imaging or diagnoses here",
  "Provider profiles published only when sources can be checked",
  "Clear $5 Initial Assessment pricing",
  "No pressure to travel",
  "No emergency treatment",
  "No guarantee of medical outcomes or savings",
  "Not a diagnosis, clearance or insurance verification",
  "Transparent fees for any future services",
  "Clear cancellation and refund policies",
] as const;
