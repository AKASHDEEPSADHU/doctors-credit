export const JOURNEY = [
  {
    n: "01",
    title: "Tell us what you are considering",
    body: "Share the care you are considering, your general situation, healthcare coverage or funding, timeline and goals. This is a conversation with DCredit, not a diagnosis or medical evaluation.",
  },
  {
    n: "02",
    title: "Understand your starting point",
    body: "We help organize the questions that matter before deciding whether India is worth investigating, including information you may later need to gather from clinicians at home.",
  },
  {
    n: "03",
    title: "Understand the economics at home",
    body: "When enough information is available, we look at what you may need to pay yourself at home: private, public or self-funded care, not a hospital sticker price alone.",
  },
  {
    n: "04",
    title: "Explore whether India is worth investigating",
    body: "Cost can open the conversation. It should not end it. The next question is whether expertise, quality, access and practical fit make India worth a closer look.",
  },
  {
    n: "05",
    title: "Compare quality, capability and practical considerations",
    body: "Hospital capability, technology, accreditation, travel, recovery and continuity of care all belong in the decision, before anyone books a flight.",
  },
  {
    n: "06",
    title: "Decide whether to proceed",
    body: "There is no obligation to travel or to purchase a later coordination service. Sometimes India may make sense. Sometimes it may not. The decision remains yours.",
  },
  {
    n: "07",
    title: "Coordinate the next stage",
    body: "We are building DCredit in stages, starting with the decision itself. Future services may include deeper provider coordination and travel or care support when those offerings become available.",
  },
] as const;

export const TRUST_PILLARS = [
  {
    t: "Quality deserves to be investigated directly.",
    d: "Provider-level evidence, accreditation and capability matter. Accreditation is useful information, but it is not a guarantee of outcome.",
  },
  {
    t: "Cost is part of the decision, not the entire decision.",
    d: "A lower quoted treatment price does not automatically make a medical journey better. The meaningful comparison is the complete picture.",
  },
  {
    t: "We do not pressure you to travel.",
    d: "There is no obligation to continue after the $5 Initial Assessment. You do not have to book a flight or buy a later service.",
  },
  {
    t: "We verify before we publish.",
    d: "We intend to verify healthcare providers against reliable sources before publishing provider profiles. Capabilities vary by hospital, department and physician.",
  },
  {
    t: "We make costs transparent.",
    d: "Estimates are labeled as estimates. The $5 Initial Assessment fee is disclosed up front. Hidden mandatory charges are not a feature. Savings are never guaranteed.",
  },
  {
    t: "The journey does not end when treatment ends.",
    d: "Continuity of care and return-home planning matter. In V1 we explain why. Detailed return-home packets are a future service. DCredit does not itself provide clinical follow-up.",
  },
] as const;

export const PROTECT = [
  "Patient identity verification for genuine DCredit communication",
  "No medical-record vault in V1. Do not send imaging or diagnoses here",
  "Provider profiles published only when sources can be checked",
  "Clear $5 Initial Assessment pricing",
  "No pressure to travel",
  "No emergency treatment",
  "No guarantee of medical outcomes or savings",
  "Not a diagnosis, clearance or insurance verification",
  "Transparent fees for any future services",
  "Clear cancellation and refund policies",
] as const;
