import { cookies } from "next/headers";
import { confirmationAppointment } from "@/lib/confirmation-copy";
import { getRepository } from "@/lib/repo";
import { getSession } from "@/lib/session";
import { loadConfirmedApplication } from "@/lib/success-state";
import { formatAssessmentAmount } from "@/lib/assessment";
import AssessmentPaymentStatus from "@/components/AssessmentPaymentStatus";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ assessment?: string; order_id?: string }> }) {
  const repo = await getRepository();
  const jar = await cookies();
  const pendingId = jar.get("dc_application")?.value;
  const session = await getSession();
  const assessmentId = jar.get("dc_assessment_order")?.value;
  const query = await searchParams;
  if (query.assessment === "1") {
    const returnedId = query.order_id?.startsWith("ipa_") ? query.order_id.slice(4) : assessmentId;
    const order = session && returnedId ? await repo.assessments.get(returnedId) : null;
    if (!order || order.identityId !== session?.patientId) return <Pending assessment copy="Open My Account to view your payment status. No payment is confirmed by this browser return." />;
    if (order.status !== "PAID") return <><Pending assessment copy={order.status === "FAILED"
      ? "Your payment failed or was declined. Open My Account before starting a new test attempt."
      : order.status === "REVIEW_REQUIRED" ? "Your payment requires manual review. Do not pay again. Contact DCREDIT."
      : "Your payment is pending server confirmation. Do not pay again. Refresh this page or open My Account."} />
      {order.status === "PENDING" && order.paymentProvider === "cashfree" ? <div className="legal"><AssessmentPaymentStatus orderId={order.id} /></div> : null}</>;
    return (
      <main id="main" className="legal confirm-page">
        <p className="eyebrow">Initial Patient Assessment</p>
        <h1>Test payment confirmed.</h1>
        <p>{formatAssessmentAmount(order.confirmedAmountMinor!, order.confirmedCurrency!)} {order.confirmedCurrency}</p>
        <p>This is a {order.paymentProvider === "cashfree" ? "Cashfree sandbox" : "historical Dodo test-mode"} payment, not a live charge. Live assessment activation remains disabled pending approval of the cancellation/refund policy.</p>
        {order.reviewReason ? <p role="alert">An additional payment discrepancy requires manual review. Do not pay again.</p> : null}
        <p>The Initial Patient Assessment is a coordination and assistance fee, not medical treatment or medical advice.</p>
        <a href="/account">Open My Account</a>
      </main>
    );
  }
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

function Pending({ copy, assessment = false }: { copy: string; assessment?: boolean }) {
  return (
    <main id="main" className="legal confirm-page">
      <p className="eyebrow">Payment</p>
      <h1>Check your payment status.</h1>
      <p>{copy}</p>
      <p><a href="/account">Open My Account</a> · <a href={assessment ? "/signin?next=%2Fsuccess%3Fassessment%3D1" : "/signin?next=/success"}>Sign in</a></p>
      <p className="fine">
        DCredit will never ask for your password, banking PIN, card CVV or
        one-time authentication code.
      </p>
    </main>
  );
}
