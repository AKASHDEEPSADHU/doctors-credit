export const PIPELINE_STATUSES = [
  "PAYMENT_PENDING",
  "PAID — CONSULTATION PENDING",
  "CONSULTATION BOOKED",
  "NEW APPLICATIONS",
  "CONSULTATIONS TODAY",
  "PAYMENTS",
  "CASES IN REVIEW",
  "SPECIALIST REVIEW",
  "TREATMENT PROPOSALS",
  "TRAVEL PLANNING",
  "TREATMENT IN INDIA",
  "RETURN-HOME FOLLOW-UP",
  "VERIFICATION REQUESTS",
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type SheetsSyncStatus = "pending" | "synced" | "failed";

export type Identity = {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  createdAt: string;
  googleSub?: string;
};

export type Application = {
  id: string;
  identityId: string;
  applicationId: string;
  conversationVerificationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  usState: string;
  country: string;
  procedureCategory: string;
  procedure: string;
  insuranceStatus: string;
  estimatedUsOop: string;
  preferredTimeline: string;
  preferredConsultationDate: string;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  paymentProvider?: string;
  providerCheckoutId?: string;
  providerPaymentId?: string;
  sku: string;
  amountCents: number;
  currency: string;
  applicationStatus: PipelineStatus;
  assignedCoordinator: string;
  lastContactDate: string;
  nextFollowupDate: string;
  source: string;
  notes: string;
  sheetsSyncStatus: SheetsSyncStatus;
  sheetsSyncError: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentRecord = {
  id: string;
  applicationId: string;
  amountCents: number;
  currency: string;
  paymentProvider?: string;
  providerCheckoutId?: string;
  providerPaymentId?: string;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  applicationId?: string;
  identityId?: string;
  event: AuditEventName;
  detail: string;
  createdAt: string;
};

export type AuditEventName =
  | "application_created"
  | "payment_initiated"
  | "payment_confirmed"
  | "consultation_booked"
  | "application_status_changed"
  | "coordinator_assigned"
  | "verification_performed"
  | "follow_up_created"
  | "sheets_sync_failed"
  | "sheets_sync_succeeded"
  | "email_failed"
  | "email_sent"
  | "contact_submitted";

export type CallVerification = {
  id: string;
  callId: string;
  applicationId?: string;
  expiresAt: string;
  consumedAt?: string;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type CreateApplicationInput = {
  identityId: string;
  email: string;
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
  sku: string;
  amountCents: number;
  currency?: string;
  source?: string;
};

export type CrmRow = {
  applicationId: string;
  applicationDate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  usState: string;
  country: string;
  procedureCategory: string;
  procedure: string;
  insuranceStatus: string;
  estimatedUsOop: string;
  preferredTimeline: string;
  preferredConsultationDate: string;
  paymentStatus: string;
  paymentReference: string;
  conversationVerificationId: string;
  applicationStatus: string;
  assignedCoordinator: string;
  lastContactDate: string;
  nextFollowupDate: string;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const CRM_HEADERS = [
  "Application ID",
  "Application Date",
  "Patient First Name",
  "Patient Last Name",
  "Email",
  "Phone",
  "US State",
  "Country",
  "Procedure Category",
  "Procedure",
  "Insurance Status",
  "Estimated US Out-of-Pocket",
  "Preferred Treatment Timeline",
  "Preferred Consultation Date",
  "Payment Status",
  "Payment Reference",
  "Conversation Verification ID",
  "Application Status",
  "Assigned Coordinator",
  "Last Contact Date",
  "Next Follow-up Date",
  "Source",
  "Notes",
  "Created At",
  "Updated At",
] as const;

export function applicationToCrmRow(app: Application): CrmRow {
  return {
    applicationId: app.applicationId,
    applicationDate: app.createdAt.slice(0, 10),
    firstName: app.firstName,
    lastName: app.lastName,
    email: app.email,
    phone: app.phone,
    usState: app.usState,
    country: app.country,
    procedureCategory: app.procedureCategory,
    procedure: app.procedure,
    insuranceStatus: app.insuranceStatus,
    estimatedUsOop: app.estimatedUsOop,
    preferredTimeline: app.preferredTimeline,
    preferredConsultationDate: app.preferredConsultationDate,
    paymentStatus: app.paymentStatus,
    paymentReference: app.paymentReference,
    conversationVerificationId: app.conversationVerificationId,
    applicationStatus: app.applicationStatus,
    assignedCoordinator: app.assignedCoordinator,
    lastContactDate: app.lastContactDate,
    nextFollowupDate: app.nextFollowupDate,
    source: app.source,
    notes: app.notes,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

export function crmRowValues(row: CrmRow): string[] {
  return [
    row.applicationId,
    row.applicationDate,
    row.firstName,
    row.lastName,
    row.email,
    row.phone,
    row.usState,
    row.country,
    row.procedureCategory,
    row.procedure,
    row.insuranceStatus,
    row.estimatedUsOop,
    row.preferredTimeline,
    row.preferredConsultationDate,
    row.paymentStatus,
    row.paymentReference,
    row.conversationVerificationId,
    row.applicationStatus,
    row.assignedCoordinator,
    row.lastContactDate,
    row.nextFollowupDate,
    row.source,
    row.notes,
    row.createdAt,
    row.updatedAt,
  ];
}

export function publicApplication(app: Application) {
  return {
    applicationId: app.applicationId,
    conversationVerificationId: app.conversationVerificationId,
    paymentStatus: app.paymentStatus,
    applicationStatus: app.applicationStatus,
    sku: app.sku,
    amountCents: app.amountCents,
    currency: app.currency,
    createdAt: app.createdAt,
    preferredConsultationDate: app.preferredConsultationDate,
  };
}
