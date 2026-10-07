import { formatAppointmentDate, formatTimeLabel, scheduleTimezoneLabel } from "@/lib/appointment-slots";
import type { Application } from "@/lib/repo/types";

export function confirmationAppointment(app: Application) {
  if (!app.preferredConsultationDate || !app.appointmentTime) return null;
  return {
    dateLabel: formatAppointmentDate(app.preferredConsultationDate),
    timeLabel: formatTimeLabel(app.appointmentTime),
    timezoneLabel: scheduleTimezoneLabel(),
    joinUrl: app.paymentStatus === "PAID" && app.meetingStatus === "provisioned" ? app.meetingJoinUrl : "",
    meetingReady: app.paymentStatus === "PAID" && app.meetingStatus === "provisioned" && Boolean(app.meetingJoinUrl),
  };
}
