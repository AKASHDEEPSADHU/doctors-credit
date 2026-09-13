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

type D1Stmt = {
  bind: (...values: unknown[]) => D1Stmt;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
  run: () => Promise<unknown>;
};

export type D1Like = {
  prepare: (sql: string) => D1Stmt;
};

function now() {
  return new Date().toISOString();
}

function identityFrom(row: Record<string, unknown> | null): Identity | null {
  if (!row) return null;
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    phone: String(row.phone || ""),
    country: String(row.country || ""),
    createdAt: String(row.created_at),
    googleSub: row.google_sub ? String(row.google_sub) : undefined,
    stripeCustomerId: row.stripe_customer_id ? String(row.stripe_customer_id) : undefined,
  };
}

function applicationFrom(row: Record<string, unknown> | null): Application | null {
  if (!row) return null;
  return {
    id: String(row.id),
    identityId: String(row.identity_id),
    applicationId: String(row.application_id),
    conversationVerificationId: String(row.conversation_verification_id),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    email: String(row.email),
    phone: String(row.phone || ""),
    usState: String(row.us_state || ""),
    country: String(row.country || ""),
    procedureCategory: String(row.procedure_category || ""),
    procedure: String(row.procedure || ""),
    insuranceStatus: String(row.insurance_status || ""),
    estimatedUsOop: String(row.estimated_us_oop || ""),
    preferredTimeline: String(row.preferred_timeline || ""),
    preferredConsultationDate: String(row.preferred_consultation_date || ""),
    paymentStatus: String(row.payment_status) as Application["paymentStatus"],
    paymentReference: String(row.payment_reference || ""),
    stripeSessionId: row.stripe_session_id ? String(row.stripe_session_id) : undefined,
    stripePaymentIntent: row.stripe_payment_intent ? String(row.stripe_payment_intent) : undefined,
    sku: String(row.sku),
    amountCents: Number(row.amount_cents),
    currency: String(row.currency || "usd"),
    applicationStatus: String(row.application_status) as PipelineStatus,
    assignedCoordinator: String(row.assigned_coordinator || ""),
    lastContactDate: String(row.last_contact_date || ""),
    nextFollowupDate: String(row.next_followup_date || ""),
    source: String(row.source || "dcredit.in"),
    notes: String(row.notes || ""),
    sheetsSyncStatus: String(row.sheets_sync_status || "pending") as Application["sheetsSyncStatus"],
    sheetsSyncError: String(row.sheets_sync_error || ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function createD1Repository(db: D1Like, onPersist?: (app: Application) => Promise<void>): ApplicationRepository {
  async function project(app: Application) {
    if (!onPersist) return app;
    try {
      await onPersist(app);
      app.sheetsSyncStatus = "synced";
      app.sheetsSyncError = "";
    } catch (err) {
      app.sheetsSyncStatus = "failed";
      app.sheetsSyncError = err instanceof Error ? err.message.slice(0, 300) : "sheets_sync_failed";
    }
    await db
      .prepare(
        "UPDATE applications SET sheets_sync_status = ?, sheets_sync_error = ?, updated_at = ? WHERE id = ?"
      )
      .bind(app.sheetsSyncStatus, app.sheetsSyncError, now(), app.id)
      .run();
    return app;
  }

  async function writeAudit(event: AuditEventName, detail: string, refs?: { applicationId?: string; identityId?: string }) {
    const row: AuditEvent = {
      id: newInternalId(),
      applicationId: refs?.applicationId,
      identityId: refs?.identityId,
      event,
      detail,
      createdAt: now(),
    };
    await db
      .prepare(
        "INSERT INTO audit_events (id, application_id, identity_id, event, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(row.id, row.applicationId || null, row.identityId || null, row.event, row.detail, row.createdAt)
      .run();
    return row;
  }

  return {
    async upsertIdentity(input) {
      const email = input.email.trim().toLowerCase();
      let row = identityFrom(
        await db
          .prepare("SELECT * FROM identities WHERE email = ? OR (? IS NOT NULL AND google_sub = ?) LIMIT 1")
          .bind(email, input.googleSub || null, input.googleSub || null)
          .first()
      );
      if (!row) {
        row = {
          id: newInternalId(),
          email,
          name: input.name.trim(),
          phone: (input.phone || "").trim(),
          country: (input.country || "").trim(),
          createdAt: now(),
          googleSub: input.googleSub,
          stripeCustomerId: input.stripeCustomerId,
        };
        await db
          .prepare(
            "INSERT INTO identities (id, email, name, phone, country, google_sub, stripe_customer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          )
          .bind(
            row.id,
            row.email,
            row.name,
            row.phone,
            row.country,
            row.googleSub || null,
            row.stripeCustomerId || null,
            row.createdAt
          )
          .run();
        return row;
      }
      row.email = email || row.email;
      row.name = input.name.trim() || row.name;
      if (input.phone) row.phone = input.phone.trim();
      if (input.country) row.country = input.country.trim();
      if (input.googleSub) row.googleSub = input.googleSub;
      if (input.stripeCustomerId) row.stripeCustomerId = input.stripeCustomerId;
      await db
        .prepare(
          "UPDATE identities SET email = ?, name = ?, phone = ?, country = ?, google_sub = ?, stripe_customer_id = ? WHERE id = ?"
        )
        .bind(row.email, row.name, row.phone, row.country, row.googleSub || null, row.stripeCustomerId || null, row.id)
        .run();
      return row;
    },

    async getIdentityById(id) {
      return identityFrom(await db.prepare("SELECT * FROM identities WHERE id = ?").bind(id).first());
    },

    async getIdentityByEmail(email) {
      return identityFrom(
        await db.prepare("SELECT * FROM identities WHERE email = ?").bind(email.trim().toLowerCase()).first()
      );
    },

    async createApplication(input: CreateApplicationInput) {
      await db.prepare("INSERT INTO counters (name, value) VALUES ('application', 0) ON CONFLICT(name) DO NOTHING").run();
      const counter = await db
        .prepare("UPDATE counters SET value = value + 1 WHERE name = 'application' RETURNING value")
        .first<{ value: number }>();
      const seq = Number(counter?.value || 1);
      const created = now();
      const app: Application = {
        id: newInternalId(),
        identityId: input.identityId,
        applicationId: formatApplicationId(seq),
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
      await db
        .prepare(
          `INSERT INTO applications (
            id, identity_id, application_id, conversation_verification_id, first_name, last_name, email, phone,
            us_state, country, procedure_category, procedure, insurance_status, estimated_us_oop, preferred_timeline,
            preferred_consultation_date, payment_status, payment_reference, sku, amount_cents, currency,
            application_status, assigned_coordinator, last_contact_date, next_followup_date, source, notes,
            sheets_sync_status, sheets_sync_error, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          app.id,
          app.identityId,
          app.applicationId,
          app.conversationVerificationId,
          app.firstName,
          app.lastName,
          app.email,
          app.phone,
          app.usState,
          app.country,
          app.procedureCategory,
          app.procedure,
          app.insuranceStatus,
          app.estimatedUsOop,
          app.preferredTimeline,
          app.preferredConsultationDate,
          app.paymentStatus,
          app.paymentReference,
          app.sku,
          app.amountCents,
          app.currency,
          app.applicationStatus,
          app.assignedCoordinator,
          app.lastContactDate,
          app.nextFollowupDate,
          app.source,
          app.notes,
          app.sheetsSyncStatus,
          app.sheetsSyncError,
          app.createdAt,
          app.updatedAt
        )
        .run();
      await writeAudit("application_created", app.applicationId, {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async getApplicationById(id) {
      return applicationFrom(await db.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first());
    },

    async getApplicationByPublicId(applicationId) {
      return applicationFrom(
        await db
          .prepare("SELECT * FROM applications WHERE application_id = ?")
          .bind(normalizePublicId(applicationId))
          .first()
      );
    },

    async getApplicationByStripeSession(sessionId) {
      return applicationFrom(
        await db.prepare("SELECT * FROM applications WHERE stripe_session_id = ?").bind(sessionId).first()
      );
    },

    async listApplicationsForIdentity(identityId) {
      const { results } = await db
        .prepare("SELECT * FROM applications WHERE identity_id = ? ORDER BY created_at DESC")
        .bind(identityId)
        .all();
      return results.map((row) => applicationFrom(row)!);
    },

    async markPaymentInitiated(id, stripeSessionId) {
      const app = applicationFrom(await db.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first());
      if (!app) return null;
      app.stripeSessionId = stripeSessionId;
      app.paymentStatus = "PENDING";
      app.updatedAt = now();
      await db
        .prepare("UPDATE applications SET stripe_session_id = ?, payment_status = ?, updated_at = ? WHERE id = ?")
        .bind(stripeSessionId, app.paymentStatus, app.updatedAt, app.id)
        .run();
      await writeAudit("payment_initiated", "stripe_checkout", {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async confirmPayment(input) {
      const row = input.id
        ? await db.prepare("SELECT * FROM applications WHERE id = ?").bind(input.id).first()
        : await db
            .prepare("SELECT * FROM applications WHERE stripe_session_id = ?")
            .bind(input.stripeSessionId || "")
            .first();
      const app = applicationFrom(row);
      if (!app) return null;
      if (app.paymentStatus !== "PAID") {
        app.paymentStatus = "PAID";
        app.applicationStatus = "PAID — CONSULTATION PENDING";
        app.paymentReference = input.paymentReference || app.paymentReference || app.applicationId;
        app.stripePaymentIntent = input.stripePaymentIntent || app.stripePaymentIntent;
        if (input.stripeSessionId) app.stripeSessionId = input.stripeSessionId;
        app.updatedAt = now();
        await db
          .prepare(
            `UPDATE applications SET payment_status = ?, application_status = ?, payment_reference = ?,
             stripe_payment_intent = ?, stripe_session_id = ?, updated_at = ? WHERE id = ?`
          )
          .bind(
            app.paymentStatus,
            app.applicationStatus,
            app.paymentReference,
            app.stripePaymentIntent || null,
            app.stripeSessionId || null,
            app.updatedAt,
            app.id
          )
          .run();
        await db
          .prepare(
            "INSERT INTO payments (id, application_id, amount_cents, currency, stripe_payment_intent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
          )
          .bind(
            newInternalId(),
            app.id,
            app.amountCents,
            app.currency,
            app.stripePaymentIntent || null,
            app.updatedAt
          )
          .run();
        await writeAudit("payment_confirmed", app.paymentReference, {
          applicationId: app.applicationId,
          identityId: app.identityId,
        });
        if (app.preferredConsultationDate) {
          await writeAudit("consultation_booked", "pending_calendar", {
            applicationId: app.applicationId,
            identityId: app.identityId,
          });
        }
      }
      return project(app);
    },

    async updateStatus(applicationId, status, notes) {
      const app = applicationFrom(
        await db
          .prepare("SELECT * FROM applications WHERE application_id = ?")
          .bind(normalizePublicId(applicationId))
          .first()
      );
      if (!app) return null;
      app.applicationStatus = status;
      if (notes) app.notes = notes.slice(0, 500);
      app.updatedAt = now();
      await db
        .prepare("UPDATE applications SET application_status = ?, notes = ?, updated_at = ? WHERE id = ?")
        .bind(app.applicationStatus, app.notes, app.updatedAt, app.id)
        .run();
      await writeAudit("application_status_changed", status, {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async assignCoordinator(applicationId, coordinator) {
      const app = applicationFrom(
        await db
          .prepare("SELECT * FROM applications WHERE application_id = ?")
          .bind(normalizePublicId(applicationId))
          .first()
      );
      if (!app) return null;
      app.assignedCoordinator = coordinator.slice(0, 80);
      app.updatedAt = now();
      await db
        .prepare("UPDATE applications SET assigned_coordinator = ?, updated_at = ? WHERE id = ?")
        .bind(app.assignedCoordinator, app.updatedAt, app.id)
        .run();
      await writeAudit("coordinator_assigned", "assigned", {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async bookConsultation(applicationId, whenIso) {
      const app = applicationFrom(
        await db
          .prepare("SELECT * FROM applications WHERE application_id = ?")
          .bind(normalizePublicId(applicationId))
          .first()
      );
      if (!app) return null;
      app.preferredConsultationDate = whenIso.slice(0, 10);
      app.nextFollowupDate = whenIso.slice(0, 10);
      app.applicationStatus = "CONSULTATION BOOKED";
      app.updatedAt = now();
      await db
        .prepare(
          "UPDATE applications SET preferred_consultation_date = ?, next_followup_date = ?, application_status = ?, updated_at = ? WHERE id = ?"
        )
        .bind(app.preferredConsultationDate, app.nextFollowupDate, app.applicationStatus, app.updatedAt, app.id)
        .run();
      await writeAudit("consultation_booked", "scheduled", {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async listPayments(applicationId) {
      const app = applicationFrom(
        await db
          .prepare("SELECT * FROM applications WHERE id = ? OR application_id = ?")
          .bind(applicationId, applicationId)
          .first()
      );
      if (!app) return [];
      const { results } = await db
        .prepare("SELECT * FROM payments WHERE application_id = ? ORDER BY created_at DESC")
        .bind(app.id)
        .all();
      return results.map((p) => ({
        id: String(p.id),
        applicationId: String(p.application_id),
        amountCents: Number(p.amount_cents),
        currency: String(p.currency),
        stripePaymentIntent: p.stripe_payment_intent ? String(p.stripe_payment_intent) : undefined,
        createdAt: String(p.created_at),
      }));
    },

    async appendAudit(event, detail = "", refs) {
      return writeAudit(event, detail, refs);
    },

    async createCallVerification(applicationId, ttlMinutes = 120) {
      const row: CallVerification = {
        id: newInternalId(),
        callId: newCallVerificationId(),
        applicationId: applicationId ? normalizePublicId(applicationId) : undefined,
        expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
        createdAt: now(),
      };
      await db
        .prepare(
          "INSERT INTO call_verifications (id, call_id, application_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(row.id, row.callId, row.applicationId || null, row.expiresAt, row.createdAt)
        .run();
      return row;
    },

    async verifyCallId(callId) {
      const row = await db
        .prepare("SELECT * FROM call_verifications WHERE call_id = ?")
        .bind(normalizePublicId(callId))
        .first();
      if (!row) return { ok: false };
      const expiresAt = String(row.expires_at);
      if (expiresAt < now()) return { ok: false, expired: true };
      const consumed = now();
      await db
        .prepare("UPDATE call_verifications SET consumed_at = ? WHERE id = ?")
        .bind(consumed, String(row.id))
        .run();
      await writeAudit("verification_performed", "call_verification", {
        applicationId: row.application_id ? String(row.application_id) : undefined,
      });
      return { ok: true };
    },

    async saveContact(input) {
      const row: ContactMessage = {
        id: newInternalId(),
        name: input.name,
        email: input.email,
        message: input.message,
        createdAt: now(),
      };
      await db
        .prepare("INSERT INTO contact_messages (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)")
        .bind(row.id, row.name, row.email, row.message, row.createdAt)
        .run();
      return row;
    },

    async retryPendingSheetsSync() {
      const { results } = await db
        .prepare("SELECT * FROM applications WHERE sheets_sync_status != 'synced'")
        .all();
      let n = 0;
      for (const row of results) {
        const app = applicationFrom(row);
        if (!app) continue;
        await project(app);
        n += 1;
      }
      return n;
    },
  };
}
