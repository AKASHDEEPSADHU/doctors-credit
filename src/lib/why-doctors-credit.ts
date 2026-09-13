export type WhyQuestion = {
  number: string;
  question: string;
  answer: string[];
};

export const WHY_DOCTORS_CREDIT: WhyQuestion[] = [
  {
    number: "01",
    question: "Why should I start with Doctor's Credit?",
    answer: [
      "Doctor's Credit is an international planned-care decision and coordination platform.",
      "We help people considering planned care across borders understand whether India is worth investigating for their particular situation.",
      "The first conversation is about the care you are considering, not a sales pitch for a hospital.",
    ],
  },
  {
    number: "02",
    question: "Is DCredit only for patients from the United States?",
    answer: [
      "No. DCredit is for international patients considering planned care in India.",
      "That includes people from the United States, Canada, Europe, the United Kingdom, Australia, New Zealand, Africa, the Middle East, Asia and elsewhere.",
      "When an example is genuinely about one country, we label it as such.",
    ],
  },
  {
    number: "03",
    question: "Is this about finding cheaper treatment?",
    answer: [
      "Cost is part of the decision, not the entire decision.",
      "A lower quoted treatment price does not automatically make a medical journey better.",
      "The right question is whether a combination of expertise, quality, access, travel and total cost makes sense for you.",
    ],
  },
  {
    number: "04",
    question: "Does DCredit diagnose or treat patients?",
    answer: [
      "No.",
      "DCredit is not a hospital, physician, insurer or emergency service.",
      "The $5 Initial Assessment is a conversation with DCredit, not a clinical assessment, diagnosis or medical clearance.",
    ],
  },
  {
    number: "05",
    question: "Are savings guaranteed?",
    answer: [
      "No. Savings are never guaranteed.",
      "Sometimes India may offer strong value. Sometimes it may not.",
      "The meaningful comparison is the complete journey, not a hospital sticker price.",
    ],
  },
  {
    number: "06",
    question: "Does every Indian hospital offer the same quality?",
    answer: [
      "No. Capabilities vary by hospital, department and physician.",
      "Accreditation is useful information, but it is not a guarantee of outcome.",
      "Provider-level evidence matters. DCredit will publish provider information only when it can be checked against reliable sources.",
    ],
  },
  {
    number: "07",
    question: "What happens after treatment ends?",
    answer: [
      "The journey does not end when treatment ends.",
      "Discharge information, medications, imaging, follow-up and communication with healthcare professionals at home belong in the plan.",
      "DCredit does not itself provide clinical follow-up.",
    ],
  },
  {
    number: "08",
    question: "Do I have to travel if I start an assessment?",
    answer: [
      "No.",
      "There is no obligation to continue after the $5 Initial Assessment.",
      "If India does not appear worth investigating, we will say so.",
    ],
  },
];
