import type {
  Application,
  AuditEvent,
  AuditEventName,
  CallVerification,
  ContactMessage,
  CreateApplicationInput,
  Identity,
  MeetingStatus,
  NotificationStatus,
  PaymentRecord,
  PipelineStatus,
} from "@/lib/repo/types";

export type OccupiedSlotCount = {
  date: string;
  time: string;
  count: number;
};

export type ApplicationFulfillmentPatch = {
  appointmentTime?: string;
  appointmentTimezone?: string;
  meetingProvider?: string;
  meetingId?: string;
  meetingJoinUrl?: string;
  meetingStartsAt?: string;
  meetingTimezone?: string;
  meetingStatus?: MeetingStatus;
  notificationStatus?: NotificationStatus;
  applicationStatus?: PipelineStatus;
};

export type ApplicationRepository = {
  upsertIdentity(input: {
    email: string;
    name: string;
    phone?: string;
    country?: string;
    googleSub?: string;
  }): Promise<Identity>;
  getIdentityById(id: string): Promise<Identity | null>;
  getIdentityByEmail(email: string): Promise<Identity | null>;

  createApplication(input: CreateApplicationInput): Promise<Application>;
  getApplicationById(id: string): Promise<Application | null>;
  getApplicationByPublicId(applicationId: string): Promise<Application | null>;
  getApplicationByProviderCheckout(checkoutId: string): Promise<Application | null>;
  getApplicationByProviderPayment(paymentId: string): Promise<Application | null>;
  listApplicationsForIdentity(identityId: string): Promise<Application[]>;

  markPaymentInitiated(id: string, providerCheckoutId: string): Promise<Application | null>;
  markPaymentFailed(id: string, detail?: string): Promise<Application | null>;
  confirmPayment(input: {
    id?: string;
    applicationId?: string;
    paymentProvider?: string;
    providerCheckoutId?: string;
    providerPaymentId?: string;
    paymentReference?: string;
  }): Promise<Application | null>;

  updateStatus(applicationId: string, status: PipelineStatus, notes?: string): Promise<Application | null>;
  assignCoordinator(applicationId: string, coordinator: string): Promise<Application | null>;
  bookConsultation(applicationId: string, whenIso: string): Promise<Application | null>;
  saveApplicationFulfillment(id: string, patch: ApplicationFulfillmentPatch): Promise<Application | null>;
  listPaidSlotOccupancy(): Promise<OccupiedSlotCount[]>;

  listPayments(applicationId: string): Promise<PaymentRecord[]>;
  appendAudit(event: AuditEventName, detail?: string, refs?: { applicationId?: string; identityId?: string }): Promise<AuditEvent>;

  createCallVerification(applicationId?: string, ttlMinutes?: number): Promise<CallVerification>;
  verifyCallId(callId: string): Promise<{ ok: boolean; expired?: boolean }>;

  saveContact(input: { name: string; email: string; message: string }): Promise<ContactMessage>;

  retryPendingSheetsSync(): Promise<number>;
};
