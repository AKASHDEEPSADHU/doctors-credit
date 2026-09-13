import { parseSelectedSlot, type OccupiedSlot } from "@/lib/appointment-slots";
import { CATEGORIES } from "@/lib/treatments";
import { US_STATES } from "@/lib/us-states";

export const INSURANCE_STATUSES = [
  "Private insurance",
  "Medicare",
  "Medicaid",
  "Uninsured",
  "HSA / high-deductible",
  "Unsure",
  "Prefer not to say",
] as const;

export const TIMELINES = [
  "As soon as clinically appropriate",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Flexible / exploring",
] as const;

export const PROCEDURE_CATEGORIES = [...CATEGORIES, "Other / not listed"];

const STATE_CODES = new Set(US_STATES.map((s) => s.code));

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
    usState: clean(raw.usState, 8).toUpperCase(),
    country: clean(raw.country, 80) || "United States",
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
  if (!STATE_CODES.has(value.usState)) errors.usState = "Select the US state you live in.";
  if (value.country.length < 2) errors.country = "Enter your country.";
  if (!PROCEDURE_CATEGORIES.includes(value.procedureCategory)) {
    errors.procedureCategory = "Choose a procedure category.";
  }
  if (value.procedure.length < 2) errors.procedure = "Name the procedure you are considering.";
  if (!INSURANCE_STATUSES.includes(value.insuranceStatus as (typeof INSURANCE_STATUSES)[number])) {
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
