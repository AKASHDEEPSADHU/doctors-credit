import { cookies } from "next/headers";
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
      <Pending copy="Payment is still processing. We only show your Application ID after Dodo Payments confirms the charge on our servers. If you just paid, refresh this page in a few seconds. Do not pay again." />
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
