import { randomUUID } from "node:crypto";
import { ASSESSMENT_CONSENT_VERSION, ASSESSMENT_SERVICE, assessmentPrice, type PatientType } from "@/lib/assessment";
import type { D1Like } from "./d1";
import type { PaymentAttempt } from "../payment-providers/types";

export type AssessmentStatus = "PENDING" | "PAID" | "FAILED" | "REVIEW_REQUIRED";
export type AssessmentOrder = {
  id: string;
  identityId: string;
  patientType: PatientType;
  service: typeof ASSESSMENT_SERVICE;
  amountMinor: number;
  currency: string;
  status: AssessmentStatus;
  providerEnvironment: "test_mode" | "live_mode";
  paymentProvider?: "dodo" | "cashfree";
  paymentAttempts?: PaymentAttempt[];
  checkoutId?: string;
  checkoutUrl?: string;
  paymentId?: string;
  confirmedAmountMinor?: number;
  confirmedCurrency?: string;
  consentVersion: string;
  consentAt: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  reviewReason?: string;
};
export type AssessmentConfirmation = {
  id: string;
  checkoutId: string;
  paymentId: string;
  amountMinor: number;
  currency: string;
};
export type AssessmentRepository = {
  list(identityId: string): Promise<AssessmentOrder[]>;
  get(id: string): Promise<AssessmentOrder | null>;
  byCheckout(checkoutId: string): Promise<AssessmentOrder | null>;
  create(identityId: string, patientType: PatientType, provider?: "dodo" | "cashfree"): Promise<AssessmentOrder>;
  initiate(id: string, checkoutId: string, checkoutUrl: string): Promise<void>;
  fail(id: string): Promise<void>;
  confirm(input: AssessmentConfirmation): Promise<AssessmentOrder>;
  attempts(id: string): Promise<PaymentAttempt[]>;
  recordAttempt(id: string, attempt: PaymentAttempt): Promise<void>;
  review(id: string, reason: string): Promise<void>;
};

export function activeAssessment(orders: AssessmentOrder[]) {
  return orders.find((order) => order.status === "PAID")
    || orders.find((order) => order.status === "REVIEW_REQUIRED")
    || orders.find((order) => order.status === "PENDING")
    || null;
}

function newOrder(identityId: string, patientType: PatientType, provider: "dodo" | "cashfree" = "dodo"): AssessmentOrder {
  const price = assessmentPrice(patientType);
  const createdAt = new Date().toISOString();
  return {
    id: randomUUID(), identityId, patientType, service: ASSESSMENT_SERVICE,
    amountMinor: price.amountMinor, currency: price.currency, status: "PENDING",
    providerEnvironment: "test_mode", paymentProvider: provider, consentVersion: ASSESSMENT_CONSENT_VERSION,
    consentAt: createdAt, createdAt, updatedAt: createdAt,
  };
}

function confirmationReason(order: AssessmentOrder, input: AssessmentConfirmation, others: AssessmentOrder[]) {
  if (!input.paymentId || !input.checkoutId || input.checkoutId !== order.checkoutId) return "provider_reference_mismatch";
  if (input.amountMinor !== order.amountMinor || input.currency !== order.currency) return "amount_or_currency_mismatch";
  if (others.some((other) => other.id !== order.id && other.paymentId === input.paymentId)) {
    throw new Error("Provider payment already belongs to another order.");
  }
  if (others.some((other) => other.id !== order.id && other.identityId === order.identityId
    && (other.status === "PAID" || other.status === "PENDING"))) return "duplicate_assessment_payment";
  return undefined;
}

export function createJsonAssessmentRepository(
  read: () => AssessmentOrder[],
  write: (orders: AssessmentOrder[]) => void,
  patientTypeFor: (identityId: string) => PatientType | undefined,
): AssessmentRepository {
  return {
    async list(identityId) {
      return read().filter((order) => order.identityId === identityId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async get(id) { return read().find((order) => order.id === id) || null; },
    async byCheckout(id) { return read().find((order) => order.checkoutId === id) || null; },
    async create(identityId, patientType, provider) {
      const orders = read();
      if (patientTypeFor(identityId) !== patientType) throw new Error("Patient type changed. Review checkout again.");
      if (activeAssessment(orders.filter((order) => order.identityId === identityId))) throw new Error("Assessment already exists.");
      const order = newOrder(identityId, patientType, provider);
      orders.push(order);
      write(orders);
      return order;
    },
    async initiate(id, checkoutId, checkoutUrl) {
      const orders = read();
      const order = orders.find((row) => row.id === id);
      if (!order || order.status !== "PENDING" || order.checkoutId) throw new Error("Order cannot be restarted.");
      order.checkoutId = checkoutId;
      order.checkoutUrl = checkoutUrl;
      order.updatedAt = new Date().toISOString();
      write(orders);
    },
    async fail(id) {
      const orders = read();
      const order = orders.find((row) => row.id === id);
      if (order?.status === "PENDING") {
        order.status = "FAILED";
        order.updatedAt = new Date().toISOString();
      }
      write(orders);
    },
    async attempts(id) { return (read().find((row) => row.id === id)?.paymentAttempts || [])
      .sort((a, b) => (a.occurredAt || "").localeCompare(b.occurredAt || "")); },
    async recordAttempt(id, attempt) {
      const orders = read();
      const order = orders.find((row) => row.id === id);
      if (order?.paymentProvider !== "cashfree") throw new Error("Invalid payment provider.");
      if (orders.some((row) => row.id !== id && row.paymentAttempts?.some((a) => a.paymentId === attempt.paymentId))) {
        throw new Error("Payment belongs to another order.");
      }
      order.paymentAttempts ||= [];
      const index = order.paymentAttempts.findIndex((a) => a.paymentId === attempt.paymentId);
      if (index < 0) order.paymentAttempts.push(attempt);
      else if (order.paymentAttempts[index].status !== "SUCCESS") order.paymentAttempts[index] = attempt;
      write(orders);
    },
    async review(id, reason) {
      const orders = read();
      const order = orders.find((row) => row.id === id);
      if (!order) throw new Error("Assessment not found.");
      if (order.status !== "PAID") order.status = "REVIEW_REQUIRED";
      order.reviewReason = reason;
      write(orders);
    },
    async confirm(input) {
      const orders = read();
      const order = orders.find((row) => row.id === input.id);
      if (!order) throw new Error("Assessment order not found.");
      if (order.status === "PAID") {
        if (order.paymentId !== input.paymentId) throw new Error("Different payment for an already paid order.");
        return order;
      }
      if (order.paymentId) {
        if (order.paymentId !== input.paymentId) throw new Error("Order already has a confirmed provider payment.");
        return order;
      }
      const reason = confirmationReason(order, input, orders);
      Object.assign(order, {
        status: reason ? "REVIEW_REQUIRED" : "PAID", paymentId: input.paymentId,
        confirmedAmountMinor: input.amountMinor, confirmedCurrency: input.currency,
        confirmedAt: new Date().toISOString(), reviewReason: reason,
      });
      order.updatedAt = order.confirmedAt!;
      write(orders);
      return order;
    },
  };
}

function fromRow(row: Record<string, unknown> | null): AssessmentOrder | null {
  if (!row) return null;
  return {
    id: String(row.id), identityId: String(row.identity_id), patientType: row.patient_type as PatientType,
    service: ASSESSMENT_SERVICE, amountMinor: Number(row.amount_minor), currency: String(row.currency),
    status: row.status as AssessmentStatus, providerEnvironment: row.provider_environment as AssessmentOrder["providerEnvironment"],
    paymentProvider: (row.payment_provider || "dodo") as AssessmentOrder["paymentProvider"],
    checkoutId: row.provider_checkout_id ? String(row.provider_checkout_id) : undefined,
    checkoutUrl: row.provider_checkout_url ? String(row.provider_checkout_url) : undefined,
    paymentId: row.provider_payment_id ? String(row.provider_payment_id) : undefined,
    confirmedAmountMinor: row.confirmed_amount_minor == null ? undefined : Number(row.confirmed_amount_minor),
    confirmedCurrency: row.confirmed_currency ? String(row.confirmed_currency) : undefined,
    consentVersion: String(row.consent_version), consentAt: String(row.consent_at),
    createdAt: String(row.created_at), confirmedAt: row.confirmed_at ? String(row.confirmed_at) : undefined,
    updatedAt: String(row.updated_at),
    reviewReason: row.review_reason ? String(row.review_reason) : undefined,
  };
}

export function createD1AssessmentRepository(db: D1Like): AssessmentRepository {
  const get = async (id: string) => fromRow(await db.prepare("SELECT * FROM assessment_orders WHERE id = ?").bind(id).first());
  const list = async (identityId: string) => {
    const { results } = await db.prepare("SELECT * FROM assessment_orders WHERE identity_id = ? ORDER BY created_at DESC").bind(identityId).all();
    return results.map((row) => fromRow(row)!);
  };
  return {
    get, list,
    async byCheckout(id) {
      return fromRow(await db.prepare("SELECT * FROM assessment_orders WHERE provider_checkout_id = ?").bind(id).first());
    },
    async create(identityId, patientType, provider) {
      if (activeAssessment(await list(identityId))) throw new Error("Assessment already exists.");
      const order = newOrder(identityId, patientType, provider);
      await db.prepare(`INSERT INTO assessment_orders
        (id, identity_id, patient_type, service, amount_minor, currency, status, provider_environment, consent_version, consent_at, created_at, updated_at, payment_provider)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(order.id, identityId, patientType, order.service, order.amountMinor, order.currency, order.status,
          order.providerEnvironment, order.consentVersion, order.consentAt, order.createdAt, order.updatedAt, order.paymentProvider).run();
      return order;
    },
    async initiate(id, checkoutId, checkoutUrl) {
      await db.prepare(`UPDATE assessment_orders SET provider_checkout_id = ?, provider_checkout_url = ?, updated_at = ?
        WHERE id = ? AND status = 'PENDING' AND provider_checkout_id IS NULL`)
        .bind(checkoutId, checkoutUrl, new Date().toISOString(), id).run();
      const saved = await get(id);
      if (saved?.checkoutId !== checkoutId) throw new Error("Order cannot be restarted.");
    },
    async fail(id) {
      await db.prepare("UPDATE assessment_orders SET status = 'FAILED', updated_at = ? WHERE id = ? AND status = 'PENDING'").bind(new Date().toISOString(), id).run();
    },
    async attempts(id) {
      const { results } = await db.prepare("SELECT * FROM assessment_payment_attempts WHERE assessment_order_id = ? ORDER BY COALESCE(occurred_at, updated_at)").bind(id).all();
      return results.map((row) => ({
        paymentId: String(row.provider_payment_id), status: String(row.status),
        amountMinor: Number(row.amount_minor), currency: String(row.currency),
        captured: Boolean(row.captured), adjusted: Boolean(row.adjusted),
        occurredAt: row.occurred_at ? String(row.occurred_at) : undefined,
      }));
    },
    async recordAttempt(id, attempt) {
      if ((await get(id))?.paymentProvider !== "cashfree") throw new Error("Invalid payment provider.");
      await db.prepare(`INSERT INTO assessment_payment_attempts
        (payment_provider, provider_payment_id, assessment_order_id, status, amount_minor, currency, captured, adjusted, updated_at, occurred_at)
        VALUES ('cashfree', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(payment_provider, provider_payment_id) DO UPDATE SET
        status=excluded.status, amount_minor=excluded.amount_minor, currency=excluded.currency,
        captured=excluded.captured, adjusted=excluded.adjusted, updated_at=excluded.updated_at, occurred_at=excluded.occurred_at
        WHERE assessment_payment_attempts.assessment_order_id=excluded.assessment_order_id AND assessment_payment_attempts.status <> 'SUCCESS'`)
        .bind(attempt.paymentId, id, attempt.status, attempt.amountMinor, attempt.currency,
          Number(attempt.captured), Number(attempt.adjusted), new Date().toISOString(), attempt.occurredAt || null).run();
      const saved = await db.prepare("SELECT assessment_order_id FROM assessment_payment_attempts WHERE payment_provider='cashfree' AND provider_payment_id=?").bind(attempt.paymentId).first();
      if (saved?.assessment_order_id !== id) throw new Error("Payment belongs to another order.");
    },
    async review(id, reason) {
      await db.prepare(`UPDATE assessment_orders SET status=CASE WHEN status='PAID' THEN status ELSE 'REVIEW_REQUIRED' END,
        review_reason=?, updated_at=? WHERE id=?`).bind(reason, new Date().toISOString(), id).run();
    },
    async confirm(input) {
      const order = await get(input.id);
      if (!order) throw new Error("Assessment order not found.");
      if (order.status === "PAID") {
        if (order.paymentId !== input.paymentId) throw new Error("Different payment for an already paid order.");
        return order;
      }
      if (order.paymentId) {
        if (order.paymentId !== input.paymentId) throw new Error("Order already has a confirmed provider payment.");
        return order;
      }
      const used = await db.prepare("SELECT id FROM assessment_orders WHERE provider_payment_id = ? AND id <> ?").bind(input.paymentId, input.id).first();
      if (used) throw new Error("Provider payment already belongs to another order.");
      const reason = confirmationReason(order, input, await list(order.identityId));
      const confirmedAt = new Date().toISOString();
      const save = async (status: string, review: string | undefined) => db.prepare(`UPDATE assessment_orders SET
        status = ?, provider_payment_id = ?, confirmed_amount_minor = ?, confirmed_currency = ?, confirmed_at = ?, updated_at = ?, review_reason = ?
        WHERE id = ? AND status <> 'PAID'`).bind(status, input.paymentId, input.amountMinor, input.currency,
          confirmedAt, confirmedAt, review || null, input.id).run();
      try {
        await save(reason ? "REVIEW_REQUIRED" : "PAID", reason);
      } catch (error) {
        // A concurrent checkout may have claimed the account's active-order
        // constraint. Preserve the confirmed charge for manual review, never
        // activate a second assessment.
        const others = await list(order.identityId);
        if (!others.some((row) => row.id !== order.id && (row.status === "PAID" || row.status === "PENDING"))) throw error;
        await save("REVIEW_REQUIRED", "duplicate_assessment_payment");
      }
      const saved = (await get(input.id))!;
      if (saved.paymentId !== input.paymentId) throw new Error("Order was confirmed by a different payment.");
      return saved;
    },
  };
}
