import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  formatApplicationId,
  newCallVerificationId,
  newConversationVerificationId,
  newInternalId,
  normalizePublicId,
} from "@/lib/ids";
import type { ApplicationRepository } from "@/lib/repo/interface";
import type {
  Application,
  AuditEvent,
  AuditEventName,
  CallVerification,
  ContactMessage,
  CreateApplicationInput,
  Identity,
  PaymentRecord,
  PipelineStatus,
} from "@/lib/repo/types";

type DB = {
  identities: Identity[];
  applications: Application[];
  payments: PaymentRecord[];
  audit: AuditEvent[];
  calls: CallVerification[];
  contacts: ContactMessage[];
  counter: number;
};

const EMPTY: DB = {
  identities: [],
  applications: [],
  payments: [],
  audit: [],
  calls: [],
  contacts: [],
  counter: 0,
};

function now() {
  return new Date().toISOString();
}

export function createJsonRepository(filePath: string, onPersist?: (app: Application) => Promise<void>): ApplicationRepository {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.join(/* turbopackIgnore: true */ process.cwd(), filePath);
  function load(): DB {
    try {
      if (!existsSync(resolved)) return { ...EMPTY, identities: [], applications: [], payments: [], audit: [], calls: [], contacts: [] };
      return { ...EMPTY, ...JSON.parse(readFileSync(resolved, "utf8")) };
    } catch {
      return { ...EMPTY, identities: [], applications: [], payments: [], audit: [], calls: [], contacts: [] };
    }
  }

  function save(db: DB) {
    const dir = path.dirname(resolved);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(resolved, JSON.stringify(db, null, 2));
  }

  async function project(app: Application) {
    if (onPersist) {
      try {
        await onPersist(app);
        app.sheetsSyncStatus = "synced";
        app.sheetsSyncError = "";
      } catch (err) {
        app.sheetsSyncStatus = "failed";
        app.sheetsSyncError = err instanceof Error ? err.message : "sheets_sync_failed";
      }
    }
  }

  return {
    async upsertIdentity(input) {
      const db = load();
      const email = input.email.trim().toLowerCase();
      let identity = db.identities.find(
        (p) => p.email === email || (input.googleSub && p.googleSub === input.googleSub)
      );
      if (!identity) {
        identity = {
          id: newInternalId(),
          email,
          name: input.name.trim(),
          phone: (input.phone || "").trim(),
          country: (input.country || "").trim(),
          createdAt: now(),
          googleSub: input.googleSub,
        };
        db.identities.push(identity);
      } else {
        identity.email = email || identity.email;
        identity.name = input.name.trim() || identity.name;
        if (input.phone) identity.phone = input.phone.trim();
        if (input.country) identity.country = input.country.trim();
        if (input.googleSub) identity.googleSub = input.googleSub;
      }
      save(db);
      return identity;
    },

    async getIdentityById(id) {
      return load().identities.find((p) => p.id === id) ?? null;
    },

    async getIdentityByEmail(email) {
      return load().identities.find((p) => p.email === email.trim().toLowerCase()) ?? null;
    },

    async createApplication(input: CreateApplicationInput) {
      const db = load();
      db.counter += 1;
      const created = now();
      const app: Application = {
        id: newInternalId(),
        identityId: input.identityId,
        applicationId: formatApplicationId(db.counter),
        conversationVerificationId: newConversationVerificationId(),
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.trim().toLowerCase(),
        phone: input.phone,
        usState: input.usState,
        country: input.country,
        procedureCategory: input.procedureCategory,
        procedure: input.procedure,
        insuranceStatus: input.insuranceStatus,
        estimatedUsOop: input.estimatedUsOop,
        preferredTimeline: input.preferredTimeline,
        preferredConsultationDate: input.preferredConsultationDate,
        paymentStatus: "PENDING",
        paymentReference: "",
        sku: input.sku,
        amountCents: input.amountCents,
        currency: input.currency || "usd",
        applicationStatus: "PAYMENT_PENDING",
        assignedCoordinator: "",
        lastContactDate: "",
        nextFollowupDate: input.preferredConsultationDate,
        source: input.source || "dcredit.in",
        notes: "",
        sheetsSyncStatus: "pending",
        sheetsSyncError: "",
        createdAt: created,
        updatedAt: created,
      };
      db.applications.push(app);
      db.audit.push({
        id: newInternalId(),
        applicationId: app.applicationId,
        identityId: app.identityId,
        event: "application_created",
        detail: app.applicationId,
        createdAt: created,
      });
      await project(app);
      save(db);
      return app;
    },

    async getApplicationById(id) {
      return load().applications.find((a) => a.id === id) ?? null;
    },

    async getApplicationByPublicId(applicationId) {
      const id = normalizePublicId(applicationId);
      return load().applications.find((a) => a.applicationId === id) ?? null;
    },

    async getApplicationByProviderCheckout(checkoutId) {
      return load().applications.find((a) => a.providerCheckoutId === checkoutId) ?? null;
    },

    async getApplicationByProviderPayment(paymentId) {
      const db = load();
      const payment = db.payments.find((p) => p.providerPaymentId === paymentId);
      if (payment) return db.applications.find((a) => a.id === payment.applicationId) ?? null;
      return db.applications.find((a) => a.providerPaymentId === paymentId) ?? null;
    },

    async listApplicationsForIdentity(identityId) {
      return load()
        .applications.filter((a) => a.identityId === identityId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async markPaymentInitiated(id, providerCheckoutId) {
      const db = load();
      const app = db.applications.find((a) => a.id === id);
      if (!app) return null;
      if (app.paymentStatus === "PAID") return app;
      app.paymentProvider = "dodo";
      app.providerCheckoutId = providerCheckoutId;
      app.paymentStatus = "PENDING";
      app.updatedAt = now();
      db.audit.push({
        id: newInternalId(),
        applicationId: app.applicationId,
        identityId: app.identityId,
        event: "payment_initiated",
        detail: "dodo_checkout",
        createdAt: app.updatedAt,
      });
      await project(app);
      save(db);
      return app;
    },

    async markPaymentFailed(id, detail) {
      const db = load();
      const app = db.applications.find((a) => a.id === id);
      if (!app) return null;
      if (app.paymentStatus === "PAID") return app;
      app.paymentStatus = "FAILED";
      app.updatedAt = now();
      db.audit.push({
        id: newInternalId(),
        applicationId: app.applicationId,
        identityId: app.identityId,
        event: "payment_initiated",
        detail: detail ? `dodo_failed:${detail}` : "dodo_failed",
        createdAt: app.updatedAt,
      });
      await project(app);
      save(db);
      return app;
    },

    async confirmPayment(input) {
      const db = load();
      const byPayment = input.providerPaymentId
        ? db.payments.find((p) => p.providerPaymentId === input.providerPaymentId)
        : undefined;
      const app = db.applications.find(
        (a) =>
          (input.id && a.id === input.id) ||
          (input.applicationId && a.applicationId === input.applicationId) ||
          (input.providerCheckoutId && a.providerCheckoutId === input.providerCheckoutId) ||
          (byPayment && a.id === byPayment.applicationId)
      );
      if (!app) return null;
      if (app.paymentStatus !== "PAID") {
        app.paymentStatus = "PAID";
        app.applicationStatus = "PAID — CONSULTATION PENDING";
        app.paymentReference = input.paymentReference || app.paymentReference || app.applicationId;
        app.paymentProvider = input.paymentProvider || app.paymentProvider || "dodo";
        if (input.providerCheckoutId) app.providerCheckoutId = input.providerCheckoutId;
        if (input.providerPaymentId) app.providerPaymentId = input.providerPaymentId;
        app.updatedAt = now();
        const duplicatePayment =
          input.providerPaymentId &&
          db.payments.some((p) => p.providerPaymentId === input.providerPaymentId);
        if (!duplicatePayment) {
          db.payments.push({
            id: newInternalId(),
            applicationId: app.id,
            amountCents: app.amountCents,
            currency: app.currency,
            paymentProvider: app.paymentProvider,
            providerCheckoutId: app.providerCheckoutId,
            providerPaymentId: app.providerPaymentId,
            createdAt: app.updatedAt,
          });
        }
        db.audit.push({
          id: newInternalId(),
          applicationId: app.applicationId,
          identityId: app.identityId,
          event: "payment_confirmed",
          detail: app.paymentReference,
          createdAt: app.updatedAt,
        });
        if (app.preferredConsultationDate) {
          db.audit.push({
            id: newInternalId(),
            applicationId: app.applicationId,
            identityId: app.identityId,
            event: "consultation_booked",
            detail: "pending_calendar",
            createdAt: app.updatedAt,
          });
        }
      }
      await project(app);
      save(db);
      return app;
    },

    async updateStatus(applicationId, status: PipelineStatus, notes) {
      const db = load();
      const app = db.applications.find((a) => a.applicationId === normalizePublicId(applicationId));
      if (!app) return null;
      app.applicationStatus = status;
      if (notes) app.notes = notes.slice(0, 500);
      app.updatedAt = now();
      db.audit.push({
        id: newInternalId(),
        applicationId: app.applicationId,
        identityId: app.identityId,
        event: "application_status_changed",
        detail: status,
        createdAt: app.updatedAt,
      });
      await project(app);
      save(db);
      return app;
    },

    async assignCoordinator(applicationId, coordinator) {
      const db = load();
      const app = db.applications.find((a) => a.applicationId === normalizePublicId(applicationId));
      if (!app) return null;
      app.assignedCoordinator = coordinator.slice(0, 80);
      app.updatedAt = now();
      db.audit.push({
        id: newInternalId(),
        applicationId: app.applicationId,
        identityId: app.identityId,
        event: "coordinator_assigned",
        detail: "assigned",
        createdAt: app.updatedAt,
      });
      await project(app);
      save(db);
      return app;
    },

    async bookConsultation(applicationId, whenIso) {
      const db = load();
      const app = db.applications.find((a) => a.applicationId === normalizePublicId(applicationId));
      if (!app) return null;
      app.preferredConsultationDate = whenIso.slice(0, 10);
      app.nextFollowupDate = whenIso.slice(0, 10);
      app.applicationStatus = "CONSULTATION BOOKED";
      app.updatedAt = now();
      db.audit.push({
        id: newInternalId(),
        applicationId: app.applicationId,
        identityId: app.identityId,
        event: "consultation_booked",
        detail: "scheduled",
        createdAt: app.updatedAt,
      });
      await project(app);
      save(db);
      return app;
    },

    async listPayments(applicationId) {
      const db = load();
      const app = db.applications.find((a) => a.id === applicationId || a.applicationId === applicationId);
      if (!app) return [];
      return db.payments.filter((p) => p.applicationId === app.id);
    },

    async appendAudit(event: AuditEventName, detail = "", refs) {
      const db = load();
      const row: AuditEvent = {
        id: newInternalId(),
        applicationId: refs?.applicationId,
        identityId: refs?.identityId,
        event,
        detail,
        createdAt: now(),
      };
      db.audit.push(row);
      save(db);
      return row;
    },

    async createCallVerification(applicationId, ttlMinutes = 120) {
      const db = load();
      const created = now();
      const row: CallVerification = {
        id: newInternalId(),
        callId: newCallVerificationId(),
        applicationId: applicationId ? normalizePublicId(applicationId) : undefined,
        expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
        createdAt: created,
      };
      db.calls.push(row);
      save(db);
      return row;
    },

    async verifyCallId(callId) {
      const db = load();
      const row = db.calls.find((c) => c.callId === normalizePublicId(callId));
      if (!row) return { ok: false };
      if (row.consumedAt) return { ok: false };
      if (row.expiresAt < now()) return { ok: false, expired: true };
      row.consumedAt = now();
      db.audit.push({
        id: newInternalId(),
        applicationId: row.applicationId,
        event: "verification_performed",
        detail: "call_verification",
        createdAt: row.consumedAt,
      });
      save(db);
      return { ok: true };
    },

    async saveContact(input) {
      const db = load();
      const row: ContactMessage = {
        id: newInternalId(),
        name: input.name,
        email: input.email,
        message: input.message,
        createdAt: now(),
      };
      db.contacts.push(row);
      save(db);
      return row;
    },

    async retryPendingSheetsSync() {
      const db = load();
      let n = 0;
      for (const app of db.applications) {
        if (app.sheetsSyncStatus === "synced") continue;
        await project(app);
        n += 1;
      }
      save(db);
      return n;
    },
  };
}
