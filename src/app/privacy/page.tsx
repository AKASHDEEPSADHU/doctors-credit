export default function PrivacyPage() {
  return (
    <main id="main" className="legal">
      <p className="eyebrow">Privacy</p>
      <h1>How we hold what you tell us.</h1>
      <p>
        DCredit is a care-coordination platform, not a hospital. The $5
        application collects operational details a coordinator needs: name,
        email, phone, location, procedure category, insurance status and
        timeline. It is not a medical-record intake.
      </p>
      <h2>What we collect</h2>
      <p>
        Google sign-in (name and email), package payments processed by Stripe
        (we never store card numbers, CVV or banking passwords), application
        status, and messages you send. Payment is marked paid only after
        Stripe confirms it on the server. Operational fields are copied to a
        private Google Sheet used as a temporary CRM. That sheet is not public
        and is not a healthcare database. We do not store full medical history,
        imaging, prescriptions or detailed diagnoses there.
      </p>
      <h2>HIPAA</h2>
      <p>
        This website does not claim HIPAA compliance unless and until that
        program is fully implemented and maintained for the relevant workflows.
      </p>
      <h2>Your file</h2>
      <p>
        After payment is confirmed you receive an Application ID and a
        Conversation Verification ID. Those identifiers are for genuine DCredit
        communication. They are not passwords, OTPs or banking PINs. Ask us to
        close the file and we will stop using it for coordination.
      </p>
    </main>
  );
}
