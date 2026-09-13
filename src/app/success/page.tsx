import { cookies } from "next/headers";
import { confirmationAppointment } from "@/lib/confirmation-copy";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { loadConfirmedApplication } from "@/lib/success-state";

export default async function SuccessPage() {
  const repo = await getRepository();
  const jar = await cookies();
  const pendingId = jar.get("dc_application")?.value;
  const session = await getSession();
  const paid = await loadConfirmedApplication(repo, { pendingId, session });

  if (!paid || paid.paymentStatus !== "PAID") {
    return (
      <Pending copy="Payment is still processing. We only confirm your assessment after Dodo Payments signs a payment.succeeded webhook. If you just paid, refresh this page in a few seconds. Do not pay again." />
    );
  }

  const appointment = confirmationAppointment(paid);

  return (
    <main id="main" className="legal confirm-page">
      <p className="eyebrow">Initial Care Conversation</p>
      <h1>Your care conversation has been confirmed.</h1>
      {appointment ? (
        <div className="appointment-block">
          <p>Your conversation is scheduled for:</p>
          <p>
            <strong>{appointment.dateLabel}</strong>
            <br />
            <strong>
              {appointment.timeLabel} {appointment.timezoneLabel}
            </strong>
          </p>
        </div>
      ) : null}
      {appointment?.meetingReady ? (
        <>
          <p>
            Join your DCredit conversation:{" "}
            <a href={appointment.joinUrl}>Join Zoom meeting</a>
          </p>
          <p>Please join a few minutes before your scheduled time.</p>
        </>
      ) : (
        <p>
          Payment received. We&apos;re finalizing your conversation details. Your
          appointment information will appear here once confirmed.
        </p>
      )}
      <div className="codes">
        <div>
          <span className="tag">Application ID</span>
          <strong>{paid.applicationId}</strong>
        </div>
        <div>
          <span className="tag">Conversation Verification ID</span>
          <strong>{paid.conversationVerificationId}</strong>
        </div>
      </div>
      <p>
        This conversation is with a DCredit care coordinator. It is not a medical
        diagnosis or clinical evaluation.
      </p>
      <p>
        DCredit will never ask for your password, banking PIN, card CVV or
        one-time authentication code.
      </p>
      <p className="fine">
        You can also <a href="/account">open My Account</a> or{" "}
        <a href="/verify">verify a DCredit communication</a>.
      </p>
    </main>
  );
}

function Pending({ copy }: { copy: string }) {
  return (
    <main id="main" className="legal confirm-page">
      <p className="eyebrow">Payment</p>
      <h1>We are confirming your application.</h1>
      <p>{copy}</p>
      <p className="fine">
        DCredit will never ask for your password, banking PIN, card CVV or
        one-time authentication code.
      </p>
    </main>
  );
}
