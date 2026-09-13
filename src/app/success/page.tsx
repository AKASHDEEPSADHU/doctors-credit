import { cookies } from "next/headers";
import { sendApplicationConfirmationOnce } from "@/lib/email";
import { getRepository } from "@/lib/repo";
import { getSession, setSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const repo = await getRepository();
  const jar = await cookies();
  const pendingId = jar.get("dc_application")?.value;
  const session = await getSession();

  let paid = pendingId ? await repo.getApplicationById(pendingId) : null;

  if (sessionId) {
    const stripe = getStripe();
    if (!stripe) {
      return <Pending copy="Payment confirmation is not configured. Contact care@dcredit.in with your receipt." />;
    }
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    const stripePaid = checkout.payment_status === "paid" || checkout.status === "complete";
    if (!stripePaid) {
      return (
        <Pending copy="Stripe has not confirmed this payment yet. If you were charged, wait a moment and refresh — we will not show an application ID until the payment is verified server-side." />
      );
    }
    const meta = checkout.metadata || {};
    const existing =
      (await repo.getApplicationByStripeSession(sessionId)) ||
      (meta.orderId ? await repo.getApplicationById(meta.orderId) : null) ||
      (paid && paid.id ? paid : null);
    if (!existing) {
      return (
        <Pending copy="Your payment was received, but the application record is still being written. Keep this tab open and refresh shortly. Do not pay again. If this persists, email care@dcredit.in with your Stripe receipt." />
      );
    }
    const alreadyPaid = existing.paymentStatus === "PAID";
    paid = await repo.confirmPayment({
      id: existing.id,
      stripeSessionId: sessionId,
      paymentReference: sessionId,
      stripePaymentIntent: String(checkout.payment_intent || ""),
    });
    const email = checkout.customer_email || checkout.customer_details?.email;
    if (email && paid) {
      await setSession({ patientId: paid.identityId, email: paid.email });
    } else if (paid) {
      const identity = await repo.getIdentityById(paid.identityId);
      if (identity) await setSession({ patientId: identity.id, email: identity.email });
    }
    if (paid?.paymentStatus === "PAID") {
      try {
        const mail = await sendApplicationConfirmationOnce(paid, alreadyPaid);
        if (mail.reason !== "already_confirmed") {
          await repo.appendAudit(mail.sent ? "email_sent" : "email_failed", mail.sent ? "sent" : mail.reason, {
            applicationId: paid.applicationId,
            identityId: paid.identityId,
          });
        }
      } catch {
        await repo.appendAudit("email_failed", "success_page", {
          applicationId: paid.applicationId,
          identityId: paid.identityId,
        });
      }
    }
  } else if (paid && session && paid.identityId !== session.patientId) {
    paid = null;
  }

  if (!paid || paid.paymentStatus !== "PAID") {
    if (session) {
      const apps = await repo.listApplicationsForIdentity(session.patientId);
      paid = apps.find((a) => a.paymentStatus === "PAID") || null;
    }
  }

  if (!paid || paid.paymentStatus !== "PAID") {
    return (
      <Pending copy="We can only show your Application ID after payment is confirmed on our servers. If you just paid, refresh this page in a few seconds." />
    );
  }

  return (
    <main id="main" className="legal confirm-page">
      <p className="eyebrow">Application received</p>
      <h1>Your DCredit application has been received.</h1>
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
        Keep these details available when communicating with DCredit. We may ask
        for your Conversation Verification ID to verify your case.
      </p>
      <p>
        DCredit will never ask for your password, banking PIN, card CVV or
        one-time authentication code.
      </p>
      <p className="fine">
        Application status: {paid.applicationStatus}. A coordinator will use your
        preferred conversation date where possible. The $5 Initial Assessment is
        a conversation with DCredit, not a clinical evaluation. You can also{" "}
        <a href="/account">open your file</a> or{" "}
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
