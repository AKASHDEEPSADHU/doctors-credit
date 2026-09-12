import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export type Patient = {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  createdAt: string;
  googleSub?: string;
  stripeCustomerId?: string;
};

export type Order = {
  id: string;
  patientId: string;
  sku: string;
  title: string;
  amountCents: number;
  currency: string;
  status: "pending" | "paid" | "refunded";
  stripeSessionId?: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  amountCents: number;
  currency: string;
  createdAt: string;
  stripePaymentIntent?: string;
};

type DB = { patients: Patient[]; orders: Order[]; payments: Payment[] };

const EMPTY: DB = { patients: [], orders: [], payments: [] };

function filePath() {
  return path.join(process.cwd(), "data", "store.json");
}

function load(): DB {
  try {
    const p = filePath();
    if (!existsSync(p)) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(readFileSync(p, "utf8")) };
  } catch {
    return { ...EMPTY };
  }
}

function save(db: DB) {
  const dir = path.dirname(filePath());
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath(), JSON.stringify(db, null, 2));
}

export function upsertPatient(input: {
  email: string;
  name: string;
  phone?: string;
  country?: string;
  googleSub?: string;
  stripeCustomerId?: string;
}): Patient {
  const db = load();
  const email = input.email.trim().toLowerCase();
  let patient = db.patients.find(
    (p) => p.email === email || (input.googleSub && p.googleSub === input.googleSub)
  );
  if (!patient) {
    patient = {
      id: randomUUID(),
      email,
      name: input.name.trim(),
      phone: (input.phone || "").trim(),
      country: (input.country || "").trim(),
      createdAt: new Date().toISOString(),
      googleSub: input.googleSub,
      stripeCustomerId: input.stripeCustomerId,
    };
    db.patients.push(patient);
  } else {
    patient.email = email || patient.email;
    patient.name = input.name.trim() || patient.name;
    if (input.phone) patient.phone = input.phone.trim();
    if (input.country) patient.country = input.country.trim();
    if (input.googleSub) patient.googleSub = input.googleSub;
    if (input.stripeCustomerId) patient.stripeCustomerId = input.stripeCustomerId;
  }
  save(db);
  return patient;
}

export function getPatientById(id: string) {
  return load().patients.find((p) => p.id === id) ?? null;
}

export function getPatientByEmail(email: string) {
  return load().patients.find((p) => p.email === email.trim().toLowerCase()) ?? null;
}

export function createOrder(input: Omit<Order, "id" | "createdAt">): Order {
  const db = load();
  const order: Order = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  save(db);
  return order;
}

export function markOrderPaid(orderId: string, stripePaymentIntent?: string) {
  const db = load();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = "paid";
  const payment: Payment = {
    id: randomUUID(),
    orderId,
    amountCents: order.amountCents,
    currency: order.currency,
    createdAt: new Date().toISOString(),
    stripePaymentIntent,
  };
  db.payments.push(payment);
  save(db);
  return { order, payment };
}

export function attachStripeSession(orderId: string, stripeSessionId: string) {
  const db = load();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.stripeSessionId = stripeSessionId;
  save(db);
  return order;
}

export function getOrderByStripeSession(sessionId: string) {
  return load().orders.find((o) => o.stripeSessionId === sessionId) ?? null;
}

export function patientLedger(patientId: string) {
  const db = load();
  const orders = db.orders
    .filter((o) => o.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const payments = db.payments
    .filter((p) => orders.some((o) => o.id === p.orderId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { orders, payments };
}
