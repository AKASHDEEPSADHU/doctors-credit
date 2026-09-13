import {
  formatApplicationId,
  newCallVerificationId,
  newConversationVerificationId,
  newInternalId,
  normalizePublicId,
} from "@/lib/ids";
import type { ApplicationFulfillmentPatch, ApplicationRepository } from "@/lib/repo/interface";
import type {
  Application,
  AuditEvent,
  AuditEventName,
  CallVerification,
  ContactMessage,
  CreateApplicationInput,
  Identity,
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
    appointmentTime: String(row.appointment_time || ""),
    appointmentTimezone: String(row.appointment_timezone || ""),
    meetingProvider: String(row.meeting_provider || ""),
    meetingId: String(row.meeting_id || ""),
    meetingJoinUrl: String(row.meeting_join_url || ""),
    meetingStartsAt: String(row.meeting_starts_at || ""),
    meetingTimezone: String(row.meeting_timezone || ""),
    meetingStatus: (row.meeting_status ? String(row.meeting_status) : "") as Application["meetingStatus"],
    notificationStatus: (row.notification_status ? String(row.notification_status) : "") as Application["notificationStatus"],
    paymentStatus: String(row.payment_status) as Application["paymentStatus"],
    paymentReference: String(row.payment_reference || ""),
    paymentProvider: row.payment_provider ? String(row.payment_provider) : undefined,
    providerCheckoutId: row.provider_checkout_id ? String(row.provider_checkout_id) : undefined,
    providerPaymentId: row.provider_payment_id ? String(row.provider_payment_id) : undefined,
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
        };
        await db
          .prepare(
            "INSERT INTO identities (id, email, name, phone, country, google_sub, stripe_customer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          )
          .bind(row.id, row.email, row.name, row.phone, row.country, row.googleSub || null, null, row.createdAt)
          .run();
        return row;
      }
      row.email = email || row.email;
      row.name = input.name.trim() || row.name;
      if (input.phone) row.phone = input.phone.trim();
      if (input.country) row.country = input.country.trim();
      if (input.googleSub) row.googleSub = input.googleSub;
      await db
        .prepare(
          "UPDATE identities SET email = ?, name = ?, phone = ?, country = ?, google_sub = ? WHERE id = ?"
        )
        .bind(row.email, row.name, row.phone, row.country, row.googleSub || null, row.id)
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
        appointmentTime: input.appointmentTime || "",
        appointmentTimezone: input.appointmentTimezone || "",
        meetingProvider: "",
        meetingId: "",
        meetingJoinUrl: "",
        meetingStartsAt: "",
        meetingTimezone: "",
        meetingStatus: "",
        notificationStatus: "",
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
            preferred_consultation_date, appointment_time, appointment_timezone, payment_status, payment_reference,
            sku, amount_cents, currency, application_status, assigned_coordinator, last_contact_date, next_followup_date,
            source, notes, sheets_sync_status, sheets_sync_error, created_at, updated_at, meeting_status, notification_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
          app.appointmentTime,
          app.appointmentTimezone,
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
          app.updatedAt,
          app.meetingStatus || null,
          app.notificationStatus || null
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

    async getApplicationByProviderCheckout(checkoutId) {
      return applicationFrom(
        await db.prepare("SELECT * FROM applications WHERE provider_checkout_id = ?").bind(checkoutId).first()
      );
    },

    async getApplicationByProviderPayment(paymentId) {
      const byApp = applicationFrom(
        await db.prepare("SELECT * FROM applications WHERE provider_payment_id = ?").bind(paymentId).first()
      );
      if (byApp) return byApp;
      const payment = await db
        .prepare("SELECT application_id FROM payments WHERE provider_payment_id = ?")
        .bind(paymentId)
        .first<{ application_id: string }>();
      if (!payment) return null;
      return applicationFrom(
        await db.prepare("SELECT * FROM applications WHERE id = ?").bind(payment.application_id).first()
      );
    },

    async listApplicationsForIdentity(identityId) {
      const { results } = await db
        .prepare("SELECT * FROM applications WHERE identity_id = ? ORDER BY created_at DESC")
        .bind(identityId)
        .all();
      return results.map((row) => applicationFrom(row)!);
    },

    async markPaymentInitiated(id, providerCheckoutId) {
      const app = applicationFrom(await db.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first());
      if (!app) return null;
      if (app.paymentStatus === "PAID") return project(app);
      app.paymentProvider = "dodo";
      app.providerCheckoutId = providerCheckoutId;
      app.paymentStatus = "PENDING";
      app.updatedAt = now();
      await db
        .prepare(
          "UPDATE applications SET payment_provider = ?, provider_checkout_id = ?, payment_status = ?, updated_at = ? WHERE id = ?"
        )
        .bind(app.paymentProvider, providerCheckoutId, app.paymentStatus, app.updatedAt, app.id)
        .run();
      await writeAudit("payment_initiated", "dodo_checkout", {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async markPaymentFailed(id, detail) {
      const app = applicationFrom(await db.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first());
      if (!app) return null;
      if (app.paymentStatus === "PAID") return project(app);
      app.paymentStatus = "FAILED";
      app.updatedAt = now();
      await db
        .prepare("UPDATE applications SET payment_status = ?, updated_at = ? WHERE id = ?")
        .bind(app.paymentStatus, app.updatedAt, app.id)
        .run();
      await writeAudit("payment_initiated", detail ? `dodo_failed:${detail}` : "dodo_failed", {
        applicationId: app.applicationId,
        identityId: app.identityId,
      });
      return project(app);
    },

    async confirmPayment(input) {
      let row = input.id
        ? await db.prepare("SELECT * FROM applications WHERE id = ?").bind(input.id).first()
        : null;
      if (!row && input.applicationId) {
        row = await db
          .prepare("SELECT * FROM applications WHERE application_id = ?")
          .bind(input.applicationId)
          .first();
      }
      if (!row && input.providerCheckoutId) {
        row = await db
          .prepare("SELECT * FROM applications WHERE provider_checkout_id = ?")
          .bind(input.providerCheckoutId)
          .first();
      }
      if (!row && input.providerPaymentId) {
        row = await db
          .prepare("SELECT * FROM applications WHERE provider_payment_id = ?")
          .bind(input.providerPaymentId)
          .first();
        if (!row) {
          const payment = await db
            .prepare("SELECT application_id FROM payments WHERE provider_payment_id = ?")
            .bind(input.providerPaymentId)
            .first<{ application_id: string }>();
          if (payment) {
            row = await db.prepare("SELECT * FROM applications WHERE id = ?").bind(payment.application_id).first();
          }
        }
      }
      const app = applicationFrom(row);
      if (!app) return null;
      if (app.paymentStatus !== "PAID") {
        app.paymentStatus = "PAID";
        app.applicationStatus = "PAID — CONSULTATION PENDING";
        app.paymentReference = input.paymentReference || app.paymentReference || app.applicationId;
        app.paymentProvider = input.paymentProvider || app.paymentProvider || "dodo";
        if (input.providerCheckoutId) app.providerCheckoutId = input.providerCheckoutId;
        if (input.providerPaymentId) app.providerPaymentId = input.providerPaymentId;
        app.updatedAt = now();
        await db
          .prepare(
            `UPDATE applications SET payment_status = ?, application_status = ?, payment_reference = ?,
             payment_provider = ?, provider_checkout_id = ?, provider_payment_id = ?, updated_at = ? WHERE id = ?`
          )
          .bind(
            app.paymentStatus,
            app.applicationStatus,
            app.paymentReference,
            app.paymentProvider || null,
            app.providerCheckoutId || null,
            app.providerPaymentId || null,
            app.updatedAt,
            app.id
          )
          .run();
        const existingPayment = input.providerPaymentId
          ? await db
              .prepare("SELECT id FROM payments WHERE provider_payment_id = ?")
              .bind(input.providerPaymentId)
              .first()
          : null;
        if (!existingPayment) {
          await db
            .prepare(
              `INSERT INTO payments (id, application_id, amount_cents, currency, stripe_payment_intent,
               payment_provider, provider_checkout_id, provider_payment_id, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(
              newInternalId(),
              app.id,
              app.amountCents,
              app.currency,
              null,
              app.paymentProvider || null,
              app.providerCheckoutId || null,
              app.providerPaymentId || null,
              app.updatedAt
            )
            .run();
        }
        await writeAudit("payment_confirmed", app.paymentReference, {
          applicationId: app.applicationId,
          identityId: app.identityId,
        });
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

    async saveApplicationFulfillment(id, patch: ApplicationFulfillmentPatch) {
      const app = applicationFrom(await db.prepare("SELECT * FROM applications WHERE id = ?").bind(id).first());
      if (!app) return null;
      if (patch.appointmentTime !== undefined) app.appointmentTime = patch.appointmentTime;
      if (patch.appointmentTimezone !== undefined) app.appointmentTimezone = patch.appointmentTimezone;
      if (patch.meetingProvider !== undefined) app.meetingProvider = patch.meetingProvider;
      if (patch.meetingId !== undefined) app.meetingId = patch.meetingId;
      if (patch.meetingJoinUrl !== undefined) app.meetingJoinUrl = patch.meetingJoinUrl;
      if (patch.meetingStartsAt !== undefined) app.meetingStartsAt = patch.meetingStartsAt;
      if (patch.meetingTimezone !== undefined) app.meetingTimezone = patch.meetingTimezone;
      if (patch.meetingStatus !== undefined) app.meetingStatus = patch.meetingStatus;
      if (patch.notificationStatus !== undefined) app.notificationStatus = patch.notificationStatus;
      if (patch.applicationStatus !== undefined) app.applicationStatus = patch.applicationStatus;
      app.updatedAt = now();
      await db
        .prepare(
          `UPDATE applications SET appointment_time = ?, appointment_timezone = ?, meeting_provider = ?,
           meeting_id = ?, meeting_join_url = ?, meeting_starts_at = ?, meeting_timezone = ?, meeting_status = ?,
           notification_status = ?, application_status = ?, updated_at = ? WHERE id = ?`
        )
        .bind(
          app.appointmentTime || null,
          app.appointmentTimezone || null,
          app.meetingProvider || null,
          app.meetingId || null,
          app.meetingJoinUrl || null,
          app.meetingStartsAt || null,
          app.meetingTimezone || null,
          app.meetingStatus || null,
          app.notificationStatus || null,
          app.applicationStatus,
          app.updatedAt,
          app.id
        )
        .run();
      return project(app);
    },

    async listPaidSlotOccupancy() {
      try {
        const { results } = await db
          .prepare(
            `SELECT preferred_consultation_date AS date, appointment_time AS time, COUNT(*) AS n
             FROM applications
             WHERE payment_status = 'PAID'
               AND preferred_consultation_date != ''
               AND IFNULL(appointment_time, '') != ''
             GROUP BY preferred_consultation_date, appointment_time`
          )
          .all<{ date: string; time: string; n: number }>();
        return results.map((row) => ({
          date: String(row.date),
          time: String(row.time),
          count: Number(row.n),
        }));
      } catch {
        return [];
      }
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
        paymentProvider: p.payment_provider ? String(p.payment_provider) : undefined,
        providerCheckoutId: p.provider_checkout_id ? String(p.provider_checkout_id) : undefined,
        providerPaymentId: p.provider_payment_id ? String(p.provider_payment_id) : undefined,
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
      if (row.consumed_at) return { ok: false };
      const expiresAt = String(row.expires_at);
      if (expiresAt < now()) return { ok: false, expired: true };
      const consumed = now();
      const updated = await db
        .prepare(
          "UPDATE call_verifications SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL AND expires_at >= ?"
        )
        .bind(consumed, String(row.id), consumed)
        .run();
      const changes = (updated as { meta?: { changes?: number } } | null)?.meta?.changes;
      if (changes === 0) return { ok: false };
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
