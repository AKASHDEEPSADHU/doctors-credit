import VerifyForm from "@/app/verify/VerifyForm";

export const metadata = { title: "Verify a DCredit communication — Doctor's Credit" };

export default function VerifyPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Verify a DCredit Communication</p>
      <h1>Confirm that a call or message is genuinely from DCredit.</h1>
      <p>
        A coordinator may give you a temporary Call Verification ID such as
        CALL-48291. Enter it here. The page will only say whether that ID is
        valid — it will not display any application details.
      </p>
      <VerifyForm />
      <h2>If DCredit calls you</h2>
      <p>
        A coordinator should introduce themselves by name, then ask for your
        Conversation Verification ID before discussing your application. That
        Conversation Verification ID is not a password, OTP, or banking PIN.
      </p>
      <h2>If you call DCredit</h2>
      <p>
        Be ready with your Application ID (DC-000001) and Conversation
        Verification ID (CV-7K4P9). If we cannot verify the case, we will not
        discuss application details.
      </p>
    </main>
  );
}
