import { parseSelectedSlot, type OccupiedSlot } from "@/lib/appointment-slots";
import { isHomeCountry } from "@/lib/home-countries";
import { CATEGORIES } from "@/lib/treatments";
import { US_STATES } from "@/lib/us-states";

export const INSURANCE_STATUSES = [
  "Private insurance",
  "Public or national health cover",
  "Employer or workplace plan",
  "Paying myself",
  "Unsure",
  "Prefer not to say",
] as const;

const LEGACY_INSURANCE_STATUSES = [
  "Medicare",
  "Medicaid",
  "Uninsured",
  "HSA / high-deductible",
] as const;

export const TIMELINES = [
  "As soon as clinically appropriate",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Flexible / exploring",
] as const;

export const PROCEDURE_CATEGORIES = [...CATEGORIES, "Other / not listed"];

const STATE_CODES = new Set(US_STATES.filter((s) => s.code !== "OUT").map((s) => s.code));
const INSURANCE_CODES = new Set<string>([...INSURANCE_STATUSES, ...LEGACY_INSURANCE_STATUSES]);

export type ApplicationInput = {
  firstName: string;
  lastName: string;
  phone: string;
  usState: string;
  country: string;
  procedureCategory: string;
  procedure: string;
  insuranceStatus: string;
  estimatedUsOop: string;
  preferredTimeline: string;
  preferredConsultationDate: string;
  appointmentTime: string;
  sku: string;
  source?: string;
};

export type FieldErrors = Partial<Record<keyof ApplicationInput, string>>;

function clean(value: unknown, max = 200) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function parseApplicationInput(
  raw: Record<string, unknown>,
  occupied: OccupiedSlot[] = [],
  now = new Date()
): {
  value: ApplicationInput;
  errors: FieldErrors;
} {
  const value: ApplicationInput = {
    firstName: clean(raw.firstName, 80),
    lastName: clean(raw.lastName, 80),
    phone: clean(raw.phone, 40),
    usState: clean(raw.usState, 80),
    country: clean(raw.country, 80),
    procedureCategory: clean(raw.procedureCategory, 80),
    procedure: clean(raw.procedure, 120),
    insuranceStatus: clean(raw.insuranceStatus, 80),
    estimatedUsOop: clean(raw.estimatedUsOop, 40),
    preferredTimeline: clean(raw.preferredTimeline, 80),
    preferredConsultationDate: clean(raw.preferredConsultationDate, 20),
    appointmentTime: clean(raw.appointmentTime, 8),
    sku: clean(raw.sku, 40) || "orientation",
    source: clean(raw.source, 80) || "dcredit.in",
  };

  const errors: FieldErrors = {};
  if (value.firstName.length < 1) errors.firstName = "Enter your first name.";
  if (value.lastName.length < 1) errors.lastName = "Enter your last name.";
  if (value.phone.length < 7) errors.phone = "Enter a phone number we can reach.";
  if (!isHomeCountry(value.country)) {
    errors.country = "Select the country you live in.";
  }
  if (value.country === "United States") {
    value.usState = value.usState.toUpperCase();
    if (!STATE_CODES.has(value.usState)) errors.usState = "Select the state you live in.";
  } else if (value.usState.length < 2) {
    errors.usState = "Enter your state, province or region.";
  }
  if (!PROCEDURE_CATEGORIES.includes(value.procedureCategory)) {
    errors.procedureCategory = "Choose a procedure category.";
  }
  if (value.procedure.length < 2) errors.procedure = "Name the procedure you are considering.";
  if (!INSURANCE_CODES.has(value.insuranceStatus)) {
    errors.insuranceStatus = "Select your insurance status.";
  }
  if (value.estimatedUsOop.length < 1) {
    errors.estimatedUsOop = "Enter an estimate, or “unknown”.";
  }
  if (!TIMELINES.includes(value.preferredTimeline as (typeof TIMELINES)[number])) {
    errors.preferredTimeline = "Select a preferred timeline.";
  }
  const slot = parseSelectedSlot(value.preferredConsultationDate, value.appointmentTime, occupied, now);
  if (!slot.ok) {
    errors.preferredConsultationDate = slot.reason;
    errors.appointmentTime = slot.reason;
  }

  return { value, errors };
}

export function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function firstError(errors: FieldErrors) {
  return Object.values(errors)[0] || "";
}
