import { formatAppointmentDate, formatTimeLabel, scheduleTimezoneLabel } from "@/lib/appointment-slots";
import type { Application, Identity, PaymentRecord } from "@/lib/repo/types";

export type AccountAssessment = {
  paymentStatus: string;
  paymentLabel: string;
  applicationId?: string;
  conversationVerificationId?: string;
  appointment: {
    date: string;
    time: string;
    timezoneLabel: string;
    dateLabel: string;
    timeLabel: string;
  } | null;
  meeting: {
    status: string;
    joinUrl?: string;
  } | null;
};

export type AccountView = {
  patient: {
    name: string;
    email: string;
  };
  assessment: AccountAssessment | null;
};

function latestApplication(apps: Application[]) {
  return [...apps].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null;
}

function appointmentFrom(app: Application) {
  if (!app.preferredConsultationDate || !app.appointmentTime) return null;
  return {
    date: app.preferredConsultationDate,
    time: app.appointmentTime,
    timezoneLabel: scheduleTimezoneLabel(),
    dateLabel: formatAppointmentDate(app.preferredConsultationDate),
    timeLabel: formatTimeLabel(app.appointmentTime),
  };
}

function meetingFrom(app: Application) {
  if (app.paymentStatus !== "PAID") return null;
  if (app.meetingStatus === "provisioned" && app.meetingJoinUrl) {
    return { status: "provisioned", joinUrl: app.meetingJoinUrl };
  }
  if (app.meetingStatus === "failed" || app.meetingStatus === "pending" || app.meetingStatus === "slot_unavailable") {
    return { status: app.meetingStatus };
  }
  return { status: "pending" };
}

export function toAccountView(input: {
  patient: Identity;
  applications: Application[];
  payments?: PaymentRecord[];
}): AccountView {
  void input.payments;
  const app = latestApplication(input.applications);
  if (!app) {
    return {
      patient: { name: input.patient.name, email: input.patient.email },
      assessment: null,
    };
  }
  const paid = app.paymentStatus === "PAID";
  return {
    patient: { name: input.patient.name, email: input.patient.email },
    assessment: {
      paymentStatus: app.paymentStatus,
      paymentLabel: paid ? "PAID" : "Assessment not yet paid",
      applicationId: paid ? app.applicationId : undefined,
      conversationVerificationId: paid ? app.conversationVerificationId : undefined,
      appointment: appointmentFrom(app),
      meeting: meetingFrom(app),
    },
  };
}

export function accountHasInternalIds(view: AccountView) {
  const blob = JSON.stringify(view);
  return /"id"\s*:/.test(blob);
}
